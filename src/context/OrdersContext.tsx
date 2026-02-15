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
  status: "Pendiente" | "En proceso" | "Completada"

  // 🔥 NUEVO (no rompe lo anterior)
  isCut?: boolean
  cutId?: string
}

export type CutOrderResume = {
  orderId: number
  orderNumber: string
  company: string
  total: number
}

export type Cut = {
  id: string
  from: string
  to: string
  totalFacturado: number
  totalGastos: number
  gananciaReal: number
  gastos: { name: string; amount: number }[]
  orders:  CutOrderResume[]   // 👈 aquí van las órdenes incluidas en el corte
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
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("orders")
    return saved ? JSON.parse(saved) : []
  })

  const [cuts, setCuts] = useState<Cut[]>(() => {
    const saved = localStorage.getItem("cuts")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem("cuts", JSON.stringify(cuts))
  }, [cuts])

  const addOrder = (order: Omit<Order, "id">) => {
    setOrders((prev) => [...prev, { id: Date.now(), ...order }])
  }

  const deleteOrder = (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta orden?")) return
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  const markOrdersAsCut = (ids: number[], cutId: string) => {
    setOrders(prev =>
      prev.map(o =>
        ids.includes(o.id)
          ? { ...o, isCut: true, cutId }
          : o
      )
    )
  }

  const saveCut = (cut: Cut) => {
    setCuts(prev => [cut, ...prev])
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
