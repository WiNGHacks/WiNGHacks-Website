// Guard the homepage media budget without counting unused source artwork.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sources = ['data/MemberList.js', 'pages/MeadowHome.js', 'pages/MeadowHome.css'];
const assets = new Set();
for (const relative of sources) {
  const source = path.join(root, 'src/components', relative);
  for (const match of fs.readFileSync(source, 'utf8').matchAll(/["'](\.\.\/pictures\/[^"']+)["']/g)) {
    assets.add(path.resolve(path.dirname(source), match[1]));
  }
}
let images = 0, video = 0;
for (const asset of assets) {
  const bytes = fs.statSync(asset).size;
  if (asset.endsWith('.mp4')) video += bytes;
  else images += bytes;
}
console.log(`Homepage images: ${images.toLocaleString()} bytes; autoplay video: ${video.toLocaleString()} bytes`);
if (images > 1_500_000 || video > 1_500_000) {
  console.error('Homepage media exceeds its budget. Optimize new assets before deploying.');
  process.exitCode = 1;
}
