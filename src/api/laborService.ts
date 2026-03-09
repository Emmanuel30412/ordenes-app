import axiosClient from "./axiosClient"

export interface LaborRequest {
  name: string
  unitPrice: number
}

export const saveLaborIfNotExists = async (
  data: LaborRequest
) => {
  const response = await axiosClient.post(
    "/labor/save-if-not-exists",
    data
  )
  return response.data
}

export const getAllLabor = async () => {
  const response = await axiosClient.get("/labor/find-all")
  return response.data
}

