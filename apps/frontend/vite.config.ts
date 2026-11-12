import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const { version } = JSON.parse(readFileSync("./package.json", "utf-8")) as { version?: string };

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(version ?? "0.0.0") },
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
