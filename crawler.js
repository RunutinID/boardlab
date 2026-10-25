const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://learn-arduino-red.vercel.app';

const visited = new Set();
const queue = new Set([
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/site.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
  // Locales
  '/es/',
  '/pt/',
  '/fr/',
  '/de/',
  '/it/',
  '/tr/',
  '/id/',
  '/zh/',
  '/ja/',
  '/ko/',
  '/hi/',
  '/he/',
  // Assets
  '/assets/barlow-semi-condensed-latin-600-normal-BkLiAYu4.woff2',
  '/assets/barlow-semi-condensed-latin-500-normal-G0uxJNrM.woff2',
  '/assets/index-GGrOCNGj.js',
  '/assets/index-CqDNWwLj.css',
  '/assets/main-Bvl_zo-E.js',
  '/assets/kit-DXbMhk_I.js',
  '/assets/stage-QLKhHYHN.js',
  '/assets/thumbs-DPauGRHu.js',
  '/assets/de-BjleKp1j.js',
  '/assets/es-DXc-vWaP.js',
  '/assets/fr-fnbXGytW.js',
  '/assets/he-DxodrnLp.js',
  '/assets/hi-BA7shazM.js',
  '/assets/id-CNsWI0r3.js',
  '/assets/it-CS9fNRw1.js',
  '/assets/ja-C33ou61z.js',
  '/assets/ko-prcWXKny.js',
  '/assets/pt-DAdBr9jW.js',
  '/assets/tr-Du5Em3hV.js',
  '/assets/zh-DawrnNnG.js'
]);

function normalizeUrlPath(urlStr, referrer = '/') {
  try {
    if (urlStr.startsWith('data:') || urlStr.startsWith('blob:') || urlStr.startsWith('javascript:') || urlStr.startsWith('mailto:')) {
      return null;
    }
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
      const u = new URL(urlStr);
      if (u.hostname !== 'learn-arduino-red.vercel.app') return null;
      return u.pathname;
    }
    // Relative path
    if (urlStr.startsWith('/')) {
      return urlStr.split('?')[0].split('#')[0];
    }
    if (urlStr.startsWith('./')) {
      urlStr = urlStr.slice(2);
    }
    // If referrer was in assets
    if (referrer.startsWith('/assets/')) {
      return ('/assets/' + urlStr).split('?')[0].split('#')[0];
    }
    const dir = path.posix.dirname(referrer);
    return path.posix.join(dir, urlStr).split('?')[0].split('#')[0];
  } catch (e) {
    return null;
  }
}

function extractLinks(content, referrer) {
  const found = new Set();
  
  // Match string literals that look like paths, assets, filenames
  const regex = /["'`](\/?(?:assets\/)?[a-zA-Z0-9_\-\./]+\.(?:js|css|woff2?|ttf|png|svg|jpe?g|webp|gif|mp3|wav|ogg|glb|gltf|bin|json|ico|wasm|html|webmanifest|xml|txt))["'`]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const raw = m[1];
    const norm = normalizeUrlPath(raw, referrer);
    if (norm) found.add(norm);
  }

  // Also check imports like import("./foo.js") or from "./foo.js"
  const importRegex = /(?:import|from)\s*\(?['"]([^'"]+)['"]/g;
  while ((m = importRegex.exec(content)) !== null) {
    const raw = m[1];
    const norm = normalizeUrlPath(raw, referrer);
    if (norm) found.add(norm);
  }

  // Also check url(...) in css
  const urlRegex = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
  while ((m = urlRegex.exec(content)) !== null) {
    const raw = m[1];
    const norm = normalizeUrlPath(raw, referrer);
    if (norm) found.add(norm);
  }

  // Also check href/src
  const attrRegex = /(?:href|src)=["']([^"']+)["']/g;
  while ((m = attrRegex.exec(content)) !== null) {
    const raw = m[1];
    const norm = normalizeUrlPath(raw, referrer);
    if (norm) found.add(norm);
  }

  return Array.from(found);
}

function fetchFile(urlPath) {
  return new Promise((resolve) => {
    const targetUrl = BASE_URL + urlPath;
    const req = https.get(targetUrl, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Redirect
        resolve({ status: res.statusCode, redirect: res.headers.location });
        return;
      }
      if (res.statusCode !== 200) {
        resolve({ status: res.statusCode });
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        resolve({ status: 200, buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] });
      });
    });
    req.on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ status: 408, error: 'Timeout' });
    });
  });
}

async function run() {
  console.log('Starting crawler...');
  let downloadedCount = 0;

  while (queue.size > 0) {
    const current = queue.values().next().value;
    queue.delete(current);

    if (visited.has(current)) continue;
    visited.add(current);

    process.stdout.write(`Fetching ${current}... `);
    const result = await fetchFile(current);

    if (result.status === 200 && result.buffer) {
      downloadedCount++;
      // Determine local save path
      let localPath;
      if (current === '/' || current.endsWith('/')) {
        localPath = path.join('.', current, 'index.html');
      } else {
        localPath = path.join('.', current);
      }

      // Ensure directory exists
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, result.buffer);
      console.log(`OK (${result.buffer.length} bytes) -> ${localPath}`);

      // If text / js / css / html / json, extract more links
      const isText = (result.contentType && (
        result.contentType.includes('text') ||
        result.contentType.includes('javascript') ||
        result.contentType.includes('json') ||
        result.contentType.includes('svg')
      )) || localPath.endsWith('.js') || localPath.endsWith('.css') || localPath.endsWith('.html') || localPath.endsWith('.json') || localPath.endsWith('.webmanifest');

      if (isText) {
        const textContent = result.buffer.toString('utf8');
        const newLinks = extractLinks(textContent, current);
        for (const l of newLinks) {
          if (!visited.has(l) && !queue.has(l)) {
            queue.add(l);
          }
        }
      }
    } else if (result.redirect) {
      console.log(`REDIRECT -> ${result.redirect}`);
      const norm = normalizeUrlPath(result.redirect, current);
      if (norm && !visited.has(norm) && !queue.has(norm)) {
        queue.add(norm);
      }
    } else {
      console.log(`HTTP ${result.status} ${result.error || ''}`);
    }
  }

  console.log(`\nCrawling complete! Downloaded ${downloadedCount} files.`);
}

run();
