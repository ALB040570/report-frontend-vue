import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Читай целевое API из .env.development (VITE_PROXY_TARGET)
const target = process.env.VITE_PROXY_TARGET || 'http://localhost:8080'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Любые запросы на /api* будут проксироваться на backend
      '/api': {
        target,
        changeOrigin: true,
        secure: false,
        // опционально: переписать путь, если на бэке нет префикса /api
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
