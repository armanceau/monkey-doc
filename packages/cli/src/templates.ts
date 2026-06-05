// ─── English ──────────────────────────────────────────────────────────────────

export const EN_GETTING_STARTED = `---
title: Getting Started
order: 1
---

# Getting Started

Welcome to Monkey-Doc. This page is in **English** — use the language switcher in the top-right to switch to another language.

## Installation

\`\`\`bash
npx monkey-doc init
npx monkey-doc dev
\`\`\`

## How it works

Monkey-Doc scans your \`docs/\` folder and builds navigation automatically. Organize pages in subfolders to get breadcrumbs and sections.
`;

export const EN_INSTALLATION = `---
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
npm install -g monkey-doc
monkey-doc init
monkey-doc dev
\`\`\`

<Callout type="success">
  Run \`monkey-doc init\` once per project. It creates a \`/docs\` folder with
  example files and a \`monkey-doc.config.ts\` configuration file.
</Callout>
`;

export const EN_WRITING_GUIDES = `---
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

See [Components](/en/components) for the full component reference.

## Organizing with folders

You can nest pages inside folders to group related content. The folder structure maps directly to the sidebar navigation.

<FileTree>
  <Folder name="docs">
    <File name="getting-started.mdx" />
    <Folder name="guides">
      <File name="writing-guides.mdx" />
      <File name="best-practices.mdx" />
    </Folder>
    <Folder name="reference">
      <File name="components.mdx" />
      <File name="configuration.mdx" />
    </Folder>
  </Folder>
</FileTree>

Each folder automatically becomes a collapsible section in the sidebar. The section title is derived from the folder name (kebab-case is converted to title case).

To control the order of sections and pages, use the \`order\` frontmatter field — it works the same for files inside folders.

<Callout type="info">
  Folders can be nested as deeply as you need. There is no limit on nesting depth.
</Callout>
`;

export const EN_COMPONENTS = `---
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

\`\`\`mdx
<Tabs labels={["npm", "yarn", "pnpm"]}>
  <div>npm install monkey-doc</div>
  <div>yarn add monkey-doc</div>
  <div>pnpm add monkey-doc</div>
</Tabs>
\`\`\`

## FileTree

Visualize a folder structure.

<FileTree>
  <Folder name="docs">
    <File name="getting-started.mdx" highlight />
    <Folder name="guides">
      <File name="writing-guides.mdx" />
      <File name="best-practices.mdx" />
    </Folder>
    <File name="components.mdx" />
  </Folder>
</FileTree>

Use the \`highlight\` prop on a \`<File>\` to draw attention to a specific file.

\`\`\`mdx
<FileTree>
  <Folder name="docs">
    <File name="getting-started.mdx" highlight />
    <Folder name="guides">
      <File name="writing-guides.mdx" />
    </Folder>
  </Folder>
</FileTree>
\`\`\`

## CodeGroup

Show multiple code snippets in tabs — ideal for package manager commands or multi-language examples.

<CodeGroup labels={["npm", "yarn", "pnpm"]}>

\`\`\`bash
npm install monkey-doc
\`\`\`

\`\`\`bash
yarn add monkey-doc
\`\`\`

\`\`\`bash
pnpm add monkey-doc
\`\`\`

</CodeGroup>

## Accordion

Collapsible sections, great for FAQs or optional details.

<Accordion title="What is Monkey-Doc?">
  Monkey-Doc is a documentation tool focused on product guides and storytelling, as an alternative to Storybook.
</Accordion>

<Accordion title="Do I need to configure anything?">
  No — run \`npx monkey-doc init\` and you're ready to go. Zero configuration required.
</Accordion>

<Accordion title="Can I nest folders?" defaultOpen>
  Yes, folders can be nested as deeply as needed. The sidebar is generated automatically from your file structure.
</Accordion>

\`\`\`mdx
<Accordion title="Your question here">
  Your answer here.
</Accordion>

<Accordion title="Open by default" defaultOpen>
  This one starts expanded.
</Accordion>
\`\`\`

## Badge

Inline labels for status, versioning, or categorization.

<div className="flex flex-wrap gap-2 my-4">
  <Badge>Default</Badge>
  <Badge variant="info">Info</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="error">Error</Badge>
  <Badge variant="new">New</Badge>
  <Badge variant="beta">Beta</Badge>
  <Badge variant="deprecated">Deprecated</Badge>
</div>

Use badges inline in prose too — for example, this feature is <Badge variant="new">New</Badge> in v2.

\`\`\`mdx
<Badge variant="new">New</Badge>
<Badge variant="beta">Beta</Badge>
<Badge variant="deprecated">Deprecated</Badge>
\`\`\`

Available variants: \`default\` · \`info\` · \`success\` · \`warning\` · \`error\` · \`new\` · \`beta\` · \`deprecated\`

## Mermaid

Render diagrams from [Mermaid](https://mermaid.js.org) syntax.

\`\`\`mermaid
flowchart LR
  A[Write MDX] --> B[Run monkey-doc dev]
  B --> C{Happy?}
  C -- Yes --> D[Ship it 🚀]
  C -- No --> A
\`\`\`

\`\`\`mermaid
sequenceDiagram
  Developer->>monkey-doc: npx monkey-doc dev
  monkey-doc->>Browser: Serves docs at localhost:5173
  Browser-->>Developer: Live preview with hot reload
\`\`\`

## Property

Document a prop, parameter, or configuration option with its type, default value, and description.

<PropertyGroup title="Props">
  <Property name="title" type="string" required>
    The title of the page or section.
  </Property>
  <Property name="order" type="number" defaultValue="999">
    Controls the position of the page in the sidebar. Lower values appear first.
  </Property>
  <Property name="description" type="string">
    A short description shown in search results and meta tags.
  </Property>
  <Property name="theme" type='"light" | "dark" | "auto"' defaultValue='"auto"'>
    Sets the color theme for the documentation site.
  </Property>
  <Property name="legacyProp" type="boolean" deprecated>
    This prop is no longer used. Remove it from your config.
  </Property>
</PropertyGroup>

\`\`\`mdx
<PropertyGroup title="Props">
  <Property name="title" type="string" required>
    The title of the page.
  </Property>
  <Property name="order" type="number" defaultValue="999">
    Position in the sidebar.
  </Property>
</PropertyGroup>
\`\`\`

## Video

Embed a video from a URL or a YouTube / Vimeo link.

\`\`\`mdx
<Video src="/demo.mp4" caption="Feature walkthrough" />

<Video
  src="https://www.youtube.com/watch?v=VIDEO_ID"
  poster="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
  title="Demo"
  caption="Optional caption"
/>
\`\`\`

## Breadcrumb

An inline breadcrumb trail for content pages.

<Breadcrumb items={["Docs", "Components", "Breadcrumb"]} />

\`\`\`mdx
<Breadcrumb items={["Docs", "Components", "Breadcrumb"]} />
<Breadcrumb items={[{ label: "Docs", href: "/" }, "Components"]} />
\`\`\`

## Diff

Show a before/after code diff with green/red line highlighting.

<Diff
  before="const greeting = 'Hello'"
  after="const greeting = 'Hello, World!'"
  language="js"
/>

\`\`\`mdx
<Diff
  before="const message = 'Hello World'"
  after="const message = 'Hello, Universe!'"
  language="js"
/>
\`\`\`

## Stepper

An interactive checklist-style stepper. Click a step to mark it complete.

<Stepper>
  <StepperStep title="Clone the repository">
    Run \`git clone https://github.com/your-org/your-project.git\` to get a local copy.
  </StepperStep>
  <StepperStep title="Install dependencies">
    Navigate into the project folder and run \`npm install\`.
  </StepperStep>
  <StepperStep title="Start the dev server">
    Run \`npm run dev\` and open \`http://localhost:5173\` in your browser.
  </StepperStep>
</Stepper>

\`\`\`mdx
<Stepper>
  <StepperStep title="Clone the repository">
    Run \`git clone ...\`
  </StepperStep>
  <StepperStep title="Install dependencies">
    Run \`npm install\`.
  </StepperStep>
</Stepper>
\`\`\`

## LinkButton

A styled link that looks like a button. Three variants and three sizes — works great for CTAs, download links, or navigation.

<div className="flex flex-wrap gap-3 my-4">
  <LinkButton href="/en/getting-started">Get started</LinkButton>
  <LinkButton href="/en/getting-started" variant="outline">Read the docs</LinkButton>
  <LinkButton href="/en/getting-started" variant="ghost">Learn more</LinkButton>
</div>

External links automatically get a \`↗\` icon and open in a new tab:

<LinkButton href="https://github.com/armanceau/monkey-doc">View on GitHub</LinkButton>

\`\`\`mdx
<LinkButton href="/installation">Get started</LinkButton>
<LinkButton href="/guide" variant="outline" size="sm">Read more</LinkButton>
<LinkButton href="https://github.com" variant="ghost">GitHub ↗</LinkButton>
\`\`\`

Props: \`href\` · \`variant\` (\`default\` / \`outline\` / \`ghost\`) · \`size\` (\`sm\` / \`md\` / \`lg\`) · \`external\` (auto-detected from URL)

## Charts

Three chart types powered by Chart.js. All adapt to dark mode automatically.

### BarChart

<BarChart
  labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
  datasets={[
    { label: "Page views", data: [4200, 5800, 4900, 7100, 6300, 8400] },
    { label: "Unique visitors", data: [2100, 3200, 2700, 4100, 3500, 4900] }
  ]}
  title="Monthly traffic"
/>

\`\`\`mdx
<BarChart
  labels={["Jan", "Feb", "Mar"]}
  datasets={[{ label: "Views", data: [4200, 5800, 4900] }]}
  title="Monthly traffic"
/>
\`\`\`

Add \`horizontal\` for a horizontal layout. Use \`height\` to adjust the chart height (default \`280\`).

### DonutChart

<DonutChart
  labels={["Vercel", "Netlify", "GitHub Pages", "Cloudflare"]}
  data={[48, 27, 15, 10]}
  title="Deploy platform distribution"
/>

\`\`\`mdx
<DonutChart
  labels={["Vercel", "Netlify", "GitHub Pages"]}
  data={[48, 27, 25]}
  title="Deploy platforms"
/>
\`\`\`

### RadarChart

<RadarChart
  labels={["Performance", "SEO", "Accessibility", "Best Practices", "PWA"]}
  datasets={[
    { label: "v1.0", data: [72, 85, 78, 80, 55] },
    { label: "v2.0", data: [95, 92, 97, 91, 78] }
  ]}
  title="Lighthouse scores"
/>

\`\`\`mdx
<RadarChart
  labels={["Performance", "SEO", "Accessibility"]}
  datasets={[
    { label: "v1", data: [72, 85, 78] },
    { label: "v2", data: [95, 92, 97] }
  ]}
  title="Scores"
/>
\`\`\`
`;

export const EN_BEST_PRACTICES = `---
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
  en/
    getting-started.mdx
    installation.mdx
    guides/
      writing-docs.mdx
    reference/
      api.mdx
\`\`\`

Folders appear as collapsible sections in the sidebar.

## Frontmatter matters

Always set \`title\` and \`order\` in frontmatter — they control what users see in navigation.
`;

// ─── French ───────────────────────────────────────────────────────────────────

export const FR_GETTING_STARTED = `---
title: Démarrage
order: 1
---

# Démarrage

Bienvenue sur Monkey-Doc. Cette page est en **français** — utilisez le sélecteur de langue en haut à droite pour changer de langue.

## Installation

\`\`\`bash
npx monkey-doc init
npx monkey-doc dev
\`\`\`

## Comment ça marche

Monkey-Doc scanne votre dossier \`docs/\` et construit la navigation automatiquement. Organisez vos pages dans des sous-dossiers pour obtenir le fil d'Ariane et les sections.
`;

export const FR_INSTALLATION = `---
title: Installation
order: 2
---

# Installation

Ajoutez Monkey-Doc à n'importe quel projet en quelques secondes.

## Prérequis

<Steps>
  <Step title="Node.js 18+">
    Assurez-vous d'avoir Node.js 18 ou supérieur installé.
  </Step>
  <Step title="Un répertoire de projet">
    Naviguez jusqu'à la racine de votre projet.
  </Step>
</Steps>

## Démarrage rapide

\`\`\`bash
npx monkey-doc init
npx monkey-doc dev
\`\`\`

C'est tout ! Votre serveur de documentation démarre sur \`http://localhost:5173\`.

## Installation manuelle

\`\`\`bash
npm install -g monkey-doc
monkey-doc init
monkey-doc dev
\`\`\`

<Callout type="success">
  Lancez \`monkey-doc init\` une seule fois par projet. Cela crée un dossier \`/docs\` avec
  des fichiers d'exemple et un fichier de configuration \`monkey-doc.config.ts\`.
</Callout>
`;

export const FR_WRITING_GUIDES = `---
title: Écrire des guides
order: 3
---

# Écrire des guides

Monkey-Doc utilise **MDX** — du Markdown avec des composants JSX.

Rédigez du Markdown classique et intégrez des composants enrichis là où vous en avez besoin.

## Markdown de base

Toute la syntaxe Markdown standard fonctionne nativement :

- **Gras**, _italique_, \`code en ligne\`
- [Liens](https://example.com)
- Images : \`![alt](url)\`
- Tableaux, citations, séparateurs horizontaux

## Frontmatter

Chaque page supporte le frontmatter YAML :

\`\`\`yaml
---
title: Titre de ma page
order: 1
---
\`\`\`

- **title** — remplace le nom de fichier comme titre de la page
- **order** — contrôle l'ordre de navigation (plus petit = en premier)

## Utiliser les composants

Aucun import nécessaire — tous les composants intégrés sont disponibles globalement.

\`\`\`mdx
<Callout type="warning">
  Attention à ce cas limite !
</Callout>
\`\`\`

Consultez [Composants](/fr/components) pour la référence complète des composants.

## Organiser avec des dossiers

Vous pouvez imbriquer des pages dans des dossiers pour regrouper du contenu lié. La structure de dossiers se reflète directement dans la navigation de la sidebar.

<FileTree>
  <Folder name="docs">
    <File name="getting-started.mdx" />
    <Folder name="guides">
      <File name="writing-guides.mdx" />
      <File name="best-practices.mdx" />
    </Folder>
    <Folder name="reference">
      <File name="components.mdx" />
      <File name="configuration.mdx" />
    </Folder>
  </Folder>
</FileTree>

Chaque dossier devient automatiquement une section repliable dans la sidebar. Le titre de la section est dérivé du nom du dossier (le kebab-case est converti en titre lisible).

Pour contrôler l'ordre des sections et des pages, utilisez le champ \`order\` en frontmatter — il fonctionne de la même façon pour les fichiers à l'intérieur des dossiers.

<Callout type="info">
  Les dossiers peuvent être imbriqués aussi profondément que nécessaire. Il n'y a pas de limite de profondeur.
</Callout>
`;

export const FR_COMPONENTS = `---
title: Composants
order: 4
---

# Composants

Monkey-Doc est livré avec un ensemble de composants MDX intégrés utilisables partout.

## Callout

Mettez en évidence des informations importantes.

<Callout type="info">Ceci est un callout **info**.</Callout>

<Callout type="warning">Ceci est un callout **avertissement**.</Callout>

<Callout type="success">Ceci est un callout **succès**.</Callout>

\`\`\`mdx
<Callout type="info">Votre message ici.</Callout>
\`\`\`

## Steps

Guidez les utilisateurs à travers une séquence.

<Steps>
  <Step title="Première étape">Faites ceci en premier.</Step>
  <Step title="Deuxième étape">Puis faites cela.</Step>
  <Step title="Troisième étape">Enfin, faites ceci.</Step>
</Steps>

\`\`\`mdx
<Steps>
  <Step title="Première étape">Faites ceci en premier.</Step>
  <Step title="Deuxième étape">Puis faites cela.</Step>
</Steps>
\`\`\`

## Card

Regroupez visuellement du contenu lié.

<Card title="Conseil rapide" description="Les cartes sont idéales pour mettre en avant des fonctionnalités ou créer des grilles de liens." />

\`\`\`mdx
<Card title="Conseil rapide" description="Votre description ici." />
\`\`\`

## Tabs

Affichez du contenu dans des panneaux à onglets.

<Tabs labels={["npm", "yarn", "pnpm"]}>
  <div><code>npm install monkey-doc</code></div>
  <div><code>yarn add monkey-doc</code></div>
  <div><code>pnpm add monkey-doc</code></div>
</Tabs>

\`\`\`mdx
<Tabs labels={["npm", "yarn", "pnpm"]}>
  <div>npm install monkey-doc</div>
  <div>yarn add monkey-doc</div>
  <div>pnpm add monkey-doc</div>
</Tabs>
\`\`\`

## FileTree

Visualisez une structure de dossiers.

<FileTree>
  <Folder name="docs">
    <File name="getting-started.mdx" highlight />
    <Folder name="guides">
      <File name="writing-guides.mdx" />
      <File name="best-practices.mdx" />
    </Folder>
    <File name="components.mdx" />
  </Folder>
</FileTree>

Utilisez la prop \`highlight\` sur un \`<File>\` pour attirer l'attention sur un fichier spécifique.

\`\`\`mdx
<FileTree>
  <Folder name="docs">
    <File name="getting-started.mdx" highlight />
  </Folder>
</FileTree>
\`\`\`

## CodeGroup

Affichez plusieurs extraits de code dans des onglets.

<CodeGroup labels={["npm", "yarn", "pnpm"]}>

\`\`\`bash
npm install monkey-doc
\`\`\`

\`\`\`bash
yarn add monkey-doc
\`\`\`

\`\`\`bash
pnpm add monkey-doc
\`\`\`

</CodeGroup>

## Accordion

Sections repliables, idéales pour les FAQ ou les détails optionnels.

<Accordion title="Qu'est-ce que Monkey-Doc ?">
  Monkey-Doc est un outil de documentation orienté guides produit et storytelling, en alternative à Storybook.
</Accordion>

<Accordion title="Faut-il configurer quelque chose ?">
  Non — lancez \`npx monkey-doc init\` et c'est prêt. Zéro configuration requise.
</Accordion>

<Accordion title="Peut-on imbriquer des dossiers ?" defaultOpen>
  Oui, les dossiers peuvent être imbriqués aussi profondément que nécessaire.
</Accordion>

\`\`\`mdx
<Accordion title="Votre question ici">
  Votre réponse ici.
</Accordion>
\`\`\`

## Badge

Étiquettes inline pour le statut, le versioning ou la catégorisation.

<div className="flex flex-wrap gap-2 my-4">
  <Badge>Default</Badge>
  <Badge variant="info">Info</Badge>
  <Badge variant="success">Succès</Badge>
  <Badge variant="warning">Attention</Badge>
  <Badge variant="error">Erreur</Badge>
  <Badge variant="new">Nouveau</Badge>
  <Badge variant="beta">Beta</Badge>
  <Badge variant="deprecated">Déprécié</Badge>
</div>

\`\`\`mdx
<Badge variant="new">Nouveau</Badge>
<Badge variant="beta">Beta</Badge>
<Badge variant="deprecated">Déprécié</Badge>
\`\`\`

Variantes disponibles : \`default\` · \`info\` · \`success\` · \`warning\` · \`error\` · \`new\` · \`beta\` · \`deprecated\`

## Mermaid

Rendu de diagrammes depuis la syntaxe [Mermaid](https://mermaid.js.org).

\`\`\`mermaid
flowchart LR
  A[Écrire du MDX] --> B[Lancer monkey-doc dev]
  B --> C{Satisfait ?}
  C -- Oui --> D[Déployer 🚀]
  C -- Non --> A
\`\`\`

## Property

Documentez une prop, un paramètre ou une option de configuration.

<PropertyGroup title="Props">
  <Property name="title" type="string" required>
    Le titre de la page ou de la section.
  </Property>
  <Property name="order" type="number" defaultValue="999">
    Contrôle la position de la page dans la sidebar.
  </Property>
  <Property name="theme" type='"light" | "dark" | "auto"' defaultValue='"auto"'>
    Définit le thème de couleur du site de documentation.
  </Property>
  <Property name="ancienneProp" type="boolean" deprecated>
    Cette prop n'est plus utilisée. Retirez-la de votre config.
  </Property>
</PropertyGroup>

\`\`\`mdx
<PropertyGroup title="Props">
  <Property name="title" type="string" required>
    Le titre de la page.
  </Property>
</PropertyGroup>
\`\`\`

## Video

Intégrez une vidéo depuis une URL ou un lien YouTube / Vimeo.

\`\`\`mdx
<Video src="/demo.mp4" caption="Présentation de la fonctionnalité" />

<Video
  src="https://www.youtube.com/watch?v=VIDEO_ID"
  poster="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
  title="Démo"
  caption="Légende optionnelle"
/>
\`\`\`

## Breadcrumb

Un fil d'Ariane embarqué dans le contenu.

<Breadcrumb items={["Docs", "Composants", "Breadcrumb"]} />

\`\`\`mdx
<Breadcrumb items={["Docs", "Composants", "Breadcrumb"]} />
<Breadcrumb items={[{ label: "Docs", href: "/" }, "Composants"]} />
\`\`\`

## Diff

Affiche un diff avant/après avec highlighting vert/rouge.

<Diff
  before="const greeting = 'Bonjour'"
  after="const greeting = 'Bonjour le monde !'"
  language="js"
/>

\`\`\`mdx
<Diff
  before="const message = 'Bonjour monde'"
  after="const message = 'Bonjour l\\'univers !'"
  language="js"
/>
\`\`\`

## Stepper

Un stepper interactif de type checklist.

<Stepper>
  <StepperStep title="Cloner le dépôt">
    Lancez \`git clone https://github.com/votre-org/votre-projet.git\`.
  </StepperStep>
  <StepperStep title="Installer les dépendances">
    Naviguez dans le dossier du projet et lancez \`npm install\`.
  </StepperStep>
  <StepperStep title="Démarrer le serveur de développement">
    Lancez \`npm run dev\` et ouvrez \`http://localhost:5173\`.
  </StepperStep>
</Stepper>

\`\`\`mdx
<Stepper>
  <StepperStep title="Cloner le dépôt">
    Lancez \`git clone ...\`
  </StepperStep>
</Stepper>
\`\`\`

## LinkButton

Un lien stylisé en bouton. Trois variantes et trois tailles.

<div className="flex flex-wrap gap-3 my-4">
  <LinkButton href="/fr/getting-started">Commencer</LinkButton>
  <LinkButton href="/fr/getting-started" variant="outline">Lire la doc</LinkButton>
  <LinkButton href="/fr/getting-started" variant="ghost">En savoir plus</LinkButton>
</div>

Les liens externes reçoivent automatiquement une icône \`↗\` et s'ouvrent dans un nouvel onglet :

<LinkButton href="https://github.com/armanceau/monkey-doc">Voir sur GitHub</LinkButton>

\`\`\`mdx
<LinkButton href="/installation">Commencer</LinkButton>
<LinkButton href="/guide" variant="outline" size="sm">Lire la suite</LinkButton>
<LinkButton href="https://github.com" variant="ghost">GitHub ↗</LinkButton>
\`\`\`

Props : \`href\` · \`variant\` (\`default\` / \`outline\` / \`ghost\`) · \`size\` (\`sm\` / \`md\` / \`lg\`) · \`external\` (détecté automatiquement)

## Graphiques

Trois types de graphiques propulsés par Chart.js. Tous s'adaptent automatiquement au dark mode.

### BarChart

<BarChart
  labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"]}
  datasets={[
    { label: "Pages vues", data: [4200, 5800, 4900, 7100, 6300, 8400] },
    { label: "Visiteurs uniques", data: [2100, 3200, 2700, 4100, 3500, 4900] }
  ]}
  title="Trafic mensuel"
/>

\`\`\`mdx
<BarChart
  labels={["Jan", "Fév", "Mar"]}
  datasets={[{ label: "Vues", data: [4200, 5800, 4900] }]}
  title="Trafic mensuel"
/>
\`\`\`

### DonutChart

<DonutChart
  labels={["Vercel", "Netlify", "GitHub Pages", "Cloudflare"]}
  data={[48, 27, 15, 10]}
  title="Répartition des plateformes de déploiement"
/>

\`\`\`mdx
<DonutChart
  labels={["Vercel", "Netlify", "GitHub Pages"]}
  data={[48, 27, 25]}
  title="Plateformes de déploiement"
/>
\`\`\`

### RadarChart

<RadarChart
  labels={["Performance", "SEO", "Accessibilité", "Bonnes pratiques", "PWA"]}
  datasets={[
    { label: "v1.0", data: [72, 85, 78, 80, 55] },
    { label: "v2.0", data: [95, 92, 97, 91, 78] }
  ]}
  title="Scores Lighthouse"
/>

\`\`\`mdx
<RadarChart
  labels={["Performance", "SEO", "Accessibilité"]}
  datasets={[
    { label: "v1", data: [72, 85, 78] },
    { label: "v2", data: [95, 92, 97] }
  ]}
  title="Scores"
/>
\`\`\`
`;

export const FR_BEST_PRACTICES = `---
title: Bonnes pratiques
order: 5
---

# Bonnes pratiques

Conseils pour écrire une excellente documentation avec Monkey-Doc.

## Structurez vos docs comme une histoire

Une bonne documentation se lit naturellement. Chaque page doit répondre à une seule question clairement.

<Callout type="info">
  Considérez chaque guide comme un court article — une idée, un fil directeur, des exemples concrets.
</Callout>

## Utilisez le bon composant

| Besoin | Composant |
|--------|-----------|
| Note importante | \`<Callout>\` |
| Processus séquentiel | \`<Steps>\` |
| Plusieurs options | \`<Tabs>\` |
| Mise en avant | \`<Card>\` |
| Exemple de code | bloc de code délimité |

## Structure des dossiers

Organisez les docs avec des dossiers pour les sections :

\`\`\`
docs/
  fr/
    getting-started.mdx
    installation.mdx
    guides/
      writing-docs.mdx
    reference/
      api.mdx
\`\`\`

Les dossiers apparaissent comme des sections repliables dans la barre latérale.

## Le frontmatter est important

Définissez toujours \`title\` et \`order\` dans le frontmatter — ils contrôlent ce que les utilisateurs voient dans la navigation.
`;

// ─── Deploy ───────────────────────────────────────────────────────────────────

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
  The \`.nojekyll\` file in the build output tells GitHub Pages not to process the files with Jekyll.
</Callout>

---

## Cloudflare Pages

<Steps>
  <Step title="Connect your repository">
    Go to [Cloudflare Pages](https://pages.cloudflare.com) and connect your GitHub or GitLab repository.
  </Step>
  <Step title="Set build configuration">
    | Setting | Value |
    |---|---|
    | Build command | \`npx monkey-doc build\` |
    | Build output directory | \`docs-dist\` |
  </Step>
  <Step title="Deploy">
    Cloudflare Pages builds and deploys automatically on every push.
  </Step>
</Steps>

---

## Automate with GitHub Actions

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
    Vercel détecte automatiquement le site statique. Vos docs sont en ligne sur une URL \`*.vercel.app\`.
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
  Le fichier \`.nojekyll\` indique à GitHub Pages de ne pas traiter les fichiers avec Jekyll.
</Callout>

---

## Cloudflare Pages

<Steps>
  <Step title="Connecter votre dépôt">
    Allez sur [Cloudflare Pages](https://pages.cloudflare.com) et connectez votre dépôt GitHub ou GitLab.
  </Step>
  <Step title="Configurer le build">
    | Paramètre | Valeur |
    |---|---|
    | Commande de build | \`npx monkey-doc build\` |
    | Dossier de sortie | \`docs-dist\` |
  </Step>
  <Step title="Déployer">
    Cloudflare Pages build et déploie automatiquement à chaque push.
  </Step>
</Steps>

---

## Automatiser avec GitHub Actions

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

// ─── Config ───────────────────────────────────────────────────────────────────

export const CONFIG_FILE = `import { defineConfig } from 'monkey-doc';

export default defineConfig({
  title: 'My Documentation',
  description: 'Built with Monkey-Doc',
  // github: 'https://github.com/your-org/your-repo',
  // logo: '/logo.svg',
  // docsDir: 'docs',
});
`;

// Legacy aliases kept for backward compatibility
export const GETTING_STARTED  = EN_GETTING_STARTED;
export const INSTALLATION      = EN_INSTALLATION;
export const WRITING_GUIDES    = EN_WRITING_GUIDES;
export const COMPONENTS        = EN_COMPONENTS;
export const BEST_PRACTICES    = EN_BEST_PRACTICES;
