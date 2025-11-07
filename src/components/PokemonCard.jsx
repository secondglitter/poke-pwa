import React from "react";

export default function PokemonCard({ id, name, image }) {
  // función para solicitar permiso y mostrar notificación
  const handleNotification = async () => {
    // 1️⃣ Verifica si el navegador soporta notificaciones
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones.");
      return;
    }

    // 2️⃣ Pide permiso si aún no se concedió
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }

    // 3️⃣ Muestra notificación (si se permitió)
    if (Notification.permission === "granted") {
      const icon = image || "/icons/pokeball-192.png";
      const title = `¡Has seleccionado a ${name}!`;

      try {
        // Intentar mostrar notificación directamente
        new Notification(title, {
          body: `Pokémon #${id}`,
          icon: icon,
          badge: icon,
          image: icon,
        });
      } catch (error) {
        console.warn("Error mostrando notificación directa:", error);

        // Fallback con service worker (mejor soporte PWA móvil)
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            reg.showNotification(title, {
              body: `Pokémon #${id}`,
              icon: icon,
              image: icon,
            });
          }
        } else {
          alert(`📢 ${title}`);
        }
      }
    } else {
      alert(`📢 ${name} — notificaciones bloqueadas.`);
    }
  };

  return (
    <div
      onClick={handleNotification}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg p-4 text-center transition cursor-pointer hover:scale-105 active:scale-95"
    >
      <img
        src={image}
        alt={name}
        className="mx-auto w-20 h-20"
        onError={(e) => {
          e.target.src = "/icons/pokeball-192.png";
        }}
      />
      <h3 className="text-lg font-semibold capitalize mt-2">{name}</h3>
      <p className="text-sm text-gray-500">#{id}</p>
    </div>
  );
}
