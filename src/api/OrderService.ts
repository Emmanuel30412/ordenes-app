import axiosClient from "./axiosClient"

export interface OrderItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface OrderRequest {
  orderNumber: string
  company: string
  date: string
  flgCut: boolean
  materials: OrderItem[]
  labor: OrderItem[]
  transport: number
  total: number
}

export const saveOrder = async (order: OrderRequest) => {
  const response = await axiosClient.post("/orders", order)
  return response.data
}

export const getOrderById = async (id: number) => {
  const response = await axiosClient.get(`/orders/${id}`)
  return response.data
}

export const getOrders = async () => {
  const response = await axiosClient.get("/orders")
  return response.data
}
