import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite
export default defineConfig({
  plugins: [react()],

  // Durante o desenvolvimento local (npm run dev),
  // o Vite redireciona chamadas /api para o Flask local.
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Flask local
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Quando o projeto for buildado, será hospedado no Render,
  // então as chamadas devem usar a URL pública do Flask.
  // Isso você define no código do React (ex: fetch).
})
