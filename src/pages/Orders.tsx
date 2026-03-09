import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"
import { getOrders } from "../api/OrderService"
import { createCut } from "../api/CutService"
import { Alert } from "./Alert"

type Expense = { name: string; amount: number; checked: boolean }

const defaultExpenses: Expense[] = [
  { name: "Combustible", amount: 0, checked: false },
  { name: "Viáticos", amount: 0, checked: false },
  { name: "Alimentación", amount: 0, checked: false },
]

export default function Orders() {
  const { deleteOrder, getToday, saveCut } = useOrders()
  const today = getToday()
  const [fromDate, setFromDate] = useState(today)
  const [toDate, setToDate] = useState(today)
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses)
  const [newExpense, setNewExpense] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning"
    message: string
  } | null>(null)

  // 🔎 Filtro por rango y no cortadas
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.date).getTime()
      const from = fromDate ? new Date(fromDate).getTime() : -Infinity
      const to = toDate ? new Date(toDate).getTime() : Infinity
      return d >= from && d <= to && !o.flgCut
    })
  }, [orders, fromDate, toDate])

  useEffect(() => {
    loadOrders()
  }, [])

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

  const makeCut = async () => {

    if (filteredOrders.length === 0)
      return alert("No hay órdenes en el rango")

    const selectedExpenses = expenses
      .filter(e => e.checked)
      .map(e => ({
        name: e.name,
        amount: e.amount
      }))

    const totalFacturado = filteredOrders.reduce((s, o) => s + o.total, 0)
    const totalGastos = selectedExpenses.reduce((s, e) => s + e.amount, 0)
    const gananciaReal = totalFacturado - totalGastos

    const cutRequest = {
      fromDate,
      toDate,
      totalFacturado,
      totalGastos,
      gananciaReal,
      orderIds: filteredOrders.map(o => o.id),
      gastos: selectedExpenses
    }

    try {
      await createCut(cutRequest)

      await saveCut({} as any)  // 🔥 guardamos en backend
      setAlert({
        type: "success",
        message: "Corte guardado correctamente"
      })

      await loadOrders()   // 🔥 recarga desde backend
    } catch (error) {
      console.error(error)
      setAlert({
        type: "error",
        message: "Error creando corte"
      })
    }
  }

  // Carga órdenes desde backend y formatea materiales/labor
  const loadOrders = async () => {
    try {
      setLoading(true)

      const data = await getOrders()
      console.log("Órdenes cargadas:", data)

      const formatted = data.map((order: any) => {
        const materials = order.items?.filter(
          (i: any) => i.type === "MATERIAL"
        ) || []

        const labor = order.items?.filter(
          (i: any) => i.type === "LABOR"
        ) || []

        return {
          ...order,
          materials,
          labor,
        }
      })

      setOrders(formatted)

    } catch (error) {
      console.error("Error cargando órdenes", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">📊 Órdenes & Cortes</h1>
      {alert && (
        <Alert type={alert.type} message={alert.message} />
      )}

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
                <td className="p-2">{o.company}</td>
                <td className="p-2 text-right">C$ {o.total.toFixed(2)}</td>
                <td className="p-2 text-center flex gap-3 justify-center">
                  <Link to={`/orders/${o.id}`} className="text-blue-600 hover:underline">
                    Ver
                  </Link>
                  <button
                    onClick={async () => {
                      await deleteOrder(o.id)
                      await loadOrders()
                      setAlert({
                        type: "success",
                        message: "Orden eliminada correctamente"
                      })
                      setTimeout(() => setAlert(null), 2000)
                    }}
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
      </div>
    </div>
  )
}
