import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = parseInt(process.env.PORT, 10) || 5173;
const ROOT_DIR = import.meta.dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm'
};

function resolveFilePath(reqPath) {
  // If it's a language route like /id/, /es/, fallback to index.html (SPA routing)
  if (/^\/[a-z]{2}(\/|$)/.test(reqPath) && !path.extname(reqPath)) {
    return path.join(ROOT_DIR, 'index.html');
  }

  // Check public/ directory first for static assets
  const publicPath = path.join(ROOT_DIR, 'public', reqPath);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    return publicPath;
  }

  // Check root
  let targetPath = path.join(ROOT_DIR, reqPath);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    targetPath = path.join(targetPath, 'index.html');
  }

  // Default SPA fallback for non-file requests
  if (!fs.existsSync(targetPath) && !path.extname(reqPath)) {
    return path.join(ROOT_DIR, 'index.html');
  }

  return targetPath;
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    const filePath = resolveFilePath(pathname);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is occupied, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Learn Arduino Server Running!`);
    console.log(`🔗 Local URL:         http://localhost:${port}/`);
    console.log(`🇮🇩 Bahasa Indonesia:  http://localhost:${port}/id/`);
    console.log(`⌨️  Tekan Ctrl+C untuk menghentikan server.`);
    console.log(`======================================================\n`);
  });
}

startServer(PORT);
