import { Link } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export default function Cuts() {
  const { cuts } = useOrders()

  console.log("Cortes cargados:", cuts)


  const exportCut = (cut) => {

    const rows = []

    cut.orders?.forEach((o) => {

      const materials = o.items?.filter(i => i.type === "MATERIAL") || []
      const labor = o.items?.filter(i => i.type === "LABOR") || []

      const max = Math.max(materials.length, labor.length)

      for (let i = 0; i < max; i++) {

        const m = materials[i] || {}
        const l = labor[i] || {}

        const total =
          (m.total || 0) +
          (l.total || 0) +
          (o.transport || 0)

        rows.push({
          Orden: o.orderNumber,
          SE: o.company,
          "Cant Mat": m.quantity || "",
          "Detalle MATERIALES": m.description || "",
          "P Unit Mat": m.unitPrice || 0,
          "P Total Mat": m.total || 0,
          "Cant MO": l.quantity || "",
          "Detalle MO": l.description || "",
          "P unit MO": l.unitPrice || 0,
          "P Total MO": l.total || 0,
          Transporte: o.transport || 0,
          TOTAL: total
        })
      }

    })

    // fila total del corte
    rows.push({
      Orden: "",
      SE: "",
      "Cant Mat": "",
      "Detalle MATERIALES": "",
      "P Unit Mat": "",
      "P Total Mat": "",
      "Cant MO": "",
      "Detalle MO": "",
      "P unit MO": "",
      "P Total MO": "",
      Transporte: "",
      TOTAL: cut.totalFacturado
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, "Corte")

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    })

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })

    saveAs(file, `Corte_${cut.id}.xlsx`)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">📒 Historial de Cortes</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-2">Orden</th>
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
              return (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.orders[0].orderNumber}</td>
                  <td className="p-2 text-center">{c.fromDate} </td>
                  <td className="p-2 text-center">{c.toDate}</td>
                  {/* 👇 Aquí mostramos los números de orden */}
                  {/**   <td className="p-2 text-center">
                    {c.orders.map(o => o.orderNumber).join(", ")}
                  </td>**/}

                  <td className="p-2 text-center">C$ {c.totalFacturado.toFixed(2)}</td>
                  <td className="p-2 text-center text-red-600">C$ {c.totalGastos.toFixed(2)}</td>
                  <td className="p-2 text-center text-green-600">C$ {c.gananciaReal.toFixed(2)}</td>
                  <td className="p-2 text-center space-x-3">

                    <Link
                      to={`/cuts/${c.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalle
                    </Link>

                    <button
                      onClick={() => exportCut(c)}
                      className="text-green-600 hover:underline"
                    >
                      Imprimir
                    </button>

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
