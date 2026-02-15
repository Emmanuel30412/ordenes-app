import { Routes, Route, Link, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import NewOrder from './pages/NewOrder'
import OrderDetail from './pages/OrderDetail'
import Layout from './components/Layout'
import Cuts from './pages/Cuts'
import CutDetail from './pages/CutDetail'

export default function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<NewOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/cuts" element={<Cuts />} />
          <Route path="/cuts/:id" element={<CutDetail />} />
        </Route>
      </Routes>
    </BrowserRouter> 
  )
}
