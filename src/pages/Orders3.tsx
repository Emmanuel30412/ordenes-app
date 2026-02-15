import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"

const CATALOG_GASTOS = [
  "Viáticos",
  "Combustible",
  "Alimentación",
  "Repuestos",
  "Otros",
]

export default function Orders() {
  const { orders, deleteOrder } = useOrders()

  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const [gastoTipo, setGastoTipo] = useState(CATALOG_GASTOS[0])
  const [gastoMonto, setGastoMonto] = useState(0)

  const [gastos, setGastos] = useState<
    { id: string; tipo: string; monto: number }[]
  >([])

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.date)
      if (fromDate && d < new Date(fromDate)) return false
      if (toDate && d > new Date(toDate)) return false
      return true
    })
  }, [orders, fromDate, toDate])

  const totalFacturado = filteredOrders.reduce((s, o) => s + o.total, 0)
  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0)
  const gananciaReal = totalFacturado - totalGastos

  const addGasto = () => {
    if (gastoMonto <= 0) return
    setGastos([
      ...gastos,
      { id: crypto.randomUUID(), tipo: gastoTipo, monto: gastoMonto },
    ])
    setGastoMonto(0)
  }

  const input =
    "rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none w-full"

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">📊 Control de Órdenes</h1>

      {/* Filtros + Resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <h2 className="font-semibold text-slate-700">🗓 Filtro</h2>
          <input type="date" className={input} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" className={input} value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <Link
            to="/orders/new"
            className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            + Nueva Orden
          </Link>
        </div>

        {/* Total facturado */}
        <div className="bg-blue-50 p-4 rounded-xl shadow">
          <h3 className="text-sm text-blue-700">Total Facturado</h3>
          <p className="text-2xl font-bold text-blue-900">
            C$ {totalFacturado.toFixed(2)}
          </p>
        </div>

        {/* Gastos */}
        <div className="bg-orange-50 p-4 rounded-xl shadow space-y-2">
          <h3 className="text-sm text-orange-700">Gastos</h3>

          <select
            className={input}
            value={gastoTipo}
            onChange={(e) => setGastoTipo(e.target.value)}
          >
            {CATALOG_GASTOS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          <input
            type="number"
            className={input}
            placeholder="Monto"
            value={gastoMonto}
            onChange={(e) => setGastoMonto(Number(e.target.value))}
          />

          <button
            onClick={addGasto}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
          >
            + Agregar Gasto
          </button>

          <div className="text-sm font-semibold text-orange-800">
            Total gastos: C$ {totalGastos.toFixed(2)}
          </div>
        </div>

        {/* Ganancia */}
        <div className="bg-green-50 p-4 rounded-xl shadow">
          <h3 className="text-sm text-green-700">Ganancia Real</h3>
          <p className="text-2xl font-bold text-green-900">
            C$ {gananciaReal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Lista de gastos agregados */}
      {gastos.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">📉 Gastos del corte</h3>
          <ul className="space-y-1 text-sm">
            {gastos.map((g) => (
              <li key={g.id} className="flex justify-between border-b pb-1">
                <span>{g.tipo}</span>
                <span className="font-semibold">C$ {g.monto.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabla de órdenes */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">Orden</th>
              <th className="p-2">Empresa</th>
              <th className="p-2">Sucursal</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Total</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.orderNumber}</td>
                <td className="p-2">{o.company}</td>
                <td className="p-2">{o.branch}</td>
                <td className="p-2">{o.date}</td>
                <td className="p-2 font-semibold">C$ {o.total.toFixed(2)}</td>
                <td className="p-2 flex gap-2">
                  <Link to={`/orders/${o.orderNumber}`} className="text-blue-600 hover:underline">
                    Ver
                  </Link>
                  <button
                    onClick={() => deleteOrder(o.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
