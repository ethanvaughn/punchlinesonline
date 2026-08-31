import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // 0.0.0.0 — needed inside Docker
    port: 5173,
    strictPort: true,
    proxy: {
      "/gql": { target: "http://localhost:4000", changeOrigin: true },
      "/api": { target: "http://localhost:4000", changeOrigin: true },
    },
  },
});
