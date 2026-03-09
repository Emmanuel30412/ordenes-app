import axiosClient from "./axiosClient"

export interface MaterialRequest {
  name: string
  unitPrice: number
}

export const saveMaterialIfNotExists = async (
  
  data: MaterialRequest
) => {
  const response = await axiosClient.post(
    "/materials/save-if-not-exists",
    data
  )
  return response.data
}

export const getAllMaterials = async () => {
  const response = await axiosClient.get("/materials/find-all")
  return response.data
}