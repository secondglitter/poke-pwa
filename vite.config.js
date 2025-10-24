import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Pokédex PWA",
        short_name: "Pokédex",
        description: "Una Pokédex que funciona incluso sin conexión",
        theme_color: "#ef4444",
        background_color: "#fef2f2",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // 👇 Aquí viene lo importante
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            // ⚡️ Cachea peticiones a la API de Pokémon
            urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "pokemon-api-cache",
              expiration: {
                maxEntries: 150, // guarda hasta 150 pokémon
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1 semana
              },
            },
          },
          {
            // 🧩 Cachea imágenes de los Pokémon
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/spritet/,
            handler: "CacheFirst",
            options: {
              cacheName: "pokemon-images-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 1 mes
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
