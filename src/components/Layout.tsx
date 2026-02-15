import { Link, Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
     <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col">

        <div className="p-5 text-xl font-bold flex items-center gap-2">
          🛠️ Gestión de Mantenimientos
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          <Link className="block px-3 py-2 rounded-lg hover:bg-blue-500" to="/">Dashboard</Link>
          <Link className="block px-3 py-2 rounded-lg hover:bg-blue-500" to="/orders">Mantenimientos</Link>
          <Link className="block px-3 py-2 rounded-lg hover:bg-blue-500" to="/orders/new">Nuevo Mantenimiento</Link>
          <Link className="block px-3 py-2 rounded-lg hover:bg-blue-500" to="/cuts">Cortes</Link>
          
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header 
        <header className="h-14 bg-white shadow flex items-center justify-end px-6">
          <span className="font-medium">Adryin</span>
        </header>*/}

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
