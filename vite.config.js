import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Relative paths for hosting in any directory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable source maps in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/spotkania': {
        target: 'https://local.issa.org.pl',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})