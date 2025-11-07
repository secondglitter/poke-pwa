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

const root = createRoot(document.getElementById("root"));
root.render(<App />);

// registrar service worker (si existe /sw.js)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registrado:", reg);
    } catch (err) {
      console.error("No se pudo registrar el SW:", err);
    }
  });
}