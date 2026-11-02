import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

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
        index: resolve(rootDir, 'index.html'),
        esp32: resolve(rootDir, 'esp32.html'),
        sandbox: resolve(rootDir, 'sandbox.html')
      }
    }
  },
  server: {
    port: 5173,
    open: false
  }
});
