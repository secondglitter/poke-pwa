import React, { useEffect, useState } from "react";

export default function PokemonModal({ pokemon, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pokemon) return;

    async function fetchDetails() {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("Error al cargar detalles", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [pokemon]);

  if (!pokemon) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-80 max-w-[90%] relative"
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        {loading && <p className="text-center text-gray-400">Cargando...</p>}

        {!loading && details && (
          <div className="text-center">
            <img
              src={details.sprites.front_default}
              alt={pokemon.name}
              className="w-24 h-24 mx-auto"
            />
            <h2 className="text-2xl font-bold capitalize mb-2">{pokemon.name}</h2>

            {/* Tipos */}
            <div className="flex justify-center gap-2 mb-3">
              {details.types.map((t) => (
                <span
                  key={t.type.name}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm capitalize"
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            {/* Estadísticas */}
            <div className="text-left">
              <h3 className="font-semibold mb-1 text-gray-700">Estadísticas:</h3>
              <ul className="space-y-1">
                {details.stats.map((s) => (
                  <li key={s.stat.name} className="flex justify-between text-sm">
                    <span className="capitalize text-gray-700">{s.stat.name}</span>
                    <span className="font-semibold text-gray-900">
                      {s.base_stat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
