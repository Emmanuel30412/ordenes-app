import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { OrdersProvider } from './context/OrdersContext'
import { CatalogProvider } from './context/CatalogContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CatalogProvider>

      <OrdersProvider>
        <App />
      </OrdersProvider>
    </CatalogProvider>
  </React.StrictMode>
)
