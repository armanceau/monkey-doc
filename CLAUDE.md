# 🐒 Monkey-Doc — Claude Code Prompt

---

## 🧠 Vision produit

Tu construis **Monkey-Doc**, un outil développeur qui est une alternative à Storybook.

**Monkey-Doc, c'est :**

- Un outil installable en CLI
- Un serveur de documentation local
- Focalisé sur l'écriture de guides et de documentation produit
- Moins technique que Storybook
- Plus narratif et orienté UX, à la manière de GitBook / Notion

**Idée centrale :**

> 👉 Storybook = documentation de composants UI
> 👉 Monkey-Doc = guides produit + storytelling documentaire

---

## ⚙️ Stack technique

- Node.js (CLI)
- TypeScript
- Vite (serveur de développement)
- React
- TailwindCSS
- MDX (contenu de documentation)

---

## 📦 Exigences CLI

Crée un CLI appelé `monkey-doc` avec les commandes suivantes :

### 1. `init`

```bash
npx monkey-doc init
```

**Comportement :**

- Crée un dossier `/docs` dans le projet
- Génère des fichiers MDX d'exemple :
  - `getting-started.mdx`
  - `installation.mdx`
  - `components.mdx`
  - `best-practices.mdx`
- Crée un fichier de configuration : `monkey-doc.config.ts`

### 2. `dev`

```bash
npx monkey-doc dev
```

**Comportement :**

- Démarre un serveur de développement local
- Ouvre : `http://localhost:5173`
- Surveille le dossier `/docs` pour les changements
- Rechargement à chaud du contenu MDX

---

## 📁 Système de documentation

- Chaque fichier `.mdx` = une page
- Supporte les dossiers imbriqués
- Génère automatiquement la sidebar de navigation depuis la structure de fichiers
- Supporte une table des matières basée sur les titres

---

## 🧱 Layout UI

Crée une interface de documentation propre :

**Structure du layout :**

- Sidebar gauche → arbre de navigation
- Contenu principal → rendu MDX
- Sidebar droite → table des matières

**Fonctionnalités UX :**

- Mise en évidence de la section active
- Défilement fluide
- Design responsive

---

## 🧩 Système de composants MDX

Fournis des composants réutilisables intégrés, utilisables dans les MDX :

**Composants à implémenter :**

- `<Callout type="info | warning | success" />`
- `<Tabs />`
- `<Card />`
- `<CodeBlock />`
- `<Steps />`

**Exigences :**

- Entièrement stylisés avec Tailwind
- Faciles à étendre
- Fonctionnent de façon transparente dans MDX

---

## 🎨 Directives de design

**Style :** Minimaliste et moderne

**Inspiré par :** Notion, Linear, documentation Vercel

**Règles UI :**

- Ombres douces
- Coins arrondis
- Bonne hiérarchie typographique
- Beaucoup d'espacement
- Layout épuré (sans encombrement)

---

## ⚡ Expérience développeur (important)

- Configuration zéro
- Fonctionne immédiatement après `init`
- Démarrage rapide via Vite
- Hot reload sur les changements MDX
- Structure de projet simple

---

## 🧪 Documentation d'exemple

Génère des docs de démarrage :

1. Getting Started
2. Installation
3. Writing Guides
4. Components
5. Best Practices

---

## 🏗️ Architecture

Organise le code en packages :

```
packages/
  cli/        → Logique CLI (commandes init, dev)
  core/       → Parsing MDX, gestion du système de fichiers
  web/        → UI React (app Vite)
```

---

## 🚀 Fonctionnalités bonus (si le temps le permet)

- Recherche (côté client, simple fuzzy search)
- Bascule dark mode
- Navigation par fil d'Ariane (breadcrumb)
- Copier dans le presse-papiers pour les blocs de code

---

## 🧱 Attentes de sortie

- MVP entièrement fonctionnel
- Code modulaire et propre
- Architecture simple mais scalable
- Focus sur l'expérience développeur

---

## ⚠️ Contraintes importantes

- Ne **pas** sur-ingéniérer
- Focus sur le MVP en premier
- Prioriser l'utilisabilité sur les fonctionnalités
- Garder le code lisible et extensible

---

## 🏁 Exécution étape par étape

Commence par :

1. Créer la structure CLI (`monkey-doc`)
2. Implémenter la commande `init`
3. Implémenter la commande `dev`
4. Construire l'UI Vite + React
5. Ajouter le rendu MDX
6. Ajouter la navigation sidebar
7. Ajouter le système de composants de base
