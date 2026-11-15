import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const { version } = JSON.parse(readFileSync("./package.json", "utf-8")) as { version?: string };

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(version ?? "0.0.0") },
  plugins: [
    react(),
    tailwindcss(),
    // Offline-first: el service worker precachea la app y los datos viven en IndexedDB.
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      workbox: { navigateFallback: "/index.html", globPatterns: ["**/*.{js,css,html,svg,png,woff2,woff}"] },
      manifest: {
        name: "Dailo",
        short_name: "Dailo",
        description: "Capturá ahora, organizá después.",
        lang: "es",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#EAF0E6",
        background_color: "#EAF0E6",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
