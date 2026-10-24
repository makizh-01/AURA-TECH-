import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // Expose dev server to network host & all interfaces
    port: 3000,
    open: false,
    cors: true
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
});
