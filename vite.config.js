import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/app2/',
  server: {
    proxy: {
      '/spotkania': {
        target: 'https://local.issa.org.pl',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});