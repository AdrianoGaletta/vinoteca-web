'use client'

import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  function agregarAlCarrito(vino) {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === vino.id)
      if (existe) {
        return prev.map(item =>
          item.id === vino.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { ...vino, cantidad: 1 }]
    })
  }

  function eliminarDelCarrito(id) {
    setCarrito(prev => prev.filter(item => item.id !== id))
  }

  function actualizarCantidad(id, cantidad) {
    if (cantidad <= 0) {
      eliminarDelCarrito(id)
      return
    }
    setCarrito(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad } : item
      )
    )
  }

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const totalPrecio = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      totalItems,
      totalPrecio
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}