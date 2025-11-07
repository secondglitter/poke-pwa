import { useState } from "react";

export default function RandomPokemonButton() {
  const [message, setMessage] = useState(null);

  const handleRandomPokemon = async () => {
    try {
      const randomId = Math.floor(Math.random() * 20) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();

      // Intenta notificar
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("¡Pokémon encontrado!", {
            body: `Has obtenido a ${data.name}!`,
            icon: data.sprites.front_default,
          });
        }
      }

      // Siempre muestra un mensaje visible
      setMessage(`Has obtenido a ${data.name}! 🎉`);
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleRandomPokemon}
        className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-yellow-500 transition-all duration-200 hover:scale-105"
      >
        Obtener Pokémon
      </button>

      {message && (
        <div className="fixed bottom-8 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md animate-bounce">
          {message}
        </div>
      )}
    </div>
  );
}
