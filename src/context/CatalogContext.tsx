import { createContext, useContext, useState } from "react"

type CatalogItem = { name: string; unitPrice: number }

type CatalogContextType = {
  companies: string[]
  branchesByCompany: Record<string, string[]>
  materialsCatalog: CatalogItem[]
  laborCatalog: CatalogItem[]
  addMaterialToCatalog: (item: CatalogItem) => void
  addLaborToCatalog: (item: CatalogItem) => void
}

const CatalogContext = createContext<CatalogContextType | null>(null)

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [materialsCatalog, setMaterialsCatalog] = useState<CatalogItem[]>([
    { name: "Plato LED 18W", unitPrice: 150 },
  ])

  const [laborCatalog, setLaborCatalog] = useState<CatalogItem[]>([
    { name: "Cambio de plato LED", unitPrice: 200 },
  ])

  const companies = ["Super 1", "La Colonia"]
  const branchesByCompany: Record<string, string[]> = {
    "Super 1": ["Sucursal Centro", "Sucursal Norte"],
    "La Colonia": ["Altamira", "Carretera Sur"],
  }

  return (
    <CatalogContext.Provider
      value={{
        companies,
        branchesByCompany,
        materialsCatalog,
        laborCatalog,
        addMaterialToCatalog: (item) => setMaterialsCatalog((prev) => [...prev, item]),
        addLaborToCatalog: (item) => setLaborCatalog((prev) => [...prev, item]),
      }}
    >
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error("useCatalog debe usarse dentro de CatalogProvider")
  return ctx
}
