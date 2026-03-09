import axiosClient from "./axiosClient"

export const saveBranch = async (companyId: number, name: string) => {
  const res = await axiosClient.post(
    `/branches?companyId=${companyId}&name=${name}`
  )
  return res.data
}

export const getBranchesByCompany = async (companyId: number) => {
  const res = await axiosClient.get(`/branches/by-company/${companyId}`)
  return res.data
}