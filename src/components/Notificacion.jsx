import { useState, useEffect } from "react";

export default function RandomPokemonButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // limpiar toasts después de X ms
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  // pide permiso si hace falta — debe ejecutarse dentro de interacción del usuario
  const ensurePermission = async () => {
    if (!("Notification" in window)) {
      console.log("Notificaciones no soportadas por este navegador.");
      return "unsupported";
    }
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    // default -> pedir permiso
    try {
      const p = await Notification.requestPermission();
      console.log("Permiso pedido:", p);
      return p;
    } catch (e) {
      console.error("Error pidiendo permiso:", e);
      return "denied";
    }
  };

  // intenta mostrar notificación de varias formas
  const tryNotify = async (title, options = {}) => {
    // 1) Intentar Notification constructor (página)
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, options);
        console.log("Notificación mostrada con new Notification()");
        return true;
      }
    } catch (e) {
      console.warn("new Notification() falló:", e);
    }

    // 2) Intentar serviceWorker.showNotification() si hay registro
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          // showNotification requiere permiso también, pero en algunos contextos PWA funciona mejor
          reg.showNotification(title, options);
          console.log("Notificación mostrada con serviceWorker.showNotification()");
          return true;
        }
      }
    } catch (e) {
      console.warn("serviceWorker.showNotification() falló:", e);
    }

    // 3) fallback — mostrar toast en pantalla (in-app)
    console.log("Usando fallback toast (in-app).");
    setToast(`${options.body || ""}`.trim() || title);
    return false;
  };

  // principal: obtener pokemon y notificar
  const handleRandomPokemon = async () => {
    setIsLoading(true);

    try {
      const perm = await ensurePermission();
      // Si es "unsupported" seguimos para mostrar toast
      // Pero si es denied y no hay registro de SW, avisamos y mostramos toast
      const randomId = Math.floor(Math.random() * 898) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      if (!res.ok) throw new Error("Error al consultar la PokéAPI");
      const data = await res.json();

      const name = capitalize(data.name);
      const icon = data.sprites?.front_default || data.sprites?.other?.["official-artwork"]?.front_default;

      const title = `¡Pokémon aleatorio! ${name}`;
      const body = `Has obtenido a ${name} 🐾`;

      // opciones de notificación; incluir imagen en `image` puede mejorar en Android
      const options = {
        body,
        icon: icon,
        image: icon || undefined,
        badge: icon || undefined,
        data: { pokemon: data.name, id: data.id },
      };

      await tryNotify(title, options);

      // además mostramos un pequeño toast siempre para visibilidad en móviles
      setToast(`${name} — notificación enviada (o mostrada como toast).`);
    } catch (err) {
      console.error("handleRandomPokemon error:", err);
      setToast("Error al obtener Pokémon. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleRandomPokemon}
        disabled={isLoading}
        className={`px-8 py-3 rounded-2xl font-semibold shadow-lg transition-transform duration-200 ${
          isLoading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-yellow-400 text-blue-900 hover:bg-yellow-500 hover:scale-105"
        }`}
      >
        {isLoading ? "Buscando Pokémon..." : "Obtener Pokémon"}
      </button>

      <p className="mt-4 text-gray-600 text-sm max-w-xs text-center">
        Pulsa para recibir una notificación con un Pokémon aleatorio. Si el navegador no soporta notificaciones, verás un mensaje en pantalla.
      </p>

      {/* Toast in-app (fallback visual) */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 bg-blue-700 text-white px-4 py-3 rounded-xl shadow-lg z-50 max-w-xs text-center">
          {toast}
        </div>
      )}
    </div>
  );
}
