// Copia a public/stack solo los logos que usa el portafolio.
// Next.js no sirve archivos de node_modules; se corre con "npm run logos" al sumar una tecnología.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';

const logos = JSON.parse(readFileSync('data/stack-logos.json', 'utf8'));
mkdirSync('public/stack', { recursive: true });

for (const icon of new Set(Object.values(logos))) {
  const source = ['original', 'plain']
    .map((variant) => `node_modules/devicon/icons/${icon}/${icon}-${variant}.svg`)
    .find(existsSync);
  if (!source) throw new Error(`devicon no tiene el logo "${icon}"`);
  copyFileSync(source, `public/stack/${icon}.svg`);
}

console.log(`Logos copiados a public/stack`);
