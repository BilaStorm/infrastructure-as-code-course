import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  test: {
    globals: true,                 // te permet d'utiliser describe/it sans importer
    environment: 'jsdom',          // nécessaire pour tester des composants React
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'], // inclut tous les fichiers de test
  },
})
