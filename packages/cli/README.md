# Monkey-Doc

A narrative-first documentation tool — a beautiful alternative to Storybook.

> **Storybook** = component documentation  
> **Monkey-Doc** = product guides + storytelling

Inspired by Notion, GitBook, and Vercel docs. Built with Vite, React, and MDX.

## Installation

```bash
npm install -g monkey-doc@latest
```

## Quick Start

```bash
# 1. Initialize docs in your project
monkey-doc init

# 2. Start the local documentation server
monkey-doc dev
```

Open [http://localhost:5173](http://localhost:5173) to see your docs.

## Commands

### `monkey-doc init`

Creates a `/docs` folder with example MDX files and a `monkey-doc.config.ts` config file.

### `monkey-doc dev`

Starts a local documentation server with hot reload on MDX changes.

### `monkey-doc build`

Builds a static site ready to deploy anywhere.

```bash
monkey-doc build                # → ./docs-dist/
monkey-doc build -o my-site     # custom output directory
```

Includes `_redirects` (Netlify / Cloudflare Pages) and `.nojekyll` (GitHub Pages) out of the box.

```bash
vercel docs-dist                # deploy to Vercel
```

## Configuration

`monkey-doc.config.ts` at the root of your project:

```ts
export default {
  title: 'My Docs',
  description: 'Product documentation',
  github: 'https://github.com/your/repo',
};
```

## What `init` creates

```
your-project/
├── docs/
│   ├── getting-started.mdx
│   ├── installation.mdx
│   ├── writing-guides.mdx
│   ├── components.mdx
│   └── best-practices.mdx
└── monkey-doc.config.ts
```

## Docs structure

Any `.mdx` file inside `/docs` becomes a page. Nested folders become sections in the sidebar:

```
docs/
├── getting-started.mdx     → /getting-started
├── guides/
│   ├── writing.mdx         → /guides/writing
│   └── components.mdx      → /guides/components
└── reference/
    └── config.mdx          → /reference/config
```

## MDX Components

Use these built-in components directly in your `.mdx` files:

### `<Callout>`
```mdx
<Callout type="info">This is an info callout.</Callout>
<Callout type="warning">Watch out!</Callout>
<Callout type="success">All good!</Callout>
```

### `<Steps>`
```mdx
<Steps>
  <Step title="Install">Run `monkey-doc init`</Step>
  <Step title="Write">Add `.mdx` files to `/docs`</Step>
  <Step title="Preview">Run `monkey-doc dev`</Step>
</Steps>
```

### `<Tabs>`
```mdx
<Tabs items={['npm', 'yarn', 'pnpm']}>
  <Tab>npm install -g monkey-doc</Tab>
  <Tab>yarn global add monkey-doc</Tab>
  <Tab>pnpm add -g monkey-doc</Tab>
</Tabs>
```

### `<Card>`, `<CodeBlock>`, `<Callout>`, `<Diff>`, `<FileTree>`, `<Mermaid>` and more

Full component reference available in your local docs after `monkey-doc init`.

## Features

- Hot reload on MDX changes
- Sidebar auto-generated from file structure
- Table of contents from headings
- Full-text search (⌘K)
- Dark mode
- Multi-language support
- Export PDF
- Deploy as static site

## Requirements

- Node.js 18+

## License

MIT
