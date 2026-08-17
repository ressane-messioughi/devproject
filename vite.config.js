import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    // Charge les variables du .env et les expose dans process.env pendant les tests.
    // Le 3e argument vide retire le filtre sur le préfixe VITE_ : les variables de
    // test restent ainsi hors du bundle envoyé au navigateur.
    env: loadEnv(mode, process.cwd(), ''),
  },
}));
