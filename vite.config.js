import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import { createRequire } from 'module';

// const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 9000,
    allowedHosts: true,
  },
  preview: {
    allowedHosts: ["company.alphatrack.app"],
  },
  define: {
    __API_BASE_URL__: JSON.stringify("https://company.alphatrack.app"),
  },
}); 