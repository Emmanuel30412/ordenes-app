import { useState } from "react"
import { Link } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"

type Expense = {
  name: string
  amount: number
  checked: boolean
}

export default function Orders() {
  const { orders, deleteOrder, markOrdersAsCut, saveCut } = useOrders()

  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([
    { name: "Combustible", amount: 0, checked: false },
    { name: "Viáticos", amount: 0, checked: false },
  ])
  const [newExpense, setNewExpense] = useState("")

  const filteredOrders = orders.filter((o) => {
    if (!fromDate || !toDate) return true
    return o.date >= fromDate && o.date <= toDate && !o.isCut
  })

  const totalFacturado = filteredOrders.reduce((s, o) => s + o.total, 0)
  const totalGastos = expenses.filter(e => e.checked).reduce((s, e) => s + e.amount, 0)
  const gananciaReal = totalFacturado - totalGastos

  const makeCut = () => {
    if (filteredOrders.length === 0) return alert("No hay órdenes en ese rango")

    const cutId = crypto.randomUUID()

    saveCut({
      id: cutId,
      from: fromDate,
      to: toDate,
      totalFacturado,
      totalGastos,
      gananciaReal,
      gastos: expenses.filter(e => e.checked),
      orders: filteredOrders.map(o => o.id),
      createdAt: new Date().toISOString(),
    })

    markOrdersAsCut(filteredOrders.map(o => o.id), cutId)

    alert("✅ Corte realizado")
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">📊 Órdenes de Trabajo</h1>

      {/* Filtros */}
      <div className="bg-blue-50 p-4 rounded-xl shadow flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-sm">Desde</label>
          <input type="date" className="border rounded-lg px-3 py-1" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Hasta</label>
          <input type="date" className="border rounded-lg px-3 py-1" value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>

        {/* Gastos */}
        <div className="relative">
          <label className="text-sm">Gastos</label>
          <div className="border rounded-lg bg-white px-3 py-2 w-56">
            {expenses.map((e, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={e.checked}
                  onChange={() => {
                    const copy = [...expenses]
                    copy[i].checked = !copy[i].checked
                    setExpenses(copy)
                  }}
                />
                {e.name}
                <input
                  type="number"
                  className="ml-auto w-20 border rounded px-1"
                  value={e.amount}
                  onChange={(ev) => {
                    const copy = [...expenses]
                    copy[i].amount = Number(ev.target.value)
                    setExpenses(copy)
                  }}
                />
              </label>
            ))}

            <div className="flex mt-2 gap-1">
              <input
                className="border rounded px-2 py-1 text-sm w-full"
                placeholder="Nuevo gasto"
                value={newExpense}
                onChange={(e) => setNewExpense(e.target.value)}
              />
              <button
                onClick={() => {
                  if (!newExpense) return
                  setExpenses([...expenses, { name: newExpense, amount: 0, checked: true }])
                  setNewExpense("")
                }}
                className="bg-blue-600 text-white px-2 rounded"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button onClick={makeCut} className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700">
          ✂️ Hacer corte
        </button>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total facturado</p>
          <p className="text-xl font-bold">C$ {totalFacturado.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Gastos</p>
          <p className="text-xl font-bold">C$ {totalGastos.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-300">Ganancia real</p>
          <p className="text-xl font-bold">C$ {gananciaReal.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-2 text-left">Orden</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Total</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-slate-50">
                <td className="p-2">{o.orderNumber}</td>
                <td className="p-2 text-center">{o.date}</td>
                <td className="p-2 text-center">C$ {o.total.toFixed(2)}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <Link to={`/orders/${o.id}`} className="text-blue-600 hover:underline">
                    Ver
                  </Link>
                  <button onClick={() => deleteOrder(o.id)} className="text-red-600 hover:underline">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-400">
                  No hay órdenes en este rango
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
