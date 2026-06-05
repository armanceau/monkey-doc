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

export const DEPLOY_EN = `---
title: Deploy
order: 6
---

# Deploy

Monkey-Doc builds a static site you can host anywhere — Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static file host.

## Build your docs

\`\`\`bash
npx monkey-doc build
\`\`\`

This outputs a production-ready site to \`./docs-dist\`. You can change the output directory:

\`\`\`bash
npx monkey-doc build --output public
\`\`\`

The build automatically generates:
- A \`_redirects\` file (Netlify / Cloudflare Pages SPA routing)
- A \`.nojekyll\` file (GitHub Pages)

<Callout type="info">
  Run \`monkey-doc build\` from the root of your project — the same directory where your \`monkey-doc.config.ts\` lives.
</Callout>

---

## Vercel

The fastest option. Zero configuration required.

<Steps>
  <Step title="Install Vercel CLI">
    \`\`\`bash
    npm install -g vercel
    \`\`\`
  </Step>
  <Step title="Build and deploy">
    \`\`\`bash
    npx monkey-doc build
    vercel docs-dist --prod
    \`\`\`
  </Step>
  <Step title="Done">
    Vercel auto-detects the static output and deploys instantly. Your docs are live at a \`*.vercel.app\` URL.
  </Step>
</Steps>

<Callout type="success">
  On subsequent deploys, just run \`npx monkey-doc build && vercel docs-dist --prod\` again.
</Callout>

---

## Netlify

<Steps>
  <Step title="Option A — Drag and drop (no CLI needed)">
    1. Run \`npx monkey-doc build\`
    2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
    3. Drag the \`docs-dist\` folder into the browser window
  </Step>
  <Step title="Option B — Netlify CLI">
    \`\`\`bash
    npm install -g netlify-cli
    npx monkey-doc build
    netlify deploy --dir docs-dist --prod
    \`\`\`
  </Step>
</Steps>

The \`_redirects\` file in the build output handles SPA routing automatically — no extra Netlify config needed.

---

## GitHub Pages

<Steps>
  <Step title="Build your docs">
    \`\`\`bash
    npx monkey-doc build --output docs-site
    \`\`\`
  </Step>
  <Step title="Push to gh-pages">
    \`\`\`bash
    git add docs-site
    git commit -m "docs: build"
    git subtree push --prefix docs-site origin gh-pages
    \`\`\`
  </Step>
  <Step title="Enable GitHub Pages">
    Go to your repo **Settings → Pages**, set the source to the \`gh-pages\` branch, root \`/\`.
  </Step>
</Steps>

<Callout type="info">
  The \`.nojekyll\` file in the build output tells GitHub Pages not to process the files with Jekyll — required for Vite-generated sites.
</Callout>

---

## Cloudflare Pages

<Steps>
  <Step title="Connect your repository">
    Go to [Cloudflare Pages](https://pages.cloudflare.com) and connect your GitHub or GitLab repository.
  </Step>
  <Step title="Set build configuration">
    In the Cloudflare Pages dashboard, set:

    | Setting | Value |
    |---|---|
    | Build command | \`npx monkey-doc build\` |
    | Build output directory | \`docs-dist\` |
  </Step>
  <Step title="Deploy">
    Cloudflare Pages builds and deploys automatically on every push to your main branch.
  </Step>
</Steps>

---

## Automate with GitHub Actions

Deploy on every push using a CI workflow:

\`\`\`yaml
# .github/workflows/docs.yml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'monkey-doc.config.ts'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - run: npx monkey-doc build

      - name: Deploy to Vercel
        run: npx vercel docs-dist --prod --token \${{ secrets.VERCEL_TOKEN }}
\`\`\`

<Callout type="info">
  Replace the last step with your platform's deploy action — Netlify, GitHub Pages (\`actions/deploy-pages\`), or Cloudflare Pages (\`cloudflare/pages-action\`).
</Callout>
`;

export const DEPLOY_FR = `---
title: Déployer
order: 6
---

# Déployer

Monkey-Doc génère un site statique que vous pouvez héberger n'importe où — Vercel, Netlify, GitHub Pages, Cloudflare Pages, ou tout hébergeur de fichiers statiques.

## Construire la documentation

\`\`\`bash
npx monkey-doc build
\`\`\`

Le site de production est généré dans \`./docs-dist\`. Pour changer le dossier de sortie :

\`\`\`bash
npx monkey-doc build --output public
\`\`\`

Le build génère automatiquement :
- Un fichier \`_redirects\` (routage SPA Netlify / Cloudflare Pages)
- Un fichier \`.nojekyll\` (GitHub Pages)

<Callout type="info">
  Exécutez \`monkey-doc build\` depuis la racine de votre projet — là où se trouve votre \`monkey-doc.config.ts\`.
</Callout>

---

## Vercel

L'option la plus rapide. Zéro configuration nécessaire.

<Steps>
  <Step title="Installer le CLI Vercel">
    \`\`\`bash
    npm install -g vercel
    \`\`\`
  </Step>
  <Step title="Builder et déployer">
    \`\`\`bash
    npx monkey-doc build
    vercel docs-dist --prod
    \`\`\`
  </Step>
  <Step title="Terminé">
    Vercel détecte automatiquement le site statique et déploie instantanément. Vos docs sont en ligne sur une URL \`*.vercel.app\`.
  </Step>
</Steps>

<Callout type="success">
  Pour les déploiements suivants, relancez simplement \`npx monkey-doc build && vercel docs-dist --prod\`.
</Callout>

---

## Netlify

<Steps>
  <Step title="Option A — Glisser-déposer (sans CLI)">
    1. Lancez \`npx monkey-doc build\`
    2. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop)
    3. Faites glisser le dossier \`docs-dist\` dans la fenêtre du navigateur
  </Step>
  <Step title="Option B — CLI Netlify">
    \`\`\`bash
    npm install -g netlify-cli
    npx monkey-doc build
    netlify deploy --dir docs-dist --prod
    \`\`\`
  </Step>
</Steps>

Le fichier \`_redirects\` dans le build gère automatiquement le routage SPA — aucune configuration Netlify supplémentaire n'est nécessaire.

---

## GitHub Pages

<Steps>
  <Step title="Builder la documentation">
    \`\`\`bash
    npx monkey-doc build --output docs-site
    \`\`\`
  </Step>
  <Step title="Pousser sur la branche gh-pages">
    \`\`\`bash
    git add docs-site
    git commit -m "docs: build"
    git subtree push --prefix docs-site origin gh-pages
    \`\`\`
  </Step>
  <Step title="Activer GitHub Pages">
    Allez dans **Settings → Pages** de votre dépôt, définissez la source sur la branche \`gh-pages\`, racine \`/\`.
  </Step>
</Steps>

<Callout type="info">
  Le fichier \`.nojekyll\` indique à GitHub Pages de ne pas traiter les fichiers avec Jekyll — requis pour les sites générés par Vite.
</Callout>

---

## Cloudflare Pages

<Steps>
  <Step title="Connecter votre dépôt">
    Allez sur [Cloudflare Pages](https://pages.cloudflare.com) et connectez votre dépôt GitHub ou GitLab.
  </Step>
  <Step title="Configurer le build">
    Dans le tableau de bord Cloudflare Pages, renseignez :

    | Paramètre | Valeur |
    |---|---|
    | Commande de build | \`npx monkey-doc build\` |
    | Dossier de sortie | \`docs-dist\` |
  </Step>
  <Step title="Déployer">
    Cloudflare Pages build et déploie automatiquement à chaque push sur votre branche principale.
  </Step>
</Steps>

---

## Automatiser avec GitHub Actions

Déployez à chaque push grâce à un workflow CI :

\`\`\`yaml
# .github/workflows/docs.yml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - 'monkey-doc.config.ts'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - run: npx monkey-doc build

      - name: Déployer sur Vercel
        run: npx vercel docs-dist --prod --token \${{ secrets.VERCEL_TOKEN }}
\`\`\`

<Callout type="info">
  Remplacez la dernière étape par l'action de déploiement de votre plateforme — Netlify, GitHub Pages (\`actions/deploy-pages\`), ou Cloudflare Pages (\`cloudflare/pages-action\`).
</Callout>
`;

export const CONFIG_FILE = `import { defineConfig } from 'monkey-doc';

export default defineConfig({
  title: 'My Documentation',
  description: 'Built with Monkey-Doc',
  // github: 'https://github.com/your-org/your-repo',
  // logo: '/logo.svg',
  // docsDir: 'docs',
});
`;
