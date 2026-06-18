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
const DOC_VERSIONED_PREFIX = 'virtual:doc-versioned/';
const DOC_VERSIONED_RESOLVED_PREFIX = '\0virtual:doc-versioned/';

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

interface VersionConfigRaw {
  label: string;
  value: string;
  path: string;
  tag?: string;
}

function extractVersions(raw: string): VersionConfigRaw[] {
  const m = raw.match(/versions\s*:\s*\[([\s\S]*?)\]/);
  if (!m) return [];
  const arrayBody = m[1];
  const versions: VersionConfigRaw[] = [];
  const objRe = /\{([^}]+)\}/g;
  let objMatch;
  while ((objMatch = objRe.exec(arrayBody)) !== null) {
    const block = objMatch[1];
    const label = extractStr(block, 'label');
    const value = extractStr(block, 'value');
    const vPath = extractStr(block, 'path');
    const tag = extractStr(block, 'tag');
    if (label && value && vPath) {
      versions.push({ label, value, path: vPath, ...(tag ? { tag } : {}) });
    }
  }
  return versions;
}

interface LandingPageRaw {
  title?: string;
  description?: string;
  features?: Array<{ title: string; body: string }>;
}

interface LoadedConfig {
  title: string;
  description?: string;
  github?: string;
  defaultLanguage?: string;
  logo?: string;
  docsDir?: string;
  versions?: VersionConfigRaw[];
  defaultVersion?: string;
  landingPage?: false | LandingPageRaw;
}

function extractLandingPage(raw: string): false | LandingPageRaw | undefined {
  if (/landingPage\s*:\s*false/.test(raw)) return false;

  const m = raw.match(/landingPage\s*:\s*\{/);
  if (!m || m.index === undefined) return undefined;

  const openPos = m.index + m[0].length - 1;
  let depth = 0;
  let closePos = -1;
  for (let i = openPos; i < raw.length; i++) {
    if (raw[i] === '{') depth++;
    else if (raw[i] === '}') { depth--; if (depth === 0) { closePos = i; break; } }
  }
  if (closePos === -1) return undefined;

  const block = raw.slice(openPos, closePos + 1);
  const title = extractStr(block, 'title');
  const description = extractStr(block, 'description');

  let features: Array<{ title: string; body: string }> | undefined;
  const featMatch = block.match(/features\s*:\s*\[/);
  if (featMatch && featMatch.index !== undefined) {
    const featOpen = block.indexOf('[', featMatch.index + featMatch[0].length - 1);
    let fDepth = 0;
    let featClose = -1;
    for (let i = featOpen; i < block.length; i++) {
      if (block[i] === '[') fDepth++;
      else if (block[i] === ']') { fDepth--; if (fDepth === 0) { featClose = i; break; } }
    }
    if (featClose !== -1) {
      const arrayBody = block.slice(featOpen + 1, featClose);
      const objs: Array<{ title: string; body: string }> = [];
      const objRe = /\{([^}]+)\}/g;
      let objMatch;
      while ((objMatch = objRe.exec(arrayBody)) !== null) {
        const t = extractStr(objMatch[1], 'title');
        const b = extractStr(objMatch[1], 'body');
        if (t && b) objs.push({ title: t, body: b });
      }
      if (objs.length > 0) features = objs;
    }
  }

  if (!title && !description && !features) return undefined;
  return { ...(title ? { title } : {}), ...(description ? { description } : {}), ...(features ? { features } : {}) };
}

function loadConfig(projectPath: string): LoadedConfig {
  const configPath = path.join(projectPath, 'monkey-doc.config.ts');
  if (!fs.existsSync(configPath)) return { title: 'Documentation' };
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    const versions = extractVersions(raw);
    const landingPage = extractLandingPage(raw);
    return {
      title:           extractStr(raw, 'title')           ?? 'Documentation',
      description:     extractStr(raw, 'description'),
      github:          extractStr(raw, 'github'),
      defaultLanguage: extractStr(raw, 'defaultLanguage'),
      logo:            extractStr(raw, 'logo'),
      docsDir:         extractStr(raw, 'docsDir'),
      defaultVersion:  extractStr(raw, 'defaultVersion'),
      ...(versions.length > 0 ? { versions } : {}),
      ...(landingPage !== undefined ? { landingPage } : {}),
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

async function compileMdx(filePath: string): Promise<string> {
  const raw = fs.readFileSync(filePath, 'utf-8');
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

const NOT_FOUND_MODULE = `export default function NotFound() { return null; }
export const frontmatter = {};
export const headings = [];`;

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

      // Watch version dirs if configured
      for (const v of initialConfig.versions ?? []) {
        const vDir = path.resolve(projectPath, v.path);
        if (fs.existsSync(vDir)) server.watcher.add(vDir);
      }

      const normalizedDocsDir = path.normalize(docsDir);
      const normalizedVersionDirs = (initialConfig.versions ?? []).map(v =>
        path.normalize(path.resolve(projectPath, v.path))
      );

      function isTrackedMdx(file: string): boolean {
        const n = path.normalize(file);
        if (n.startsWith(normalizedDocsDir)) return true;
        return normalizedVersionDirs.some(vd => n.startsWith(vd));
      }

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
        if (isTrackedMdx(file) && file.endsWith('.mdx')) invalidateManifest();
      });

      server.watcher.on('addDir', (dir) => {
        const n = path.normalize(dir);
        if (n.startsWith(normalizedDocsDir) || normalizedVersionDirs.some(vd => n.startsWith(vd))) {
          invalidateManifest();
        }
      });

      server.watcher.on('unlink', (file) => {
        if (isTrackedMdx(file) && file.endsWith('.mdx')) invalidateManifest();
      });

      server.watcher.on('unlinkDir', (dir) => {
        const n = path.normalize(dir);
        if (n.startsWith(normalizedDocsDir) || normalizedVersionDirs.some(vd => n.startsWith(vd))) {
          invalidateManifest();
        }
      });

      server.watcher.on('change', (file) => {
        const normalized = path.normalize(file);
        if (isTrackedMdx(file) && file.endsWith('.mdx')) {
          invalidateDoc(file);
          invalidateManifest();
        } else if (normalized === path.normalize(path.join(projectPath, 'monkey-doc.config.ts'))) {
          invalidateManifest();
        }
      });
    },

    resolveId(id: string) {
      if (id === MANIFEST_ID) return MANIFEST_RESOLVED;
      if (id.startsWith(DOC_VERSIONED_PREFIX)) return DOC_VERSIONED_RESOLVED_PREFIX + id.slice(DOC_VERSIONED_PREFIX.length);
      if (id.startsWith(DOC_PREFIX)) return DOC_RESOLVED_PREFIX + id.slice(DOC_PREFIX.length);
    },

    async load(id: string) {
      // ── Manifest ──────────────────────────────────────────────────────────
      if (id === MANIFEST_RESOLVED) {
        const config = loadConfig(projectPath);
        const languages = detectLanguages(docsDir);
        const hasVersions = (config.versions?.length ?? 0) > 0;

        if (hasVersions) {
          const defaultVer = config.defaultVersion ?? config.versions![0].value;
          const defaultVerConfig = config.versions!.find(v => v.value === defaultVer) ?? config.versions![0];
          // Detect languages from the default version directory
          const languages = detectLanguages(path.resolve(projectPath, defaultVerConfig.path));

          // Per-version nav / docs / importers
          const versionedNavObj: Record<string, unknown> = {};
          const versionedDocsObj: Record<string, unknown> = {};
          // maps version value → { slug: virtualModuleId }
          const versionedImportersMap: Record<string, Record<string, string>> = {};

          for (const version of config.versions!) {
            const versionDocsDir = path.resolve(projectPath, version.path);
            const versionFiles = scanDocs(versionDocsDir);

            // Build nav with version-prefixed paths so NavLinks resolve correctly
            const filesForNav = versionFiles.map(f => ({
              ...f,
              path: `/${version.value}${f.path}`,
            }));
            versionedNavObj[version.value] = buildNavTree(filesForNav);

            // Build docs map (slug within version → metadata with version-prefixed path)
            const docsMap: Record<string, unknown> = {};
            for (const f of versionFiles) {
              const raw = (() => { try { return fs.readFileSync(f.filePath, 'utf-8'); } catch { return ''; } })();
              const sections = extractSections(raw);
              const editPath = path.relative(projectPath, f.filePath).replace(/\\/g, '/');
              docsMap[f.slug] = {
                title: f.title,
                path: `/${version.value}/${f.slug}`,
                order: f.order,
                editPath,
                sections,
              };
            }
            versionedDocsObj[version.value] = docsMap;

            // Build importers map
            const importerMap: Record<string, string> = {};
            for (const f of versionFiles) {
              importerMap[f.slug] = `${DOC_VERSIONED_PREFIX}${version.value}/${f.slug}`;
            }
            versionedImportersMap[version.value] = importerMap;
          }

          // Serialize versionedDocImporters as executable JS (not JSON — contains arrow functions)
          const versionedImportersCode = '{\n' + Object.entries(versionedImportersMap)
            .map(([versionValue, slugMap]) => {
              const importers = Object.entries(slugMap)
                .map(([slug, moduleId]) =>
                  `    ${JSON.stringify(slug)}: () => import(${JSON.stringify(moduleId)})`
                )
                .join(',\n');
              return `  ${JSON.stringify(versionValue)}: {\n${importers}\n  }`;
            })
            .join(',\n') + '\n}';

          return [
            `export const versions = ${JSON.stringify(config.versions)};`,
            `export const defaultVersion = ${JSON.stringify(defaultVer)};`,
            `export const versionedNav = ${JSON.stringify(versionedNavObj)};`,
            `export const versionedDocs = ${JSON.stringify(versionedDocsObj)};`,
            `export const versionedDocImporters = ${versionedImportersCode};`,
            // Compat stubs (not used in versioned mode)
            `export const nav = [];`,
            `export const docs = {};`,
            `export const docImporters = {};`,
            `export const config = ${JSON.stringify({ ...config, languages })};`,
          ].join('\n');
        }

        // ── Non-versioned (existing behaviour) ────────────────────────────
        const files = scanDocs(docsDir);
        const nav = buildNavTree(files);

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
          `export const versions = [];`,
          `export const defaultVersion = undefined;`,
          `export const versionedNav = {};`,
          `export const versionedDocs = {};`,
          `export const versionedDocImporters = {};`,
          `export const nav = ${JSON.stringify(nav)};`,
          `export const docs = {\n${docsMap}\n};`,
          `export const docImporters = {\n${importers}\n};`,
          `export const config = ${JSON.stringify({ ...config, languages })};`,
        ].join('\n');
      }

      // ── Versioned doc module ───────────────────────────────────────────
      if (id.startsWith(DOC_VERSIONED_RESOLVED_PREFIX)) {
        const rest = id.slice(DOC_VERSIONED_RESOLVED_PREFIX.length);
        const slashIdx = rest.indexOf('/');
        if (slashIdx === -1) return NOT_FOUND_MODULE;

        const versionValue = rest.slice(0, slashIdx);
        const docSlug = rest.slice(slashIdx + 1);

        const cfg = loadConfig(projectPath);
        const versionConfig = cfg.versions?.find(v => v.value === versionValue);
        if (!versionConfig) return NOT_FOUND_MODULE;

        const versionDocsDir = path.resolve(projectPath, versionConfig.path);
        const files = scanDocs(versionDocsDir);
        const file = files.find(f => f.slug === docSlug);
        if (!file) return NOT_FOUND_MODULE;

        return compileMdx(file.filePath);
      }

      // ── Non-versioned doc module (existing behaviour) ──────────────────
      if (id.startsWith(DOC_RESOLVED_PREFIX)) {
        const slug = id.slice(DOC_RESOLVED_PREFIX.length);
        const files = scanDocs(docsDir);
        const file = files.find((f) => f.slug === slug);
        if (!file) return NOT_FOUND_MODULE;

        return compileMdx(file.filePath);
      }
    },
  };
}
