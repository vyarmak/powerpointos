/* Build step for Firebase Hosting: assemble the static site in public/ from src/.
   There is no bundling — copy the source files as-is. Firebase serves index.html
   (firebase.json rewrites ** -> /index.html).

   We refresh only the src-derived assets and do NOT wipe all of public/, so anything
   else living there (e.g. .well-known/ used for domain/SSL verification) is preserved. */
import { cpSync, rmSync, mkdirSync } from 'node:fs';

const SRC = 'src';
const OUT = 'public';
const ASSETS = [
  'index.html', 'css', 'js',
  'favicon.svg', 'og.svg', 'og.png',
  'apple-touch-icon.png', 'icon-192.png', 'icon-512.png',
  'robots.txt', 'sitemap.xml', 'site.webmanifest',
];

mkdirSync(OUT, { recursive: true });

for (const name of ASSETS) {
  rmSync(`${OUT}/${name}`, { recursive: true, force: true });
  cpSync(`${SRC}/${name}`, `${OUT}/${name}`, { recursive: true });
}

console.log(`Built ${OUT}/ from ${SRC}/ (${ASSETS.join(', ')})`);
