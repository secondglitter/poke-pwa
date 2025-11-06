import { useState } from "react";

export default function RandomPokemonButton() {
  const [isLoading, setIsLoading] = useState(false);

  // 🔔 Pide permiso de notificaciones antes de usarlas
  const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      console.log("Permiso de notificación:", permission);
    }
  };

  // 🧠 Capitaliza el nombre del Pokémon
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  // 🧩 Muestra la notificación con el nombre e icono del Pokémon
  const showPokemonNotification = (name, image) => {
    const notify = () => {
      new Notification("¡Pokémon encontrado! 🎉", {
        body: `Has obtenido a ${capitalize(name)} 🐾`,
        icon: image,
      });
    };

    if (Notification.permission === "granted") {
      notify();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") notify();
      });
    } else {
      alert("⚠️ Las notificaciones están bloqueadas. Habilítalas en el navegador.");
    }
  };

  // 🎲 Obtiene un Pokémon aleatorio desde la PokéAPI
  const handleRandomPokemon = async () => {
    await requestNotificationPermission();
    setIsLoading(true);

    try {
      const randomId = Math.floor(Math.random() * 20) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();

      showPokemonNotification(data.name, data.sprites.front_default);
    } catch (error) {
      console.error("Error al obtener el Pokémon aleatorio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
  <button
        onClick={handleRandomPokemon}
        disabled={isLoading}
        className={`px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 ${
          isLoading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-red-600  hover:bg-red-400 hover:scale-105"
        }`}
      >
        {isLoading ? "Buscando Pokémon..." : "Obtener Pokémon"}
      </button>
    </div>
  );
}
