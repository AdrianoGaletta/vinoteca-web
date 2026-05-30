'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])
  const [usuario, setUsuario] = useState(null)
  const carritoIdRef = useRef(null)
  const supabase = createClient()

  // Escucha cambios de sesión
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUsuario(user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Cuando cambia el usuario, carga el carrito
  useEffect(() => {
    if (usuario) {
      cargarCarritoDesdeSupabase()
    } else {
      carritoIdRef.current = null
      const guardado = localStorage.getItem('carrito_local')
      if (guardado) {
        try { setCarrito(JSON.parse(guardado)) } catch { setCarrito([]) }
      } else {
        setCarrito([])
      }
    }
  }, [usuario])

  // Persiste en localStorage cuando no hay sesión
  useEffect(() => {
    if (!usuario) {
      localStorage.setItem('carrito_local', JSON.stringify(carrito))
    }
  }, [carrito, usuario])

  // Obtiene el carritoId, creándolo si no existe
  async function obtenerOCrearCarritoId() {
    if (carritoIdRef.current) return carritoIdRef.current

    let { data: carritoExistente } = await supabase
      .from('carritos')
      .select('id')
      .eq('usuario_id', usuario.id)
      .eq('estado', 'activo')
      .maybeSingle()

    if (!carritoExistente) {
      const { data: nuevo, error } = await supabase
        .from('carritos')
        .insert({ usuario_id: usuario.id, estado: 'activo' })
        .select('id')
        .single()
      if (error) { console.error('Error creando carrito:', error.message, error.code, error.details); return null }
      carritoExistente = nuevo
    }


    carritoIdRef.current = carritoExistente.id
    return carritoExistente.id
  }

  async function cargarCarritoDesdeSupabase() {
    const cid = await obtenerOCrearCarritoId()
    if (!cid) return

    // Migrar carrito local si hay items
    const local = localStorage.getItem('carrito_local')
    if (local) {
      const itemsLocales = JSON.parse(local)
      if (itemsLocales.length > 0) {
        const upserts = itemsLocales.map(item => ({
          carrito_id: cid,
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        }))
        await supabase.from('carrito_items').upsert(upserts, { onConflict: 'carrito_id,producto_id' })
      }
      localStorage.removeItem('carrito_local')
    }

    // Cargar items desde Supabase
    const { data: items, error } = await supabase
      .from('carrito_items')
      .select(`
        id,
        cantidad,
        precio_unitario,
        productos (
          id,
          nombre,
          bodega,
          varietal,
          precio,
          imagen
        )
      `)
      .eq('carrito_id', cid)

    if (error) { console.error('Error cargando carrito:', error); return }

    if (items) {
      setCarrito(items.map(item => ({
        id: item.productos.id,
        nombre: item.productos.nombre,
        bodega: item.productos.bodega,
        varietal: item.productos.varietal,
        precio: item.precio_unitario,
        imagen: item.productos.imagen,
        cantidad: item.cantidad,
      })))
    }
  }

  async function agregarAlCarrito(vino) {
    // Actualizar estado local inmediatamente
    setCarrito(prev => {
      const existe = prev.find(item => item.id === vino.id)
      if (existe) {
        return prev.map(item =>
          item.id === vino.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prev, { ...vino, cantidad: 1 }]
    })

    if (!usuario) return

    const cid = await obtenerOCrearCarritoId()
    if (!cid) return

    // Buscar si ya existe el item
    const { data: itemActual, error: errSelect } = await supabase
      .from('carrito_items')
      .select('id, cantidad')
      .eq('carrito_id', cid)
      .eq('producto_id', vino.id)
      .maybeSingle()

    if (errSelect) {
      console.error('Error buscando item:', errSelect.message, errSelect.code, errSelect.details)
      return
    }

    if (itemActual) {
      // Actualizar cantidad existente
      const { error: errUpdate } = await supabase
        .from('carrito_items')
        .update({ cantidad: itemActual.cantidad + 1 })
        .eq('id', itemActual.id)
      if (errUpdate) console.error('Error actualizando item:', errUpdate.message, errUpdate.code)
    } else {
      // Insertar nuevo item
      const { error: errInsert } = await supabase
        .from('carrito_items')
        .insert({
          carrito_id: cid,
          producto_id: vino.id,
          cantidad: 1,
          precio_unitario: vino.precio,
        })
      if (errInsert) console.error('Error insertando item:', errInsert.message, errInsert.code, errInsert.details, errInsert.hint)
    }
  }

  async function eliminarDelCarrito(id) {
    setCarrito(prev => prev.filter(item => item.id !== id))

    if (!usuario) return
    const cid = carritoIdRef.current
    if (!cid) return

    await supabase
      .from('carrito_items')
      .delete()
      .eq('carrito_id', cid)
      .eq('producto_id', id)
  }

  async function actualizarCantidad(id, cantidad) {
    if (cantidad <= 0) { eliminarDelCarrito(id); return }

    setCarrito(prev =>
      prev.map(item => item.id === id ? { ...item, cantidad } : item)
    )

    if (!usuario) return
    const cid = carritoIdRef.current
    if (!cid) return

    await supabase
      .from('carrito_items')
      .update({ cantidad })
      .eq('carrito_id', cid)
      .eq('producto_id', id)
  }

  async function vaciarCarrito() {
    setCarrito([])

    if (!usuario) return
    const cid = carritoIdRef.current
    if (!cid) return

    await supabase.from('carrito_items').delete().eq('carrito_id', cid)
  }

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const totalPrecio = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  return (
    <CartContext.Provider value={{
      carrito,
      usuario,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      totalItems,
      totalPrecio,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
