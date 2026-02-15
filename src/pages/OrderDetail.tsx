import { useParams, Link } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const { orders } = useOrders()

  const order = orders.find(o => o.id === Number(id))

  if (!order) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-semibold">❌ Orden no encontrada</p>
        <Link to="/orders" className="text-blue-600 underline mt-2 inline-block">
          ← Volver a órdenes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🧾 Orden #{order.orderNumber}</h1>
          <p className="text-gray-600">Empresa: {order.company}</p>
          <p className="text-gray-600">Sucursal: {order.branch}</p>
          <p className="text-gray-600">Estado: {order.status}</p>
          <p className="text-gray-600">Fecha: {order.date}</p>
        </div>

        <Link
          to="/orders"
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900"
        >
          ← Volver
        </Link>
      </div>

      {/* Materiales */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3 text-blue-700">📦 Materiales</h2>
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="text-left p-2">Descripción</th>
              <th className="text-center p-2">Cant</th>
              <th className="text-right p-2">Precio Unit</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.materials.map((m, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{m.description}</td>
                <td className="p-2 text-center">{m.quantity}</td>
                <td className="p-2 text-right">C$ {m.unitPrice.toFixed(2)}</td>
                <td className="p-2 text-right">C$ {m.total.toFixed(2)}</td>
              </tr>
            ))}
            {order.materials.length === 0 && (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-400">
                  No hay materiales
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mano de obra */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3 text-green-700">👷 Mano de Obra</h2>
        <table className="w-full text-sm">
          <thead className="bg-green-50">
            <tr>
              <th className="text-left p-2">Descripción</th>
              <th className="text-center p-2">Cant</th>
              <th className="text-right p-2">Precio Unit</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.labor.map((l, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{l.description}</td>
                <td className="p-2 text-center">{l.quantity}</td>
                <td className="p-2 text-right">C$ {l.unitPrice.toFixed(2)}</td>
                <td className="p-2 text-right">C$ {l.total.toFixed(2)}</td>
              </tr>
            ))}
            {order.labor.length === 0 && (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-400">
                  No hay mano de obra
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="bg-slate-900 text-white p-5 rounded-xl shadow flex justify-between items-center">
        <div>
          <p>🚚 Transporte: C$ {order.transport.toFixed(2)}</p>
        </div>
        <div className="text-xl font-bold">
          Total General: C$ {order.total.toFixed(2)}
        </div>
      </div>
    </div>
  )
}
