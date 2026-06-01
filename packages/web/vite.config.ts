import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { monkeyDocPlugin } from './src/plugins/monkey-doc-vite-plugin';
import path from 'node:path';

// Default: 2 levels up from packages/web → monorepo root (has docs/ folder)
// CLI dev command overrides this with MONKEY_DOC_PATH=<user project>
const projectPath = process.env.MONKEY_DOC_PATH ?? path.resolve(__dirname, '..', '..');

export default defineConfig({
  plugins: [
    react(),
    monkeyDocPlugin(projectPath),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    fs: {
      allow: [projectPath, path.resolve(__dirname)],
    },
  },
  optimizeDeps: {
    exclude: ['@mdx-js/react'],
  },
});
