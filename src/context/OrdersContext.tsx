import { createContext, useContext, useEffect, useState } from "react"

export type Material = {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type Labor = {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export type Order = {
  id: number
  orderNumber: string
  company: string
  branch: string
  date: string
  materials: Material[]
  labor: Labor[]
  transport: number
  total: number
  flgCut?: boolean
  cutId?: string
}

export type CutItem = {
  id: number
  description: string
  quantity: number
  unitPrice: number
  total: number
  type: "MATERIAL" | "LABOR"
}

export type CutOrderResume = {
  id: number
  orderId: number
  orderNumber: string
  company: string
  total: number
  items: CutItem[]
  transport: number
}

export type Cut = {
  id: number
  fromDate: string
  toDate: string
  totalFacturado: number
  totalGastos: number
  gananciaReal: number
  expenses: { name: string; amount: number }[]
  orders: CutOrderResume[]   // 👈 aquí van las órdenes incluidas en el corte
  createdAt: string
}

type OrdersContextType = {
  orders: Order[]
  cuts: Cut[]
  addOrder: (order: Omit<Order, "id">) => void
  addCut: (cut: Cut) => void
  deleteOrder: (id: number) => void
  markOrdersAsCut: (ids: number[], cutId: string) => void
  saveCut: (cut: Cut) => void
  getToday: () => string
}


const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {

  const [orders, setOrders] = useState<Order[]>([])
  const [cuts, setCuts] = useState<Cut[]>([])

  // carga inicial de órdenes y cortes desde backend
  const loadOrders = async () => {
    const res = await fetch("http://localhost:8080/api/orders")
    const data = await res.json()
    setOrders(data)
  }

  //nuevo
  const loadCuts = async () => {
    const res = await fetch("http://localhost:8080/api/cuts")
    const data = await res.json()
    setCuts(data)
  }

  // revisar que este funcionando.
  const deleteOrder = async (id: number) => {
    console.log("Eliminando orden con id:", id)

    await fetch(`http://localhost:8080/api/orders/${id}`, {
      method: "DELETE",
    })

    setOrders(prev => prev.filter(order => order.id !== id))
  }

  useEffect(() => {
    loadCuts()
    loadOrders()
  }, [])

  const addOrder = (order: Omit<Order, "id">) => {
    setOrders((prev) => [...prev, { id: Date.now(), ...order }])
  }

  /*const deleteOrder = (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta orden?")) return
    setOrders(prev => prev.filter(o => o.id !== id))
  }*/

  const markOrdersAsCut = (ids: number[], cutId: string) => {
    setOrders(prev =>
      prev.map(o =>
        ids.includes(o.id)
          ? { ...o, flgCut: true, cutId }
          : o
      )
    )
  }

  const saveCut = async (cut: Cut) => {
    await fetch("http://localhost:8080/api/cuts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cut)
    })

    // vuelve a cargar todos los cortes del backend
    loadCuts()
  }

  const addCut = (cut: Cut) => {
    setCuts(prev => [...prev, cut])
  }

  const getToday = () => {
    const today = new Date()
    const offset = today.getTimezoneOffset()
    const local = new Date(today.getTime() - offset * 60 * 1000)
    return local.toISOString().split("T")[0]
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        cuts,
        addOrder,
        addCut,
        deleteOrder,
        markOrdersAsCut,
        saveCut,
        getToday
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) throw new Error("useOrders debe usarse dentro de OrdersProvider")
  return context
}
