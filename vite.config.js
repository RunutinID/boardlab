import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'spa-language-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && /^\/[a-z]{2}(\/|$)/.test(req.url) && !req.url.includes('.')) {
            req.url = '/index.html';
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && /^\/[a-z]{2}(\/|$)/.test(req.url) && !req.url.includes('.')) {
            req.url = '/index.html';
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        esp32: resolve(import.meta.dirname, 'esp32.html')
      }
    }
  },
  server: {
    port: 5173,
    open: false
  }
});
