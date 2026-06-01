import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { WarungProvider } from './context/WarungContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <WarungProvider>
        <App />
      </WarungProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
