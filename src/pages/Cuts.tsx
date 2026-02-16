import { Link } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"

export default function Cuts() {
  const { cuts } = useOrders()

  console.log('cuts es: ', cuts);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">📒 Historial de Cortes</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-2">Corte</th>
              <th className="p-2">Desde</th>
              <th className="p-2">Hasta</th>
              {/**<th className="p-2">Órdenes</th>**/}
              <th className="p-2">Facturado</th>
              <th className="p-2">Gastos</th>
              <th className="p-2">Ganancia</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuts.map((c) => {
              console.log("Corte:", c)
              return (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.id.slice(0, 6)}</td>
                  <td className="p-2 text-center">{c.from} </td>
                  <td className="p-2 text-center">{c.to}</td>
                  {/* 👇 Aquí mostramos los números de orden */}
                {/**   <td className="p-2 text-center">
                    {c.orders.map(o => o.orderNumber).join(", ")}
                  </td>**/}

                  <td className="p-2 text-center">C$ {c.totalFacturado.toFixed(2)}</td>
                  <td className="p-2 text-center text-red-600">C$ {c.totalGastos.toFixed(2)}</td>
                  <td className="p-2 text-center text-green-600">C$ {c.gananciaReal.toFixed(2)}</td>
                  <td className="p-2 text-center">
                    <Link
                      to={`/cuts/${c.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
