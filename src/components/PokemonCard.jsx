import React from "react";

export default function PokemonCard({ id, name, image }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg p-4 text-center transition cursor-pointer">
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
