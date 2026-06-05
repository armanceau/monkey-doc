import * as fs from 'node:fs';
import * as path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { compile } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';
import matter from 'gray-matter';
import { scanDocs, buildNavTree } from '@monkey-doc/core';
import type { Heading } from '@monkey-doc/core';

const MANIFEST_ID = 'virtual:docs-manifest';
const MANIFEST_RESOLVED = '\0virtual:docs-manifest';
const DOC_PREFIX = 'virtual:doc/';
const DOC_RESOLVED_PREFIX = '\0virtual:doc/';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function remarkExtractHeadings(headings: Heading[]) {
  return () => (tree: unknown) => {
    visit(tree as Parameters<typeof visit>[0], 'heading', (node: Record<string, unknown>) => {
      const children = (node.children as Array<{ type: string; value?: string }>) || [];
      const text = children
        .filter((c) => c.type === 'text' || c.type === 'inlineCode')
        .map((c) => c.value || '')
        .join('');
      headings.push({ level: node.depth as number, text, id: slugify(text) });
    });
  };
}

// Appends a .heading-anchor <a> link inside each heading that has an id (added by rehype-slug).
function rehypeHeadingLinks() {
  return (tree: unknown) => {
    visit(tree as Parameters<typeof visit>[0], 'element', (node: Record<string, unknown>) => {
      const tag = node.tagName as string;
      if (!/^h[1-6]$/.test(tag)) return;
      const props = (node.properties ?? {}) as Record<string, unknown>;
      const id = props.id as string | undefined;
      if (!id) return;
      (node.children as unknown[]).push({
        type: 'element',
        tagName: 'a',
        properties: { href: `#${id}`, 'aria-hidden': 'true', tabIndex: -1, className: ['heading-anchor'] },
        children: [{ type: 'text', value: '#' }],
      });
    });
  };
}

function cleanText(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/^\s*[-*+>|]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 400);
}

interface DocSection {
  heading: string;
  anchor: string;
  text: string;
}

function extractSections(raw: string): DocSection[] {
  const withoutFm = raw.replace(/^---[\s\S]*?---\n?/, '');
  const parts = withoutFm.split(/^(#{1,6}\s+.+)$/m);
  const sections: DocSection[] = [];
  for (let i = 1; i < parts.length - 1; i += 2) {
    const headingLine = parts[i];
    const body = parts[i + 1] ?? '';
    const headingMatch = headingLine.match(/^#{1,6}\s+(.+)$/);
    if (!headingMatch) continue;
    const heading = headingMatch[1].trim();
    const text = cleanText(body);
    if (text) sections.push({ heading, anchor: slugify(heading), text });
  }
  return sections;
}

// Extracts a string value for a given key from a TypeScript config file.
// Handles single quotes, double quotes, and template literal backticks.
function extractStr(raw: string, key: string): string | undefined {
  const re = new RegExp(
    key + "\\s*:\\s*(?:'([^'\\n]*)'|\"([^\"\\n]*)\"|\\x60([^\\x60\\n]*)\\x60)"
  );
  const m = raw.match(re);
  if (!m) return undefined;
  return m[1] ?? m[2] ?? m[3];
}

interface LoadedConfig {
  title: string;
  description?: string;
  github?: string;
  defaultLanguage?: string;
  logo?: string;
  docsDir?: string;
}

function loadConfig(projectPath: string): LoadedConfig {
  const configPath = path.join(projectPath, 'monkey-doc.config.ts');
  if (!fs.existsSync(configPath)) return { title: 'Documentation' };
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return {
      title:           extractStr(raw, 'title')           ?? 'Documentation',
      description:     extractStr(raw, 'description'),
      github:          extractStr(raw, 'github'),
      defaultLanguage: extractStr(raw, 'defaultLanguage'),
      logo:            extractStr(raw, 'logo'),
      docsDir:         extractStr(raw, 'docsDir'),
    };
  } catch {
    return { title: 'Documentation' };
  }
}

const LOCALE_CODES = new Set(['en', 'fr', 'de', 'es', 'pt', 'ja', 'zh', 'ko', 'it', 'ru', 'nl', 'pl', 'tr', 'vi', 'ar']);

function detectLanguages(docsDir: string): string[] {
  if (!fs.existsSync(docsDir)) return [];
  try {
    return fs.readdirSync(docsDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && LOCALE_CODES.has(e.name))
      .map(e => e.name);
  } catch { return []; }
}

export function monkeyDocPlugin(projectPath: string): Plugin {
  // Load config at startup so we know the correct docsDir for file watching.
  const initialConfig = loadConfig(projectPath);
  const docsDir = path.join(projectPath, initialConfig.docsDir ?? 'docs');

  return {
    name: 'monkey-doc',

    configureServer(server: ViteDevServer) {
      const configPath = path.join(projectPath, 'monkey-doc.config.ts');
      server.watcher.add(docsDir);
      if (fs.existsSync(configPath)) server.watcher.add(configPath);

      const normalizedDocsDir = path.normalize(docsDir);

      function invalidateManifest() {
        const mod = server.moduleGraph.getModuleById(MANIFEST_RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      }

      function invalidateDoc(file: string) {
        const files = scanDocs(docsDir);
        const docFile = files.find((f) => path.normalize(f.filePath) === path.normalize(file));
        if (docFile) {
          const mod = server.moduleGraph.getModuleById(DOC_RESOLVED_PREFIX + docFile.slug);
          if (mod) server.moduleGraph.invalidateModule(mod);
        }
      }

      server.watcher.on('add', (file) => {
        if (path.normalize(file).startsWith(normalizedDocsDir) && file.endsWith('.mdx')) {
          invalidateManifest();
        }
      });

      server.watcher.on('addDir', (dir) => {
        if (path.normalize(dir).startsWith(normalizedDocsDir)) {
          invalidateManifest();
        }
      });

      server.watcher.on('unlink', (file) => {
        if (path.normalize(file).startsWith(normalizedDocsDir) && file.endsWith('.mdx')) {
          invalidateManifest();
        }
      });

      server.watcher.on('unlinkDir', (dir) => {
        if (path.normalize(dir).startsWith(normalizedDocsDir)) {
          invalidateManifest();
        }
      });

      server.watcher.on('change', (file) => {
        const normalized = path.normalize(file);
        if (normalized.startsWith(normalizedDocsDir) && file.endsWith('.mdx')) {
          invalidateDoc(file);
          invalidateManifest();
        } else if (normalized === path.normalize(path.join(projectPath, 'monkey-doc.config.ts'))) {
          invalidateManifest();
        }
      });
    },

    resolveId(id: string) {
      if (id === MANIFEST_ID) return MANIFEST_RESOLVED;
      if (id.startsWith(DOC_PREFIX)) return DOC_RESOLVED_PREFIX + id.slice(DOC_PREFIX.length);
    },

    async load(id: string) {
      if (id === MANIFEST_RESOLVED) {
        const files = scanDocs(docsDir);
        const nav = buildNavTree(files);
        // Re-read config on every manifest load to pick up hot config changes.
        const config = loadConfig(projectPath);
        const languages = detectLanguages(docsDir);

        const importers = files
          .map((f) => `  ${JSON.stringify(f.slug)}: () => import(${JSON.stringify(DOC_PREFIX + f.slug)})`)
          .join(',\n');

        const docsMap = files
          .map((f) => {
            const raw = (() => { try { return fs.readFileSync(f.filePath, 'utf-8'); } catch { return ''; } })();
            const sections = extractSections(raw);
            const editPath = path.relative(projectPath, f.filePath).replace(/\\/g, '/');
            return `  ${JSON.stringify(f.slug)}: { title: ${JSON.stringify(f.title)}, path: ${JSON.stringify(f.path)}, order: ${f.order}, editPath: ${JSON.stringify(editPath)}, sections: ${JSON.stringify(sections)} }`;
          })
          .join(',\n');

        return [
          `export const nav = ${JSON.stringify(nav)};`,
          `export const docs = {\n${docsMap}\n};`,
          `export const docImporters = {\n${importers}\n};`,
          `export const config = ${JSON.stringify({ ...config, languages })};`,
        ].join('\n');
      }

      if (id.startsWith(DOC_RESOLVED_PREFIX)) {
        const slug = id.slice(DOC_RESOLVED_PREFIX.length);
        const files = scanDocs(docsDir);
        const file = files.find((f) => f.slug === slug);
        if (!file) {
          return `export default function NotFound() { return null; }
export const frontmatter = {};
export const headings = [];`;
        }

        const raw = fs.readFileSync(file.filePath, 'utf-8');
        const { data: frontmatter } = matter(raw);

        const headings: Heading[] = [];

        const compiled = await compile(raw, {
          remarkPlugins: [remarkFrontmatter, remarkGfm, remarkExtractHeadings(headings)],
          rehypePlugins: [rehypeSlug, rehypeHeadingLinks],
          providerImportSource: '@mdx-js/react',
        });

        return (
          String(compiled) +
          `\nexport const frontmatter = ${JSON.stringify(frontmatter)};` +
          `\nexport const headings = ${JSON.stringify(headings)};`
        );
      }
    },
  };
}
