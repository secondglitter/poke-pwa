import React, { useEffect, useState } from "react";
import PokemonCard from "./components/PokemonCard";
import PokemonModal from "./components/PokemonModal";
import RandomPokemonButton from "./components/Notificacion";

const API_BASE = "https://pokeapi.co/api/v2/pokemon";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [totalCount, setTotalCount] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const limit = 20;

  useEffect(() => {
    fetchPage(offset);
  }, [offset]);

  async function fetchPage(offset) {
    setLoading(true);
    const cacheKey = `pokemons-page-${offset}`;

    try {
      const url = `${API_BASE}?limit=${limit}&offset=${offset}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setTotalCount(data.count);

      const enriched = data.results.map((r) => {
        const parts = r.url.split("/").filter(Boolean);
        const id = parts[parts.length - 1];
        const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        return { id, name: r.name, image };
      });

      setPokemons(enriched);
      localStorage.setItem(cacheKey, JSON.stringify(enriched));
    } catch {
      const cached = localStorage.getItem(cacheKey);
      if (cached) setPokemons(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  }

  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary mb-2">PokePWA</h1>
        <p className="text-gray-600">
          Tu Pokédex progresiva — {totalCount ? `${totalCount} Pokémon` : ""}
        </p>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            className="px-4 py-2 w-64 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <br />
        <RandomPokemonButton />
      </header>

      <main className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading && (
          <div className="col-span-full text-center text-gray-500">
            Cargando...
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400">
            No hay resultados
          </div>
        )}
        {filtered.map((p) => (
          <div key={p.id} onClick={() => setSelectedPokemon(p)}>
            <PokemonCard {...p} />
          </div>
        ))}
      </main>

      <footer className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setOffset(Math.max(0, offset - limit))}
          disabled={offset === 0}
          className="px-4 py-2 bg-primary bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow hover:bg-red-700 transition"
        >
          Anterior
        </button>
        <span className="text-gray-600">
          Página {Math.floor(offset / limit) + 1}
        </span>
        <button
          onClick={() => setOffset(offset + limit)}
          className="px-4 py-2 bg-primary text-white bg-red-500 rounded-lg shadow hover:bg-red-700 transition"
        >
          Siguiente
        </button>
      </footer>

      {/* Modal */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    
    </div>
    
  );
}

export default App;
