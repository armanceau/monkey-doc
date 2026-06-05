import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { monkeyDocPlugin } from './src/plugins/monkey-doc-vite-plugin';
import path from 'node:path';
import { createRequire } from 'node:module';

const _require = createRequire(import.meta.url);

const projectPath = process.env.MONKEY_DOC_PATH ?? path.resolve(__dirname, '..', '..');
const outDir = process.env.MONKEY_DOC_OUT_DIR;

// Read version from the monkey-doc CLI package if available, otherwise fall back to this package.
function resolveVersion(): string {
  try {
    return _require('monkey-doc/package.json').version;
  } catch {
    return _require('./package.json').version;
  }
}

// Force Vite to always use monkey-doc's own React, not the host project's React.
// Without this, Vite can pick up a different React version (e.g. React 17 without createRoot).
const reactRoot = path.dirname(_require.resolve('react/package.json'));
const reactDomRoot = path.dirname(_require.resolve('react-dom/package.json'));

export default defineConfig({
  define: {
    __MONKEY_DOC_VERSION__: JSON.stringify(resolveVersion()),
  },
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
  ...(outDir ? { build: { outDir, emptyOutDir: true } } : {}),
});
