import { defineConfig } from 'monkey-doc';

export default defineConfig({
  title: 'Monkey-Doc',
  description: 'A narrative-first documentation tool',
  github: 'https://github.com/armanceau/monkey-doc',
  versions: [
    { label: 'v4 (Latest)', value: 'v4', path: './docs/v4', tag: 'latest' },
    { label: 'v3',          value: 'v3', path: './docs/v3', tag: 'maintenance' },
  ],
  defaultVersion: 'v4',
});
