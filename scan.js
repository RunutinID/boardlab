const fs = require('fs');

function findAssets(content) {
  const regex = /["'`](\/?assets\/[^"'`\s]+|[^"'`\s]+\.(?:js|css|woff2?|ttf|png|svg|jpe?g|webp|gif|mp3|wav|ogg|glb|gltf|bin|json|ico|wasm))["'`]/g;
  const matches = new Set();
  let m;
  while ((m = regex.exec(content)) !== null) {
    matches.add(m[1]);
  }
  return Array.from(matches);
}

let allAssets = new Set();
['index.html', 'assets/index-GGrOCNGj.js', 'assets/main-Bvl_zo-E.js', 'assets/index-CqDNWwLj.css'].forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    findAssets(content).forEach(a => allAssets.add(a));
  }
});

console.log(JSON.stringify(Array.from(allAssets).sort(), null, 2));
