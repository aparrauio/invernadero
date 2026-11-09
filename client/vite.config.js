import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// El navegador llama a /api/... y Vite lo reenvía a la API: no hace falta CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
