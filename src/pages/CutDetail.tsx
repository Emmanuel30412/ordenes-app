import { useParams, Link } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"

export default function CutDetail() {
  const { id } = useParams()
  const { cuts, orders } = useOrders()

  const cut = cuts.find((c) => c.id === id)

  if (!cut) return <p className="p-4 text-red-600">Corte no encontrado</p>

  // 🔎 Traemos las órdenes completas a partir de los orderId guardados en el corte
  const cutOrders = orders.filter((o) =>
    cut.orders.some((co) => co.orderId === o.id)
  )

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">📄 Detalle del Corte</h1>

      {/* Resumen del corte */}
      <div className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Desde</p>
          <p className="font-semibold">{cut.from}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Hasta</p>
          <p className="font-semibold">{cut.to}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Facturado</p>
          <p className="font-semibold text-blue-600">C$ {cut.totalFacturado.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Ganancia Real</p>
          <p className="font-bold text-green-600">C$ {cut.gananciaReal.toFixed(2)}</p>
        </div>
      </div>

      {/* Órdenes incluidas */}
      <div>
        <h2 className="font-semibold mb-2">📦 Órdenes incluidas en el corte</h2>

        {cutOrders.length === 0 && (
          <p className="text-gray-500">No se encontraron órdenes para este corte.</p>
        )}

        <div className="space-y-4">
          {cutOrders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow p-4 space-y-3 border-l-8 border-blue-500">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="font-semibold text-lg">
                    Orden #{o.orderNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {o.company} – {o.branch} – {o.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Orden</p>
                  <p className="font-bold text-blue-600">C$ {o.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Materiales */}
              <div>
                <p className="font-semibold text-sm mb-1">📦 Materiales</p>
                <div className="overflow-auto">
                  <table className="w-full text-sm border">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 text-left">Descripción</th>
                        <th className="p-2 text-center">Cant</th>
                        <th className="p-2 text-right">Unit</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.materials.map((m, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{m.description}</td>
                          <td className="p-2 text-center">{m.quantity}</td>
                          <td className="p-2 text-right">C$ {m.unitPrice.toFixed(2)}</td>
                          <td className="p-2 text-right">C$ {m.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mano de obra */}
              <div>
                <p className="font-semibold text-sm mb-1">👷 Mano de obra</p>
                <div className="overflow-auto">
                  <table className="w-full text-sm border">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 text-left">Descripción</th>
                        <th className="p-2 text-center">Cant</th>
                        <th className="p-2 text-right">Unit</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.labor.map((l, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{l.description}</td>
                          <td className="p-2 text-center">{l.quantity}</td>
                          <td className="p-2 text-right">C$ {l.unitPrice.toFixed(2)}</td>
                          <td className="p-2 text-right">C$ {l.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transporte */}
              <div className="flex justify-between bg-slate-50 p-3 rounded-lg">
                <span className="font-semibold">🚚 Transporte</span>
                <span>C$ {o.transport.toFixed(2)}</span>
              </div>

              <div className="flex justify-end">
                <Link
                  to={`/orders/${o.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver orden completa
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gastos del corte */}
      <div>
        <h2 className="font-semibold mb-2">💸 Gastos del corte</h2>
        <ul className="bg-white rounded-xl shadow divide-y">
          {cut.gastos.map((g, i) => (
            <li key={i} className="p-3 flex justify-between">
              <span>{g.name}</span>
              <span className="text-red-600">C$ {g.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
