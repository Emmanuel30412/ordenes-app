/**
 * Creamos un contexto global para manejar los catálogos de materiales y mano de obra, así como las empresas y sucursales.
 * Esto nos permite centralizar la lógica de carga y actualización de estos datos, y compartirlos fácilmente entre componentes.
 */

import { createContext, useContext, useEffect, useState } from "react"
import { getAllMaterials } from "../api/MaterialRequest"
import { getAllLabor } from "../api/laborService"
import { saveCompany } from "../api/companyService"
import { getAllCompanies } from "../api/companyService"

type CatalogItem = {
  id?: number
  name: string
  unitPrice: number
}

type CatalogContextType = {
  companies: string[]
  branchesByCompany: Record<string, string[]>
  materialsCatalog: CatalogItem[]
  laborCatalog: CatalogItem[]
  addMaterialToCatalog: (item: CatalogItem) => void
  addLaborToCatalog: (item: CatalogItem) => void
  reloadCatalogs: () => Promise<void>
  loading: boolean
  saveCompany: (name: string) => Promise<void>
  getAllCompanies: () => Promise<void>
}

//creando el contenedor global para los catálogos, empresas y sucursales
// esto nos permite compartir esta información entre componentes sin necesidad de pasar props manualmente a cada nivel del árbol de componentes
const CatalogContext = createContext<CatalogContextType | null>(null)

//creando el proveedor del contexto, envuelve toda la app para que cualquier componente pueda acceder a los datos del catálogo
export function CatalogProvider({ children }: { children: React.ReactNode }) {

  const [materialsCatalog, setMaterialsCatalog] = useState<CatalogItem[]>([])
  const [laborCatalog, setLaborCatalog] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)

  const companies = ["Super 1", "La Colonia"]

  const branchesByCompany: Record<string, string[]> = {
    "Super 1": ["Sucursal Centro", "Sucursal Norte"],
    "La Colonia": ["Altamira", "Carretera Sur"],
  }

  // 🔥 CARGA AUTOMÁTICA AL RECARGAR PAGINA
  useEffect(() => {
    reloadCatalogs()
  }, [])

  const reloadCatalogs = async () => {
    try {
      setLoading(true)

      const materials = await getAllMaterials()
      const labor = await getAllLabor()
      
      setMaterialsCatalog(materials)
      setLaborCatalog(labor)

    } catch (error) {
      console.error("Error cargando catalogos", error)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 AGREGA EN MEMORIA DESPUES DE GUARDAR EN BACKEND
  const addMaterialToCatalog = (item: CatalogItem) => {
    setMaterialsCatalog(prev => {
      const exists = prev.some(m => m.name === item.name)//some devuelve true si al menos un elemento del array cumple la condición, en este caso si ya existe un material con el mismo nombre
      if (exists) return prev
      return [...prev, item]
    })
  }

  const addLaborToCatalog = (item: CatalogItem) => {
    setLaborCatalog(prev => {
      const exists = prev.some(l => l.name === item.name)
      if (exists) return prev
      return [...prev, item]
    })
  }


  return (
    <CatalogContext.Provider
      value={{
        companies,
        branchesByCompany,
        materialsCatalog,
        laborCatalog,
        addMaterialToCatalog,
        addLaborToCatalog,
        reloadCatalogs,
        loading,
        saveCompany,
        getAllCompanies
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