// pages/Dashboard.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useOrders } from "../context/OrdersContext"

function groupOrdersByDate(orders: any[]) {
  const map: Record<string, number> = {}

  orders.forEach((o) => {
    const date = o.date // Asegúrate que tus órdenes tengan "date"
    map[date] = (map[date] || 0) + o.total
  })

  return Object.keys(map)
    .sort()
    .map((date) => ({
      date,
      total: map[date],
    }))
}

export default function Dashboard() {
  const { orders, cuts } = useOrders()

  const totalFacturado = orders.reduce((sum, o) => sum + o.total, 0)
  const totalCortes = cuts.length
  const totalGanancia = cuts.reduce((sum, c) => sum + c.gananciaReal, 0)

  const dataChart = groupOrdersByDate(orders)

  const promedioDiario =
    dataChart.length > 0
      ? Math.round(totalFacturado / dataChart.length)
      : 0

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">📊 Dashboard Electrosistema</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card title="Total Facturado" value={`C$ ${totalFacturado}`} />
        <Card title="Ganancia Real" value={`C$ ${totalGanancia}`} green />
        <Card title="Órdenes Totales" value={orders.length} />
        <Card title="Cortes Realizados" value={totalCortes} />
        <Card title="Promedio Diario" value={`C$ ${promedioDiario}`} />
      </div>

      {/* Gráfico */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">📈 Evolución de ingresos por día</h2>

        {dataChart.length === 0 ? (
          <p className="text-gray-500">No hay datos suficientes aún.</p>
        ) : (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

function Card({
  title,
  value,
  green,
}: {
  title: string
  value: any
  green?: boolean
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${green ? "text-green-600" : ""}`}>
        {value}
      </p>
    </div>
  )
}
