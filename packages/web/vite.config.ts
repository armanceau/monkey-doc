import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { monkeyDocPlugin } from './src/plugins/monkey-doc-vite-plugin';
import path from 'node:path';
import { createRequire } from 'node:module';

const _require = createRequire(import.meta.url);

const projectPath = process.env.MONKEY_DOC_PATH ?? path.resolve(__dirname, '..', '..');

// Force Vite to always use monkey-doc's own React, not the host project's React.
// Without this, Vite can pick up a different React version (e.g. React 17 without createRoot).
const reactRoot = path.dirname(_require.resolve('react/package.json'));
const reactDomRoot = path.dirname(_require.resolve('react-dom/package.json'));

export default defineConfig({
  plugins: [
    react(),
    monkeyDocPlugin(projectPath),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': reactRoot,
      'react-dom': reactDomRoot,
      'dayjs/dayjs.min.js': 'dayjs',
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: {
      allow: [projectPath, path.resolve(__dirname), reactRoot, reactDomRoot],
    },
  },
  optimizeDeps: {
    exclude: ['@mdx-js/react'],
    include: ['mermaid'],
  },
});
