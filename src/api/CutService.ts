export async function createCut(data: any) {
  const res = await fetch("http://localhost:8080/api/cuts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Error creando corte")

  return res.json()
}

export async function getCuts() {
  const res = await fetch("http://localhost:8080/api/cuts")
  return res.json()
}