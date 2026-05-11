/* eslint-disable no-unused-vars */
import { defineConfig } from "vite";
import { createRequire } from 'module';
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
const require = createRequire(import.meta.url);
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 9501,
    allowedHosts: true,
    proxy: {
      "/api/v1": {
        target: "https://api.alphatrack.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    allowedHosts: ["company.alphatrack.app"], // 👈 add your host here
  },
  define: {
    __API_BASE_URL__: JSON.stringify("https://company.alphatrack.app"),
  },
}); 