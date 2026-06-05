# @monkey-doc/core

Core utilities for [Monkey-Doc](https://github.com/armanceau/monkey-doc) — filesystem scanning and navigation tree building for MDX documentation.

## What this package does

`@monkey-doc/core` powers the file discovery layer of Monkey-Doc. It recursively scans a `docs/` directory for `.mdx` and `.md` files, reads their frontmatter, and builds the navigation tree used by the sidebar.

It is consumed internally by `@monkey-doc/web` (the Vite plugin) and the `monkey-doc` CLI. You generally do not need to install it directly unless you are building a custom integration.

## Installation

```bash
npm install @monkey-doc/core
```

## API

### `scanDocs(docsDir: string): DocFile[]`

Recursively scans a directory for `.mdx` / `.md` files. Reads each file's frontmatter to extract `title` and `order`. Returns a flat, sorted array of `DocFile`.

```ts
import { scanDocs } from '@monkey-doc/core';

const files = scanDocs('/path/to/docs');
// [
//   { title: 'Getting Started', slug: 'getting-started', path: '/getting-started', filePath: '...', order: 1 },
//   { title: 'Installation',    slug: 'installation',    path: '/installation',    filePath: '...', order: 2 },
// ]
```

### `buildNavTree(files: DocFile[]): NavNode[]`

Converts a flat `DocFile[]` into a nested `NavNode[]` tree, where subdirectories become folder nodes. Used directly by the sidebar renderer.

```ts
import { scanDocs, buildNavTree } from '@monkey-doc/core';

const files = scanDocs('/path/to/docs');
const nav   = buildNavTree(files);
// [
//   { title: 'Getting Started', slug: 'getting-started', isFolder: false, ... },
//   { title: 'Guides', slug: 'guides', isFolder: true, children: [...] },
// ]
```

## Types

```ts
interface DocFile {
  title: string;
  slug: string;      // e.g. "guides/installation"
  path: string;      // e.g. "/guides/installation"
  filePath: string;  // absolute path on disk
  order: number;     // from frontmatter `order` field, defaults to 999
}

interface NavNode {
  title: string;
  slug: string;
  path: string | null; // null for folder nodes
  children: NavNode[];
  isFolder: boolean;
  order: number;
}

interface Heading {
  level: number;  // 1–6
  text: string;
  id: string;     // slugified, matches the id added by rehype-slug
}

interface MonkeyDocConfig {
  title: string;
  description?: string;
  docsDir?: string;         // custom docs directory, defaults to "docs"
  logo?: string;            // path to logo image
  github?: string;          // GitHub repo URL, enables "Edit on GitHub" links
  defaultLanguage?: string;
}
```

## Part of Monkey-Doc

| Package | Description |
|---|---|
| [`monkey-doc`](https://www.npmjs.com/package/monkey-doc) | CLI — `init`, `dev`, `build` commands |
| [`@monkey-doc/core`](https://www.npmjs.com/package/@monkey-doc/core) | Filesystem scanner and nav tree builder |
| [`@monkey-doc/web`](https://www.npmjs.com/package/@monkey-doc/web) | Vite + React UI and MDX rendering layer |

## License

MIT © [Arthur Manceau](https://github.com/armanceau)
