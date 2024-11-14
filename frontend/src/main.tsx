import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios'
import './i18next'


axios.defaults.httpsAgent = {
  rejectUnauthorized: false,
}
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
