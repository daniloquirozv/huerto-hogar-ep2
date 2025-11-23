import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
    open: true,
    proxy: {      
      '/api/v1/huertohogar': {
        target: 'http://54.211.142.251:8080',
        changeOrigin: true,
        rewrite: (path) => path // Mantener la ruta completa
      },      
      '/api': {
        target: 'http://52.1.232.64:8089',
        changeOrigin: true,
        rewrite: (path) => path // Mantener la ruta completa
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Genera nombres de archivo únicos basados en el contenido (hash)
        // Esto evita problemas de caché del navegador
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  css: {
    devSourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
      ]
    }
  }
})