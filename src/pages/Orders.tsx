import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"

type Expense = { name: string; amount: number; checked: boolean }

const defaultExpenses: Expense[] = [
  { name: "Combustible", amount: 0, checked: false },
  { name: "Viáticos", amount: 0, checked: false },
  { name: "Alimentación", amount: 0, checked: false },
]

export default function Orders() {
  const { orders, deleteOrder, markOrdersAsCut, saveCut, getToday } = useOrders()

  const today = getToday()
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses)
  const [newExpense, setNewExpense] = useState("")

  // 🔎 Filtro por rango y no cortadas
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.date).getTime()
      const from = fromDate ? new Date(fromDate).getTime() : -Infinity
      const to = toDate ? new Date(toDate).getTime() : Infinity
      return d >= from && d <= to && !o.isCut
    })
  }, [orders, fromDate, toDate])

  const totalFacturado = filteredOrders.reduce((s, o) => s + o.total, 0)
  const totalGastos = expenses.filter(e => e.checked).reduce((s, e) => s + e.amount, 0)
  const gananciaReal = totalFacturado - totalGastos

  const toggleExpense = (i: number) => {
    const copy = [...expenses]
    copy[i].checked = !copy[i].checked
    setExpenses(copy)
  }

  const changeAmount = (i: number, val: number) => {
    const copy = [...expenses]
    copy[i].amount = val
    setExpenses(copy)
  }

  const addExpense = () => {
    if (!newExpense.trim()) return
    setExpenses([...expenses, { name: newExpense, amount: 0, checked: true }])
    setNewExpense("")
  }

  const makeCut = () => {
  if (filteredOrders.length === 0) return alert("No hay órdenes en el rango")

  const cutId = crypto.randomUUID()

  const cut = {
    id: cutId,
    fromDate: fromDate || new Date(filteredOrders[0].date).toISOString().slice(0, 10),
    toDate: toDate || new Date(filteredOrders[filteredOrders.length - 1].date).toISOString().slice(0, 10), 
    from: fromDate || new Date(filteredOrders[0].date).toISOString().slice(0, 10),
    to: toDate || new Date(filteredOrders[filteredOrders.length - 1].date).toISOString().slice(0, 10),
    totalFacturado,
    totalGastos,
    gananciaReal,
    gastos: expenses.filter(e => e.checked),
    
    orders: filteredOrders.map(o => ({
      orderId: o.id,
      orderNumber: o.orderNumber,
      company: o.company,
      total: o.total,
    })),

    createdAt: new Date().toISOString(),
  }
  saveCut(cut)
  markOrdersAsCut(filteredOrders.map(o => o.id), cutId)
}


  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">📊 Órdenes & Cortes</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow">
        <input type="date" className="border rounded px-2 py-1" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" className="border rounded px-2 py-1" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        <div className="md:col-span-2 flex items-center gap-4">
          <span className="font-semibold">Total: C$ {totalFacturado.toFixed(2)}</span>
          <span className="font-semibold text-red-600">Gastos: C$ {totalGastos.toFixed(2)}</span>
          <span className="font-semibold text-green-600">Ganancia: C$ {gananciaReal.toFixed(2)}</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">Orden</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Sucursal</th>
              <th className="p-2 text-right">Total</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-blue-50">
                <td className="p-2">{o.orderNumber}</td>
                <td className="p-2">{o.date}</td>
                <td className="p-2">{o.branch}</td>
                <td className="p-2 text-right">C$ {o.total.toFixed(2)}</td>
                <td className="p-2 text-center flex gap-3 justify-center">
                  <Link to={`/orders/${o.id}`} className="text-blue-600 hover:underline">
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
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No hay órdenes en el rango
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Gastos */}
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <h3 className="font-semibold">💸 Gastos del corte</h3>

        {expenses.map((e, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="checkbox" checked={e.checked} onChange={() => toggleExpense(i)} />
            <span className="w-32">{e.name}</span>
            {e.checked && (
              <input
                type="number"
                className="border rounded px-2 py-1 w-24"
                placeholder="C$"
                value={e.amount}
                onChange={(ev) => changeAmount(i, Number(ev.target.value))}
              />
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <input
            value={newExpense}
            onChange={(e) => setNewExpense(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            placeholder="Nuevo gasto"
          />
          <button onClick={addExpense} className="bg-blue-600 text-white px-3 rounded">
            +
          </button>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <button
          onClick={makeCut}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          ✂️ Hacer corte
        </button>

        <button
          title="Imprimir reporte"
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700"
        >
          🖨️
        </button>
      </div>
    </div>
  )
}
