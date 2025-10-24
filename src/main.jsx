import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from "virtual:pwa-register";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

registerSW({
  onNeedRefresh() {
    if (confirm("Nueva versión disponible. ¿Actualizar?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("App lista para usarse offline ✅");
  },
});