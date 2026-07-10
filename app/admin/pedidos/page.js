import { createAdminClient } from '@/lib/supabase/admin'
import PedidosTable from './PedidosTable'

export const metadata = { title: 'Pedidos | Administración' }
export const dynamic = 'force-dynamic'

const ESTADOS_VENTA = ['pagado', 'confirmado', 'en_preparacion', 'enviado', 'entregado']

// El acceso ya está garantizado por proxy.js y app/admin/layout.js.
// Los datos se leen con el cliente service-role porque el panel necesita
// ver los pedidos de TODOS los usuarios (RLS limita al dueño).
export default async function AdminPedidosPage() {
  const admin = createAdminClient()

  const { data: pedidos, error } = await admin
    .from('pedidos')
    .select(`
      id, created_at, estado, subtotal, costo_envio, total,
      nombre_receptor, direccion_entrega, ciudad_entrega, provincia_entrega, notas,
      pedido_items ( id, nombre_producto, bodega_producto, cantidad, precio_unitario ),
      transacciones ( estado, monto, moneda )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#f44336' }}>Error al cargar los pedidos: {error.message}</p>
      </div>
    )
  }

  const lista = pedidos ?? []
  const ventas = lista.filter(p => ESTADOS_VENTA.includes(p.estado))
  const stats = {
    totalPedidos: lista.length,
    ventas: ventas.length,
    ingresos: ventas.reduce((acc, p) => acc + Number(p.total), 0),
    pendientes: lista.filter(p => p.estado === 'pendiente').length,
  }

  return <PedidosTable pedidos={lista} stats={stats} />
}
