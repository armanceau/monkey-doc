# Monkey-Doc

A narrative-first documentation tool — a beautiful alternative to Storybook.

> **Storybook** = component documentation  
> **Monkey-Doc** = product guides + storytelling

Inspired by Notion, GitBook, and Vercel docs. Built with Vite, React, and MDX.

## Installation

```bash
npx monkey-doc init
```

## Quick Start

```bash
# 1. Initialize docs in your project
npx monkey-doc init

# 2. Start the local documentation server
npx monkey-doc dev
```

Open [http://localhost:5173](http://localhost:5173) to see your docs.

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

## Configuration

`monkey-doc.config.ts` at the root of your project:

```ts
export default {
  title: 'My Docs',
  description: 'Product documentation',
};
```

## MDX Components

Use these built-in components directly in your `.mdx` files:

### `<Callout>`

```mdx
<Callout type="info">This is an info callout.</Callout>
<Callout type="warning">Watch out!</Callout>
<Callout type="success">All good!</Callout>
```

### `<Tabs>`

```mdx
<Tabs items={['npm', 'yarn', 'pnpm']}>
  <Tab>npm install monkey-doc</Tab>
  <Tab>yarn add monkey-doc</Tab>
  <Tab>pnpm add monkey-doc</Tab>
</Tabs>
```

### `<Card>`

```mdx
<Card title="Getting Started" href="/getting-started">
  Learn how to set up Monkey-Doc in your project.
</Card>
```

### `<Steps>`

```mdx
<Steps>
  <Step title="Install">Run `npx monkey-doc init`</Step>
  <Step title="Write">Add `.mdx` files to `/docs`</Step>
  <Step title="Preview">Run `npx monkey-doc dev`</Step>
</Steps>
```

### `<CodeBlock>`

````mdx
<CodeBlock language="ts">
const hello = 'world';
</CodeBlock>
````

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

## Requirements

- Node.js 18+

## License

MIT
