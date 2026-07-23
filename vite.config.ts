import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Standard Vite Config
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: 'homeoassist.local',
    port: 3000,
    allowedHosts: ['homeoassist.local'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});