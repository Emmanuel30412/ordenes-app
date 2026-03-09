import axiosClient from "./axiosClient"

export const getAllCompanies = async () => {
  const res = await axiosClient.get("/companies")
  return res.data
}

export const saveCompany = async (name: string) => {
  const res = await axiosClient.post("/companies", { name })
  return res.data
}