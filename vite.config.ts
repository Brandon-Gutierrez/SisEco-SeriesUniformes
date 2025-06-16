import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://Brandon-Gutierrez.github.io/SisEco-SeriesUniformes',
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/constants': '/src/constants',
      '@/lib': '/src/lib'
    }
  },
  server: {
    port: 3000,
    open: true
  }
});