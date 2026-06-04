export const GETTING_STARTED = `---
title: Getting Started
order: 1
---

# Getting Started

Welcome to **Monkey-Doc** — a beautiful, narrative-first documentation tool for developers.

Unlike Storybook (which focuses on UI components), Monkey-Doc is built for writing
**product guides, onboarding flows, and storytelling documentation**.

## What you'll learn

In this guide you'll learn how to:

- Set up your documentation
- Write your first guide
- Use built-in components

<Callout type="info">
  You're looking at a live example! These files live in your \`/docs\` folder.
</Callout>

## Next steps

Head over to [Installation](/installation) to learn how to add Monkey-Doc to any project.
`;

export const INSTALLATION = `---
title: Installation
order: 2
---

# Installation

Add Monkey-Doc to any project in seconds.

## Prerequisites

<Steps>
  <Step title="Node.js 18+">
    Make sure you have Node.js 18 or higher installed.
  </Step>
  <Step title="A project directory">
    Navigate to the root of your project.
  </Step>
</Steps>

## Quick start

\`\`\`bash
npx monkey-doc init
npx monkey-doc dev
\`\`\`

That's it! Your documentation server starts at \`http://localhost:5173\`.

## Manual install

\`\`\`bash
npm install -g monkey-doc@latest
monkey-doc init
monkey-doc dev
\`\`\`

<Callout type="success">
  Run \`monkey-doc init\` once per project. It creates a \`/docs\` folder with
  example files and a \`monkey-doc.config.ts\` configuration file.
</Callout>

## Deploy

When your docs are ready, build a static site and deploy anywhere:

\`\`\`bash
monkey-doc build        # outputs to ./docs-dist
vercel docs-dist        # Vercel
\`\`\`

The build also generates a \`_redirects\` file (Netlify / Cloudflare Pages) and
\`.nojekyll\` (GitHub Pages) so the SPA routing works out of the box.
`;

export const WRITING_GUIDES = `---
title: Writing Guides
order: 3
---

# Writing Guides

Monkey-Doc uses **MDX** — Markdown with JSX components.

Write plain Markdown and sprinkle in rich components wherever you need them.

## Basic markdown

All standard Markdown syntax works out of the box:

- **Bold**, _italic_, \`inline code\`
- [Links](https://example.com)
- Images: \`![alt](url)\`
- Tables, blockquotes, horizontal rules

## Frontmatter

Every page supports YAML frontmatter:

\`\`\`yaml
---
title: My Page Title
order: 1
---
\`\`\`

- **title** — overrides the filename as the page title
- **order** — controls navigation order (lower = first)

## Using components

Import is not required — all built-in components are globally available.

\`\`\`mdx
<Callout type="warning">
  Watch out for this edge case!
</Callout>
\`\`\`

See [Components](/components) for the full component reference.
`;

export const COMPONENTS = `---
title: Components
order: 4
---

# Components

Monkey-Doc ships with a set of built-in MDX components you can use anywhere.

## Callout

Highlight important information.

<Callout type="info">This is an **info** callout.</Callout>

<Callout type="warning">This is a **warning** callout.</Callout>

<Callout type="success">This is a **success** callout.</Callout>

\`\`\`mdx
<Callout type="info">Your message here.</Callout>
\`\`\`

## Steps

Walk users through a sequence.

<Steps>
  <Step title="First step">Do this first.</Step>
  <Step title="Second step">Then do this.</Step>
  <Step title="Third step">Finally, do this.</Step>
</Steps>

\`\`\`mdx
<Steps>
  <Step title="First step">Do this first.</Step>
  <Step title="Second step">Then do this.</Step>
</Steps>
\`\`\`

## Card

Group related content visually.

<Card title="Quick tip" description="Cards are great for feature highlights or link grids." />

\`\`\`mdx
<Card title="Quick tip" description="Your description here." />
\`\`\`

## Tabs

Display content in tabbed panels.

<Tabs labels={["npm", "yarn", "pnpm"]}>
  <div><code>npm install monkey-doc</code></div>
  <div><code>yarn add monkey-doc</code></div>
  <div><code>pnpm add monkey-doc</code></div>
</Tabs>
`;

export const BEST_PRACTICES = `---
title: Best Practices
order: 5
---

# Best Practices

Tips for writing great documentation with Monkey-Doc.

## Structure your docs like a story

Good documentation flows. Each page should answer one question clearly.

<Callout type="info">
  Think of each guide as a short article — one idea, clear flow, concrete examples.
</Callout>

## Use the right component

| Need | Component |
|------|-----------|
| Important note | \`<Callout>\` |
| Sequential process | \`<Steps>\` |
| Multiple options | \`<Tabs>\` |
| Feature highlight | \`<Card>\` |
| Code sample | fenced code block |

## Folder structure

Organise docs with folders for sections:

\`\`\`
docs/
  getting-started.mdx
  installation.mdx
  guides/
    writing-docs.mdx
    components.mdx
  reference/
    api.mdx
\`\`\`

Folders appear as collapsible sections in the sidebar.

## Frontmatter matters

Always set \`title\` and \`order\` in frontmatter — they control what users see in navigation.
`;

export const CONFIG_FILE = `import { defineConfig } from 'monkey-doc';

export default defineConfig({
  title: 'My Documentation',
  description: 'Built with Monkey-Doc',
});
`;
