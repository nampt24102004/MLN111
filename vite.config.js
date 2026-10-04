import { defineConfig } from 'vite';
import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

// Preserve the offline game's relative script, stylesheet and image paths in dist.
export default defineConfig({
  base: './',
  // Keep Vite's writable cache separate from the locked node_modules cache.
  cacheDir: '.vite-cache',
  server: { open: '/' },
  plugins: [{
    name: 'build-and-copy-minigames',
    buildStart() {
      buildSync({ entryPoints: [fileURLToPath(new URL('./src/minigame 2/main.jsx', import.meta.url))], outfile: fileURLToPath(new URL('./src/minigame 2/app.js', import.meta.url)), bundle: true, format: 'iife', minify: true, define: { 'process.env.NODE_ENV': '"production"' } });
    },
    closeBundle() {
      for (const game of ['minigame 1', 'minigame 2']) {
        const source = fileURLToPath(new URL(`./src/${game}/`, import.meta.url));
        const destination = fileURLToPath(new URL(`./dist/src/${game}/`, import.meta.url));
        mkdirSync(destination, { recursive: true });
        cpSync(source, destination, { recursive: true });
      }
    },
  }],
});
