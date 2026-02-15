import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useOrders } from "../context/OrdersContext"
import { useCatalog } from "../context/CatalogContext"

type Item = {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export default function NewOrder() {
  const { addOrder,getToday } = useOrders()
  const navigate = useNavigate()

  const {
    companies,
    branchesByCompany,
    materialsCatalog,
    laborCatalog,
    addMaterialToCatalog,
    addLaborToCatalog,
  } = useCatalog()

  const [orderNumber, setOrderNumber] = useState("")
  const [company, setCompany] = useState("")
  const [branch, setBranch] = useState("")
  const today = getToday()
  const [date, setDate] = useState(today)
  const [transport, setTransport] = useState(0)

  const [materials, setMaterials] = useState<Item[]>([
    { description: "", quantity: 1, unitPrice: 0, total: 0 },
  ])

  const [labor, setLabor] = useState<Item[]>([
    { description: "", quantity: 1, unitPrice: 0, total: 0 },
  ])

  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [activeType, setActiveType] = useState<"material" | "labor" | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"material" | "labor">("material")
  const [modalName, setModalName] = useState("")
  const [modalPrice, setModalPrice] = useState(0)

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"

  // =========================
  // AGREGAR / ELIMINAR FILAS
  // =========================

  const addMaterialRow = () => {
    setMaterials([
      ...materials,
      { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ])
  }

  const removeMaterialRow = (i: number) => {
    if (materials.length === 1) return
    const copy = [...materials]
    copy.splice(i, 1)
    setMaterials(copy)
  }

  const addLaborRow = () => {
    setLabor([
      ...labor,
      { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ])
  }

  const removeLaborRow = (i: number) => {
    if (labor.length === 1) return
    const copy = [...labor]
    copy.splice(i, 1)
    setLabor(copy)
  }

  // =========================
  // CALCULO TOTAL
  // =========================

  const calculateTotal = () => {
    const materialsTotal = materials.reduce((sum, m) => sum + m.total, 0)
    const laborTotal = labor.reduce((sum, l) => sum + l.total, 0)
    return materialsTotal + laborTotal + transport
  }

  // =========================
  // CATALOGO
  // =========================

  const openModalIfNoMatches = (type: "material" | "labor", text: string) => {
    const catalog = type === "material" ? materialsCatalog : laborCatalog
    const matches = catalog.filter((c) =>
      c.name.toLowerCase().includes(text.toLowerCase())
    )
    if (text && matches.length === 0) {
      setModalType(type)
      setModalName(text)
      setModalPrice(0)
      setShowModal(true)
    }
  }

  const handleSelectCatalog = (
    type: "material" | "labor",
    i: number,
    item: { name: string; unitPrice: number }
  ) => {
    const list = type === "material" ? [...materials] : [...labor]

    list[i].description = item.name
    list[i].unitPrice = item.unitPrice
    list[i].total = list[i].quantity * item.unitPrice

    type === "material" ? setMaterials(list) : setLabor(list)

    setActiveIndex(null)
    setActiveType(null)
  }

  const saveToCatalog = () => {



    if (modalType === "material") {
      addMaterialToCatalog({ name: modalName, unitPrice: modalPrice })
    } else {
      addLaborToCatalog({ name: modalName, unitPrice: modalPrice })
    }
    setShowModal(false)
  }

  // =========================
  // RENDER FILAS
  // =========================

  const renderRows = (
    items: Item[],
    setItems: Function,
    catalog: any[],
    type: "material" | "labor"
  ) =>
    items.map((item, i) => {
      const matches = catalog.filter((c) =>
        c.name.toLowerCase().includes(item.description.toLowerCase())
      )

      return (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 relative items-center"
        >
          <div className="md:col-span-5 relative">
            <input
              className={inputClass}
              placeholder="Descripción"
              value={item.description}
              onFocus={() => {
                setActiveIndex(i)
                setActiveType(type)
              }}
              onChange={(e) => {
                const copy = [...items]
                copy[i].description = e.target.value
                setItems(copy)
                openModalIfNoMatches(type, e.target.value)
              }}
            />

            {activeIndex === i &&
              activeType === type &&
              item.description &&
              matches.length > 0 && (
                <div className="absolute bg-white border rounded-xl shadow w-full top-11 z-20 max-h-40 overflow-auto">
                  {matches.map((c) => (
                    <div
                      key={c.name}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                      onMouseDown={() => handleSelectCatalog(type, i, c)}
                    >
                      {c.name} — C$ {c.unitPrice}
                    </div>
                  ))}
                </div>
              )}
          </div>

          <input
            type="number"
            className={inputClass + " md:col-span-2"}
            value={item.quantity}
            onChange={(e) => {
              const qty = Number(e.target.value)
              const copy = [...items]
              copy[i].quantity = qty
              copy[i].total = qty * copy[i].unitPrice
              setItems(copy)
            }}
          />

          <input
            disabled
            className={inputClass + " md:col-span-2 bg-gray-100"}
            value={item.unitPrice}
          />

          <input
            disabled
            className={inputClass + " md:col-span-2 bg-gray-100"}
            value={item.total.toFixed(2)}
          />

          <button
            type="button"
            onClick={() =>
              type === "material"
                ? removeMaterialRow(i)
                : removeLaborRow(i)
            }
            className="md:col-span-1 text-red-600 hover:text-red-800 text-lg"
          >
            ❌
          </button>
        </div>
      )
    })

  // =========================
  // FORM
  // =========================

  return (
    <div className="max-w-9xl mx-auto py-3 space-y-3">
      <h1 className="text-3xl font-bold text-slate-800">
        🛠️ Nueva Orden de Mantenimiento
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          addOrder({
            orderNumber,
            company,
            branch,
            date,
            materials,
            labor,
            transport,
            total: calculateTotal(),
            status: "Pendiente",
          })
          navigate("/orders")
        }}
        className="space-y-6"
      >
        {/* Datos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-blue-50 p-6 rounded-2xl shadow">
          <input
            className={inputClass}
            placeholder="Número de orden"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />

          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className={inputClass}
            value={company}
            onChange={(e) => {
              setCompany(e.target.value)
              setBranch("")
            }}
          >
            <option value="">Empresa</option>
            {companies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            className={inputClass}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            disabled={!company}
          >
            <option value="">Sucursal</option>
            {company &&
              branchesByCompany[company]?.map((b) => (
                <option key={b}>{b}</option>
              ))}
          </select>
        </div>

        {/* Materiales */}
        <div className="bg-white p-3 rounded-2xl shadow border-l-8 border-blue-500">
          <h2 className="font-semibold text-lg mb-3 text-blue-700">
            📦 Materiales
          </h2>
          {renderRows(materials, setMaterials, materialsCatalog, "material")}
          <button
            type="button"
            onClick={addMaterialRow}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            ➕ Agregar otro material
          </button>
        </div>

        {/* Mano de Obra */}
        <div className="bg-white p-6 rounded-2xl shadow border-l-8 border-green-500">
          <h2 className="font-semibold text-lg mb-3 text-green-700">
            👷 Mano de Obra
          </h2>
          {renderRows(labor, setLabor, laborCatalog, "labor")}
          <button
            type="button"
            onClick={addLaborRow}
            className="mt-2 text-sm text-green-600 hover:underline"
          >
            ➕ Agregar otra mano de obra
          </button>
        </div>

        {/* Transporte */}
        <div className="bg-orange-50 p-5 rounded-2xl shadow flex items-center gap-4">
          <span className="font-semibold text-orange-700">
            🚚 Transporte
          </span>
          <input
            type="number"
            className="w-40 rounded-xl border px-3 py-2"
            value={transport}
            onChange={(e) => setTransport(Number(e.target.value))}
          />
        </div>

        {/* Total */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow flex justify-between">
          <span>Total</span>
          <span className="text-xl font-bold">
            C$ {calculateTotal().toFixed(2)}
          </span>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 text-lg">
            Guardar Orden
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <h3 className="font-bold text-lg mb-4">
              Nuevo {modalType === "material" ? "material" : "servicio"}
            </h3>

            <input
              className={inputClass}
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
            />

            <input
              type="number"
              className={inputClass + " mt-2"}
              value={modalPrice}
              onChange={(e) => setModalPrice(Number(e.target.value))}
              placeholder="Precio"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={saveToCatalog}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
