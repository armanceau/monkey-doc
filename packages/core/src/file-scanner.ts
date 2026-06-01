import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type { DocFile, NavNode } from './types';

function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDocMeta(filePath: string): { title: string; order: number } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    const title = data.title || (() => {
      const match = content.match(/^#\s+(.+)$/m);
      return match ? match[1] : null;
    })();
    return {
      title: title || toTitleCase(path.basename(filePath, path.extname(filePath))),
      order: typeof data.order === 'number' ? data.order : 999,
    };
  } catch {
    return {
      title: toTitleCase(path.basename(filePath, path.extname(filePath))),
      order: 999,
    };
  }
}

export function scanDocs(docsDir: string): DocFile[] {
  if (!fs.existsSync(docsDir)) return [];

  const files: DocFile[] = [];

  function walk(dir: string, prefix: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (/\.(mdx|md)$/.test(entry.name)) {
        const baseName = entry.name.replace(/\.(mdx|md)$/, '');
        const slug = prefix ? `${prefix}/${baseName}` : baseName;
        const meta = getDocMeta(fullPath);
        files.push({
          title: meta.title,
          slug,
          path: `/${slug}`,
          filePath: fullPath,
          order: meta.order,
        });
      }
    }
  }

  walk(docsDir, '');
  files.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  return files;
}

export function buildNavTree(files: DocFile[]): NavNode[] {
  const root: NavNode[] = [];

  for (const file of files) {
    const parts = file.slug.split('/');
    let current = root;

    for (let i = 0; i < parts.length - 1; i++) {
      const folderSlug = parts[i];
      let node = current.find((n) => n.isFolder && n.slug === folderSlug);
      if (!node) {
        node = {
          title: toTitleCase(folderSlug),
          path: null,
          slug: folderSlug,
          children: [],
          isFolder: true,
          order: 999,
        };
        current.push(node);
      }
      current = node.children;
    }

    current.push({
      title: file.title,
      path: file.path,
      slug: file.slug,
      children: [],
      isFolder: false,
      order: file.order,
    });
  }

  return root;
}
