import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  // Handle environment variables
  define: {
    'process.env': process.env
  },
  // Optimize build
  build: {
    outDir: 'build',
    minify: 'terser',
    sourcemap: true,
  },
  // Development server config
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
}); 