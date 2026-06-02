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

const LOCALE_CODES = new Set(['en', 'fr', 'de', 'es', 'pt', 'ja', 'zh', 'ko', 'it', 'ru', 'nl', 'pl', 'tr', 'vi', 'ar']);

function detectLanguages(docsDir: string): string[] {
  if (!fs.existsSync(docsDir)) return [];
  try {
    return fs.readdirSync(docsDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && LOCALE_CODES.has(e.name))
      .map(e => e.name);
  } catch { return []; }
}

async function loadConfig(projectPath: string): Promise<{ title: string; description?: string; github?: string; defaultLanguage?: string }> {
  const configPath = path.join(projectPath, 'monkey-doc.config.ts');
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      const titleMatch = raw.match(/title:\s*['"`]([^'"`\n]+)['"`]/);
      const descMatch = raw.match(/description:\s*['"`]([^'"`\n]+)['"`]/);
      const githubMatch = raw.match(/github:\s*['"`]([^'"`\n]+)['"`]/);
      const defaultLangMatch = raw.match(/defaultLanguage:\s*['"`]([^'"`\n]+)['"`]/);
      return {
        title: titleMatch?.[1] ?? 'Documentation',
        description: descMatch?.[1],
        github: githubMatch?.[1],
        defaultLanguage: defaultLangMatch?.[1],
      };
    } catch {
      // fall through
    }
  }
  return { title: 'Documentation' };
}

export function monkeyDocPlugin(projectPath: string): Plugin {
  const docsDir = path.join(projectPath, 'docs');

  return {
    name: 'monkey-doc',

    configureServer(server: ViteDevServer) {
      const configPath = path.join(projectPath, 'monkey-doc.config.ts');
      // Watch the docs directory itself (chokidar watches it recursively)
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

      // New .mdx file or folder → rebuild manifest
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

      // Deleted .mdx file or folder → rebuild manifest
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

      // Content change → invalidate the specific doc + manifest (title/headings may differ)
      server.watcher.on('change', (file) => {
        const normalized = path.normalize(file);
        if (normalized.startsWith(normalizedDocsDir) && file.endsWith('.mdx')) {
          invalidateDoc(file);
          invalidateManifest();
        } else if (normalized === path.normalize(configPath)) {
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
        const config = await loadConfig(projectPath);
        const languages = detectLanguages(docsDir);

        const importers = files
          .map((f) => `  ${JSON.stringify(f.slug)}: () => import(${JSON.stringify(DOC_PREFIX + f.slug)})`)
          .join(',\n');

        const docsMap = files
          .map((f) => `  ${JSON.stringify(f.slug)}: { title: ${JSON.stringify(f.title)}, path: ${JSON.stringify(f.path)}, order: ${f.order} }`)
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
          rehypePlugins: [rehypeSlug],
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
