// vite.config.ts
import { defineConfig } from "file:///C:/Users/arthu/repos/monkey-doc/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/arthu/repos/monkey-doc/node_modules/@vitejs/plugin-react/dist/index.js";

// src/plugins/monkey-doc-vite-plugin.ts
import * as fs2 from "node:fs";
import * as path2 from "node:path";
import { compile } from "file:///C:/Users/arthu/repos/monkey-doc/node_modules/@mdx-js/mdx/index.js";
import remarkFrontmatter from "file:///C:/Users/arthu/repos/monkey-doc/node_modules/remark-frontmatter/index.js";
import rehypeSlug from "file:///C:/Users/arthu/repos/monkey-doc/node_modules/rehype-slug/index.js";
import { visit } from "file:///C:/Users/arthu/repos/monkey-doc/node_modules/unist-util-visit/index.js";
import matter2 from "file:///C:/Users/arthu/repos/monkey-doc/node_modules/gray-matter/index.js";

// ../core/src/file-scanner.ts
import * as fs from "fs";
import * as path from "path";
import matter from "file:///C:/Users/arthu/repos/monkey-doc/node_modules/gray-matter/index.js";
function toTitleCase(str) {
  return str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function getDocMeta(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    const title = data.title || (() => {
      const match = content.match(/^#\s+(.+)$/m);
      return match ? match[1] : null;
    })();
    return {
      title: title || toTitleCase(path.basename(filePath, path.extname(filePath))),
      order: typeof data.order === "number" ? data.order : 999
    };
  } catch {
    return {
      title: toTitleCase(path.basename(filePath, path.extname(filePath))),
      order: 999
    };
  }
}
function scanDocs(docsDir) {
  if (!fs.existsSync(docsDir)) return [];
  const files = [];
  function walk(dir, prefix) {
    let entries;
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
        const baseName = entry.name.replace(/\.(mdx|md)$/, "");
        const slug = prefix ? `${prefix}/${baseName}` : baseName;
        const meta = getDocMeta(fullPath);
        files.push({
          title: meta.title,
          slug,
          path: `/${slug}`,
          filePath: fullPath,
          order: meta.order
        });
      }
    }
  }
  walk(docsDir, "");
  files.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  return files;
}
function buildNavTree(files) {
  const root = [];
  for (const file of files) {
    const parts = file.slug.split("/");
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
          isFolder: true
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
      isFolder: false
    });
  }
  return root;
}

// src/plugins/monkey-doc-vite-plugin.ts
var MANIFEST_ID = "virtual:docs-manifest";
var MANIFEST_RESOLVED = "\0virtual:docs-manifest";
var DOC_PREFIX = "virtual:doc/";
var DOC_RESOLVED_PREFIX = "\0virtual:doc/";
function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
}
function remarkExtractHeadings(headings) {
  return () => (tree) => {
    visit(tree, "heading", (node) => {
      const children = node.children || [];
      const text = children.filter((c) => c.type === "text" || c.type === "inlineCode").map((c) => c.value || "").join("");
      headings.push({ level: node.depth, text, id: slugify(text) });
    });
  };
}
async function loadConfig(projectPath2) {
  const configPath = path2.join(projectPath2, "monkey-doc.config.ts");
  if (fs2.existsSync(configPath)) {
    try {
      const raw = fs2.readFileSync(configPath, "utf-8");
      const titleMatch = raw.match(/title:\s*['"](.+?)['"]/);
      const descMatch = raw.match(/description:\s*['"](.+?)['"]/);
      return {
        title: titleMatch?.[1] ?? "Documentation",
        description: descMatch?.[1]
      };
    } catch {
    }
  }
  return { title: "Documentation" };
}
function monkeyDocPlugin(projectPath2) {
  const docsDir = path2.join(projectPath2, "docs");
  return {
    name: "monkey-doc",
    configureServer(server) {
      server.watcher.add(path2.join(docsDir, "**"));
      server.watcher.on("all", (_event, file) => {
        if (!file.startsWith(docsDir)) return;
        const mod = server.moduleGraph.getModuleById(MANIFEST_RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      });
    },
    resolveId(id) {
      if (id === MANIFEST_ID) return MANIFEST_RESOLVED;
      if (id.startsWith(DOC_PREFIX)) return DOC_RESOLVED_PREFIX + id.slice(DOC_PREFIX.length);
    },
    async load(id) {
      if (id === MANIFEST_RESOLVED) {
        const files = scanDocs(docsDir);
        const nav = buildNavTree(files);
        const config = await loadConfig(projectPath2);
        const importers = files.map((f) => `  ${JSON.stringify(f.slug)}: () => import(${JSON.stringify(DOC_PREFIX + f.slug)})`).join(",\n");
        const docsMap = files.map((f) => `  ${JSON.stringify(f.slug)}: { title: ${JSON.stringify(f.title)}, path: ${JSON.stringify(f.path)} }`).join(",\n");
        return [
          `export const nav = ${JSON.stringify(nav)};`,
          `export const docs = {
${docsMap}
};`,
          `export const docImporters = {
${importers}
};`,
          `export const config = ${JSON.stringify(config)};`
        ].join("\n");
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
        const raw = fs2.readFileSync(file.filePath, "utf-8");
        const { data: frontmatter } = matter2(raw);
        const headings = [];
        const compiled = await compile(raw, {
          remarkPlugins: [remarkFrontmatter, remarkExtractHeadings(headings)],
          rehypePlugins: [rehypeSlug],
          providerImportSource: "@mdx-js/react"
        });
        return String(compiled) + `
export const frontmatter = ${JSON.stringify(frontmatter)};
export const headings = ${JSON.stringify(headings)};`;
      }
    }
  };
}

// vite.config.ts
import path3 from "node:path";
var __vite_injected_original_dirname = "C:\\Users\\arthu\\repos\\monkey-doc\\packages\\web";
var projectPath = process.env.MONKEY_DOC_PATH ?? process.cwd();
var vite_config_default = defineConfig({
  plugins: [
    react(),
    monkeyDocPlugin(projectPath)
  ],
  server: {
    fs: {
      allow: [projectPath, path3.resolve(__vite_injected_original_dirname)]
    }
  },
  optimizeDeps: {
    exclude: ["@mdx-js/react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL3BsdWdpbnMvbW9ua2V5LWRvYy12aXRlLXBsdWdpbi50cyIsICIuLi9jb3JlL3NyYy9maWxlLXNjYW5uZXIudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcnRodVxcXFxyZXBvc1xcXFxtb25rZXktZG9jXFxcXHBhY2thZ2VzXFxcXHdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYXJ0aHVcXFxccmVwb3NcXFxcbW9ua2V5LWRvY1xcXFxwYWNrYWdlc1xcXFx3ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FydGh1L3JlcG9zL21vbmtleS1kb2MvcGFja2FnZXMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgbW9ua2V5RG9jUGx1Z2luIH0gZnJvbSAnLi9zcmMvcGx1Z2lucy9tb25rZXktZG9jLXZpdGUtcGx1Z2luJztcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5cbmNvbnN0IHByb2plY3RQYXRoID0gcHJvY2Vzcy5lbnYuTU9OS0VZX0RPQ19QQVRIID8/IHByb2Nlc3MuY3dkKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vbmtleURvY1BsdWdpbihwcm9qZWN0UGF0aCksXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIGZzOiB7XG4gICAgICBhbGxvdzogW3Byb2plY3RQYXRoLCBwYXRoLnJlc29sdmUoX19kaXJuYW1lKV0sXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydAbWR4LWpzL3JlYWN0J10sXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYXJ0aHVcXFxccmVwb3NcXFxcbW9ua2V5LWRvY1xcXFxwYWNrYWdlc1xcXFx3ZWJcXFxcc3JjXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFydGh1XFxcXHJlcG9zXFxcXG1vbmtleS1kb2NcXFxccGFja2FnZXNcXFxcd2ViXFxcXHNyY1xcXFxwbHVnaW5zXFxcXG1vbmtleS1kb2Mtdml0ZS1wbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FydGh1L3JlcG9zL21vbmtleS1kb2MvcGFja2FnZXMvd2ViL3NyYy9wbHVnaW5zL21vbmtleS1kb2Mtdml0ZS1wbHVnaW4udHNcIjtpbXBvcnQgKiBhcyBmcyBmcm9tICdub2RlOmZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB0eXBlIHsgUGx1Z2luLCBWaXRlRGV2U2VydmVyIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBjb21waWxlIH0gZnJvbSAnQG1keC1qcy9tZHgnO1xuaW1wb3J0IHJlbWFya0Zyb250bWF0dGVyIGZyb20gJ3JlbWFyay1mcm9udG1hdHRlcic7XG5pbXBvcnQgcmVoeXBlU2x1ZyBmcm9tICdyZWh5cGUtc2x1Zyc7XG5pbXBvcnQgeyB2aXNpdCB9IGZyb20gJ3VuaXN0LXV0aWwtdmlzaXQnO1xuaW1wb3J0IG1hdHRlciBmcm9tICdncmF5LW1hdHRlcic7XG5pbXBvcnQgeyBzY2FuRG9jcywgYnVpbGROYXZUcmVlIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9zcmMvZmlsZS1zY2FubmVyJztcbmltcG9ydCB0eXBlIHsgSGVhZGluZyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvc3JjL3R5cGVzJztcblxuY29uc3QgTUFOSUZFU1RfSUQgPSAndmlydHVhbDpkb2NzLW1hbmlmZXN0JztcbmNvbnN0IE1BTklGRVNUX1JFU09MVkVEID0gJ1xcMHZpcnR1YWw6ZG9jcy1tYW5pZmVzdCc7XG5jb25zdCBET0NfUFJFRklYID0gJ3ZpcnR1YWw6ZG9jLyc7XG5jb25zdCBET0NfUkVTT0xWRURfUFJFRklYID0gJ1xcMHZpcnR1YWw6ZG9jLyc7XG5cbmZ1bmN0aW9uIHNsdWdpZnkodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHRleHRcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC5yZXBsYWNlKC9bXlxcd1xccy1dL2csICcnKVxuICAgIC5yZXBsYWNlKC9bXFxzX10rL2csICctJylcbiAgICAucmVwbGFjZSgvXi0rfC0rJC9nLCAnJyk7XG59XG5cbmZ1bmN0aW9uIHJlbWFya0V4dHJhY3RIZWFkaW5ncyhoZWFkaW5nczogSGVhZGluZ1tdKSB7XG4gIHJldHVybiAoKSA9PiAodHJlZTogdW5rbm93bikgPT4ge1xuICAgIHZpc2l0KHRyZWUgYXMgUGFyYW1ldGVyczx0eXBlb2YgdmlzaXQ+WzBdLCAnaGVhZGluZycsIChub2RlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSAobm9kZS5jaGlsZHJlbiBhcyBBcnJheTx7IHR5cGU6IHN0cmluZzsgdmFsdWU/OiBzdHJpbmcgfT4pIHx8IFtdO1xuICAgICAgY29uc3QgdGV4dCA9IGNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKGMpID0+IGMudHlwZSA9PT0gJ3RleHQnIHx8IGMudHlwZSA9PT0gJ2lubGluZUNvZGUnKVxuICAgICAgICAubWFwKChjKSA9PiBjLnZhbHVlIHx8ICcnKVxuICAgICAgICAuam9pbignJyk7XG4gICAgICBoZWFkaW5ncy5wdXNoKHsgbGV2ZWw6IG5vZGUuZGVwdGggYXMgbnVtYmVyLCB0ZXh0LCBpZDogc2x1Z2lmeSh0ZXh0KSB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZENvbmZpZyhwcm9qZWN0UGF0aDogc3RyaW5nKTogUHJvbWlzZTx7IHRpdGxlOiBzdHJpbmc7IGRlc2NyaXB0aW9uPzogc3RyaW5nIH0+IHtcbiAgY29uc3QgY29uZmlnUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgJ21vbmtleS1kb2MuY29uZmlnLnRzJyk7XG4gIGlmIChmcy5leGlzdHNTeW5jKGNvbmZpZ1BhdGgpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IGZzLnJlYWRGaWxlU3luYyhjb25maWdQYXRoLCAndXRmLTgnKTtcbiAgICAgIGNvbnN0IHRpdGxlTWF0Y2ggPSByYXcubWF0Y2goL3RpdGxlOlxccypbJ1wiXSguKz8pWydcIl0vKTtcbiAgICAgIGNvbnN0IGRlc2NNYXRjaCA9IHJhdy5tYXRjaCgvZGVzY3JpcHRpb246XFxzKlsnXCJdKC4rPylbJ1wiXS8pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGU6IHRpdGxlTWF0Y2g/LlsxXSA/PyAnRG9jdW1lbnRhdGlvbicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjTWF0Y2g/LlsxXSxcbiAgICAgIH07XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgdGl0bGU6ICdEb2N1bWVudGF0aW9uJyB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW9ua2V5RG9jUGx1Z2luKHByb2plY3RQYXRoOiBzdHJpbmcpOiBQbHVnaW4ge1xuICBjb25zdCBkb2NzRGlyID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCAnZG9jcycpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ21vbmtleS1kb2MnLFxuXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogVml0ZURldlNlcnZlcikge1xuICAgICAgc2VydmVyLndhdGNoZXIuYWRkKHBhdGguam9pbihkb2NzRGlyLCAnKionKSk7XG4gICAgICBzZXJ2ZXIud2F0Y2hlci5vbignYWxsJywgKF9ldmVudCwgZmlsZSkgPT4ge1xuICAgICAgICBpZiAoIWZpbGUuc3RhcnRzV2l0aChkb2NzRGlyKSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBtb2QgPSBzZXJ2ZXIubW9kdWxlR3JhcGguZ2V0TW9kdWxlQnlJZChNQU5JRkVTVF9SRVNPTFZFRCk7XG4gICAgICAgIGlmIChtb2QpIHNlcnZlci5tb2R1bGVHcmFwaC5pbnZhbGlkYXRlTW9kdWxlKG1vZCk7XG4gICAgICAgIHNlcnZlci53cy5zZW5kKHsgdHlwZTogJ2Z1bGwtcmVsb2FkJyB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZXNvbHZlSWQoaWQ6IHN0cmluZykge1xuICAgICAgaWYgKGlkID09PSBNQU5JRkVTVF9JRCkgcmV0dXJuIE1BTklGRVNUX1JFU09MVkVEO1xuICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoRE9DX1BSRUZJWCkpIHJldHVybiBET0NfUkVTT0xWRURfUFJFRklYICsgaWQuc2xpY2UoRE9DX1BSRUZJWC5sZW5ndGgpO1xuICAgIH0sXG5cbiAgICBhc3luYyBsb2FkKGlkOiBzdHJpbmcpIHtcbiAgICAgIGlmIChpZCA9PT0gTUFOSUZFU1RfUkVTT0xWRUQpIHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBzY2FuRG9jcyhkb2NzRGlyKTtcbiAgICAgICAgY29uc3QgbmF2ID0gYnVpbGROYXZUcmVlKGZpbGVzKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gYXdhaXQgbG9hZENvbmZpZyhwcm9qZWN0UGF0aCk7XG5cbiAgICAgICAgY29uc3QgaW1wb3J0ZXJzID0gZmlsZXNcbiAgICAgICAgICAubWFwKChmKSA9PiBgICAke0pTT04uc3RyaW5naWZ5KGYuc2x1Zyl9OiAoKSA9PiBpbXBvcnQoJHtKU09OLnN0cmluZ2lmeShET0NfUFJFRklYICsgZi5zbHVnKX0pYClcbiAgICAgICAgICAuam9pbignLFxcbicpO1xuXG4gICAgICAgIGNvbnN0IGRvY3NNYXAgPSBmaWxlc1xuICAgICAgICAgIC5tYXAoKGYpID0+IGAgICR7SlNPTi5zdHJpbmdpZnkoZi5zbHVnKX06IHsgdGl0bGU6ICR7SlNPTi5zdHJpbmdpZnkoZi50aXRsZSl9LCBwYXRoOiAke0pTT04uc3RyaW5naWZ5KGYucGF0aCl9IH1gKVxuICAgICAgICAgIC5qb2luKCcsXFxuJyk7XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBgZXhwb3J0IGNvbnN0IG5hdiA9ICR7SlNPTi5zdHJpbmdpZnkobmF2KX07YCxcbiAgICAgICAgICBgZXhwb3J0IGNvbnN0IGRvY3MgPSB7XFxuJHtkb2NzTWFwfVxcbn07YCxcbiAgICAgICAgICBgZXhwb3J0IGNvbnN0IGRvY0ltcG9ydGVycyA9IHtcXG4ke2ltcG9ydGVyc31cXG59O2AsXG4gICAgICAgICAgYGV4cG9ydCBjb25zdCBjb25maWcgPSAke0pTT04uc3RyaW5naWZ5KGNvbmZpZyl9O2AsXG4gICAgICAgIF0uam9pbignXFxuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpZC5zdGFydHNXaXRoKERPQ19SRVNPTFZFRF9QUkVGSVgpKSB7XG4gICAgICAgIGNvbnN0IHNsdWcgPSBpZC5zbGljZShET0NfUkVTT0xWRURfUFJFRklYLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gc2NhbkRvY3MoZG9jc0Rpcik7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBmaWxlcy5maW5kKChmKSA9PiBmLnNsdWcgPT09IHNsdWcpO1xuICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICByZXR1cm4gYGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5vdEZvdW5kKCkgeyByZXR1cm4gbnVsbDsgfVxuZXhwb3J0IGNvbnN0IGZyb250bWF0dGVyID0ge307XG5leHBvcnQgY29uc3QgaGVhZGluZ3MgPSBbXTtgO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmF3ID0gZnMucmVhZEZpbGVTeW5jKGZpbGUuZmlsZVBhdGgsICd1dGYtOCcpO1xuICAgICAgICBjb25zdCB7IGRhdGE6IGZyb250bWF0dGVyIH0gPSBtYXR0ZXIocmF3KTtcblxuICAgICAgICBjb25zdCBoZWFkaW5nczogSGVhZGluZ1tdID0gW107XG5cbiAgICAgICAgY29uc3QgY29tcGlsZWQgPSBhd2FpdCBjb21waWxlKHJhdywge1xuICAgICAgICAgIHJlbWFya1BsdWdpbnM6IFtyZW1hcmtGcm9udG1hdHRlciwgcmVtYXJrRXh0cmFjdEhlYWRpbmdzKGhlYWRpbmdzKV0sXG4gICAgICAgICAgcmVoeXBlUGx1Z2luczogW3JlaHlwZVNsdWddLFxuICAgICAgICAgIHByb3ZpZGVySW1wb3J0U291cmNlOiAnQG1keC1qcy9yZWFjdCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgU3RyaW5nKGNvbXBpbGVkKSArXG4gICAgICAgICAgYFxcbmV4cG9ydCBjb25zdCBmcm9udG1hdHRlciA9ICR7SlNPTi5zdHJpbmdpZnkoZnJvbnRtYXR0ZXIpfTtgICtcbiAgICAgICAgICBgXFxuZXhwb3J0IGNvbnN0IGhlYWRpbmdzID0gJHtKU09OLnN0cmluZ2lmeShoZWFkaW5ncyl9O2BcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcnRodVxcXFxyZXBvc1xcXFxtb25rZXktZG9jXFxcXHBhY2thZ2VzXFxcXGNvcmVcXFxcc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhcnRodVxcXFxyZXBvc1xcXFxtb25rZXktZG9jXFxcXHBhY2thZ2VzXFxcXGNvcmVcXFxcc3JjXFxcXGZpbGUtc2Nhbm5lci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYXJ0aHUvcmVwb3MvbW9ua2V5LWRvYy9wYWNrYWdlcy9jb3JlL3NyYy9maWxlLXNjYW5uZXIudHNcIjtpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG1hdHRlciBmcm9tICdncmF5LW1hdHRlcic7XG5pbXBvcnQgdHlwZSB7IERvY0ZpbGUsIE5hdk5vZGUgfSBmcm9tICcuL3R5cGVzJztcblxuZnVuY3Rpb24gdG9UaXRsZUNhc2Uoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyXG4gICAgLnJlcGxhY2UoL1stX10vZywgJyAnKVxuICAgIC5yZXBsYWNlKC9cXGJcXHcvZywgKGMpID0+IGMudG9VcHBlckNhc2UoKSk7XG59XG5cbmZ1bmN0aW9uIGdldERvY01ldGEoZmlsZVBhdGg6IHN0cmluZyk6IHsgdGl0bGU6IHN0cmluZzsgb3JkZXI6IG51bWJlciB9IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IG1hdHRlcihjb250ZW50KTtcbiAgICBjb25zdCB0aXRsZSA9IGRhdGEudGl0bGUgfHwgKCgpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoID0gY29udGVudC5tYXRjaCgvXiNcXHMrKC4rKSQvbSk7XG4gICAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6IG51bGw7XG4gICAgfSkoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6IHRpdGxlIHx8IHRvVGl0bGVDYXNlKHBhdGguYmFzZW5hbWUoZmlsZVBhdGgsIHBhdGguZXh0bmFtZShmaWxlUGF0aCkpKSxcbiAgICAgIG9yZGVyOiB0eXBlb2YgZGF0YS5vcmRlciA9PT0gJ251bWJlcicgPyBkYXRhLm9yZGVyIDogOTk5LFxuICAgIH07XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogdG9UaXRsZUNhc2UocGF0aC5iYXNlbmFtZShmaWxlUGF0aCwgcGF0aC5leHRuYW1lKGZpbGVQYXRoKSkpLFxuICAgICAgb3JkZXI6IDk5OSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FuRG9jcyhkb2NzRGlyOiBzdHJpbmcpOiBEb2NGaWxlW10ge1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoZG9jc0RpcikpIHJldHVybiBbXTtcblxuICBjb25zdCBmaWxlczogRG9jRmlsZVtdID0gW107XG5cbiAgZnVuY3Rpb24gd2FsayhkaXI6IHN0cmluZywgcHJlZml4OiBzdHJpbmcpIHtcbiAgICBsZXQgZW50cmllczogZnMuRGlyZW50W107XG4gICAgdHJ5IHtcbiAgICAgIGVudHJpZXMgPSBmcy5yZWFkZGlyU3luYyhkaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKGRpciwgZW50cnkubmFtZSk7XG4gICAgICBpZiAoZW50cnkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICB3YWxrKGZ1bGxQYXRoLCBwcmVmaXggPyBgJHtwcmVmaXh9LyR7ZW50cnkubmFtZX1gIDogZW50cnkubmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKC9cXC4obWR4fG1kKSQvLnRlc3QoZW50cnkubmFtZSkpIHtcbiAgICAgICAgY29uc3QgYmFzZU5hbWUgPSBlbnRyeS5uYW1lLnJlcGxhY2UoL1xcLihtZHh8bWQpJC8sICcnKTtcbiAgICAgICAgY29uc3Qgc2x1ZyA9IHByZWZpeCA/IGAke3ByZWZpeH0vJHtiYXNlTmFtZX1gIDogYmFzZU5hbWU7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBnZXREb2NNZXRhKGZ1bGxQYXRoKTtcbiAgICAgICAgZmlsZXMucHVzaCh7XG4gICAgICAgICAgdGl0bGU6IG1ldGEudGl0bGUsXG4gICAgICAgICAgc2x1ZyxcbiAgICAgICAgICBwYXRoOiBgLyR7c2x1Z31gLFxuICAgICAgICAgIGZpbGVQYXRoOiBmdWxsUGF0aCxcbiAgICAgICAgICBvcmRlcjogbWV0YS5vcmRlcixcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd2Fsayhkb2NzRGlyLCAnJyk7XG4gIGZpbGVzLnNvcnQoKGEsIGIpID0+IGEub3JkZXIgLSBiLm9yZGVyIHx8IGEuc2x1Zy5sb2NhbGVDb21wYXJlKGIuc2x1ZykpO1xuICByZXR1cm4gZmlsZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE5hdlRyZWUoZmlsZXM6IERvY0ZpbGVbXSk6IE5hdk5vZGVbXSB7XG4gIGNvbnN0IHJvb3Q6IE5hdk5vZGVbXSA9IFtdO1xuXG4gIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgIGNvbnN0IHBhcnRzID0gZmlsZS5zbHVnLnNwbGl0KCcvJyk7XG4gICAgbGV0IGN1cnJlbnQgPSByb290O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGNvbnN0IGZvbGRlclNsdWcgPSBwYXJ0c1tpXTtcbiAgICAgIGxldCBub2RlID0gY3VycmVudC5maW5kKChuKSA9PiBuLmlzRm9sZGVyICYmIG4uc2x1ZyA9PT0gZm9sZGVyU2x1Zyk7XG4gICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgbm9kZSA9IHtcbiAgICAgICAgICB0aXRsZTogdG9UaXRsZUNhc2UoZm9sZGVyU2x1ZyksXG4gICAgICAgICAgcGF0aDogbnVsbCxcbiAgICAgICAgICBzbHVnOiBmb2xkZXJTbHVnLFxuICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICBpc0ZvbGRlcjogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgY3VycmVudC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgICAgY3VycmVudCA9IG5vZGUuY2hpbGRyZW47XG4gICAgfVxuXG4gICAgY3VycmVudC5wdXNoKHtcbiAgICAgIHRpdGxlOiBmaWxlLnRpdGxlLFxuICAgICAgcGF0aDogZmlsZS5wYXRoLFxuICAgICAgc2x1ZzogZmlsZS5zbHVnLFxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgaXNGb2xkZXI6IGZhbHNlLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJvb3Q7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9VLFNBQVMsb0JBQW9CO0FBQ2pXLE9BQU8sV0FBVzs7O0FDRGdYLFlBQVlBLFNBQVE7QUFDdFosWUFBWUMsV0FBVTtBQUV0QixTQUFTLGVBQWU7QUFDeEIsT0FBTyx1QkFBdUI7QUFDOUIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxhQUFhO0FBQ3RCLE9BQU9DLGFBQVk7OztBQ1BvVSxZQUFZLFFBQVE7QUFDM1csWUFBWSxVQUFVO0FBQ3RCLE9BQU8sWUFBWTtBQUduQixTQUFTLFlBQVksS0FBcUI7QUFDeEMsU0FBTyxJQUNKLFFBQVEsU0FBUyxHQUFHLEVBQ3BCLFFBQVEsU0FBUyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7QUFDNUM7QUFFQSxTQUFTLFdBQVcsVUFBb0Q7QUFDdEUsTUFBSTtBQUNGLFVBQU0sVUFBYSxnQkFBYSxVQUFVLE9BQU87QUFDakQsVUFBTSxFQUFFLEtBQUssSUFBSSxPQUFPLE9BQU87QUFDL0IsVUFBTSxRQUFRLEtBQUssVUFBVSxNQUFNO0FBQ2pDLFlBQU0sUUFBUSxRQUFRLE1BQU0sYUFBYTtBQUN6QyxhQUFPLFFBQVEsTUFBTSxDQUFDLElBQUk7QUFBQSxJQUM1QixHQUFHO0FBQ0gsV0FBTztBQUFBLE1BQ0wsT0FBTyxTQUFTLFlBQWlCLGNBQVMsVUFBZSxhQUFRLFFBQVEsQ0FBQyxDQUFDO0FBQUEsTUFDM0UsT0FBTyxPQUFPLEtBQUssVUFBVSxXQUFXLEtBQUssUUFBUTtBQUFBLElBQ3ZEO0FBQUEsRUFDRixRQUFRO0FBQ04sV0FBTztBQUFBLE1BQ0wsT0FBTyxZQUFpQixjQUFTLFVBQWUsYUFBUSxRQUFRLENBQUMsQ0FBQztBQUFBLE1BQ2xFLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUNGO0FBRU8sU0FBUyxTQUFTLFNBQTRCO0FBQ25ELE1BQUksQ0FBSSxjQUFXLE9BQU8sRUFBRyxRQUFPLENBQUM7QUFFckMsUUFBTSxRQUFtQixDQUFDO0FBRTFCLFdBQVMsS0FBSyxLQUFhLFFBQWdCO0FBQ3pDLFFBQUk7QUFDSixRQUFJO0FBQ0YsZ0JBQWEsZUFBWSxLQUFLLEVBQUUsZUFBZSxLQUFLLENBQUM7QUFBQSxJQUN2RCxRQUFRO0FBQ047QUFBQSxJQUNGO0FBRUEsZUFBVyxTQUFTLFNBQVM7QUFDM0IsWUFBTSxXQUFnQixVQUFLLEtBQUssTUFBTSxJQUFJO0FBQzFDLFVBQUksTUFBTSxZQUFZLEdBQUc7QUFDdkIsYUFBSyxVQUFVLFNBQVMsR0FBRyxNQUFNLElBQUksTUFBTSxJQUFJLEtBQUssTUFBTSxJQUFJO0FBQUEsTUFDaEUsV0FBVyxjQUFjLEtBQUssTUFBTSxJQUFJLEdBQUc7QUFDekMsY0FBTSxXQUFXLE1BQU0sS0FBSyxRQUFRLGVBQWUsRUFBRTtBQUNyRCxjQUFNLE9BQU8sU0FBUyxHQUFHLE1BQU0sSUFBSSxRQUFRLEtBQUs7QUFDaEQsY0FBTSxPQUFPLFdBQVcsUUFBUTtBQUNoQyxjQUFNLEtBQUs7QUFBQSxVQUNULE9BQU8sS0FBSztBQUFBLFVBQ1o7QUFBQSxVQUNBLE1BQU0sSUFBSSxJQUFJO0FBQUEsVUFDZCxVQUFVO0FBQUEsVUFDVixPQUFPLEtBQUs7QUFBQSxRQUNkLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxPQUFLLFNBQVMsRUFBRTtBQUNoQixRQUFNLEtBQUssQ0FBQyxHQUFHLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssY0FBYyxFQUFFLElBQUksQ0FBQztBQUN0RSxTQUFPO0FBQ1Q7QUFFTyxTQUFTLGFBQWEsT0FBNkI7QUFDeEQsUUFBTSxPQUFrQixDQUFDO0FBRXpCLGFBQVcsUUFBUSxPQUFPO0FBQ3hCLFVBQU0sUUFBUSxLQUFLLEtBQUssTUFBTSxHQUFHO0FBQ2pDLFFBQUksVUFBVTtBQUVkLGFBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxTQUFTLEdBQUcsS0FBSztBQUN6QyxZQUFNLGFBQWEsTUFBTSxDQUFDO0FBQzFCLFVBQUksT0FBTyxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsVUFBVTtBQUNsRSxVQUFJLENBQUMsTUFBTTtBQUNULGVBQU87QUFBQSxVQUNMLE9BQU8sWUFBWSxVQUFVO0FBQUEsVUFDN0IsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ04sVUFBVSxDQUFDO0FBQUEsVUFDWCxVQUFVO0FBQUEsUUFDWjtBQUNBLGdCQUFRLEtBQUssSUFBSTtBQUFBLE1BQ25CO0FBQ0EsZ0JBQVUsS0FBSztBQUFBLElBQ2pCO0FBRUEsWUFBUSxLQUFLO0FBQUEsTUFDWCxPQUFPLEtBQUs7QUFBQSxNQUNaLE1BQU0sS0FBSztBQUFBLE1BQ1gsTUFBTSxLQUFLO0FBQUEsTUFDWCxVQUFVLENBQUM7QUFBQSxNQUNYLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxFQUNIO0FBRUEsU0FBTztBQUNUOzs7QUQxRkEsSUFBTSxjQUFjO0FBQ3BCLElBQU0sb0JBQW9CO0FBQzFCLElBQU0sYUFBYTtBQUNuQixJQUFNLHNCQUFzQjtBQUU1QixTQUFTLFFBQVEsTUFBc0I7QUFDckMsU0FBTyxLQUNKLFlBQVksRUFDWixRQUFRLGFBQWEsRUFBRSxFQUN2QixRQUFRLFdBQVcsR0FBRyxFQUN0QixRQUFRLFlBQVksRUFBRTtBQUMzQjtBQUVBLFNBQVMsc0JBQXNCLFVBQXFCO0FBQ2xELFNBQU8sTUFBTSxDQUFDLFNBQWtCO0FBQzlCLFVBQU0sTUFBcUMsV0FBVyxDQUFDLFNBQWtDO0FBQ3ZGLFlBQU0sV0FBWSxLQUFLLFlBQXdELENBQUM7QUFDaEYsWUFBTSxPQUFPLFNBQ1YsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLFVBQVUsRUFBRSxTQUFTLFlBQVksRUFDMUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFDeEIsS0FBSyxFQUFFO0FBQ1YsZUFBUyxLQUFLLEVBQUUsT0FBTyxLQUFLLE9BQWlCLE1BQU0sSUFBSSxRQUFRLElBQUksRUFBRSxDQUFDO0FBQUEsSUFDeEUsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQUVBLGVBQWUsV0FBV0MsY0FBdUU7QUFDL0YsUUFBTSxhQUFrQixXQUFLQSxjQUFhLHNCQUFzQjtBQUNoRSxNQUFPLGVBQVcsVUFBVSxHQUFHO0FBQzdCLFFBQUk7QUFDRixZQUFNLE1BQVMsaUJBQWEsWUFBWSxPQUFPO0FBQy9DLFlBQU0sYUFBYSxJQUFJLE1BQU0sd0JBQXdCO0FBQ3JELFlBQU0sWUFBWSxJQUFJLE1BQU0sOEJBQThCO0FBQzFELGFBQU87QUFBQSxRQUNMLE9BQU8sYUFBYSxDQUFDLEtBQUs7QUFBQSxRQUMxQixhQUFhLFlBQVksQ0FBQztBQUFBLE1BQzVCO0FBQUEsSUFDRixRQUFRO0FBQUEsSUFFUjtBQUFBLEVBQ0Y7QUFDQSxTQUFPLEVBQUUsT0FBTyxnQkFBZ0I7QUFDbEM7QUFFTyxTQUFTLGdCQUFnQkEsY0FBNkI7QUFDM0QsUUFBTSxVQUFlLFdBQUtBLGNBQWEsTUFBTTtBQUU3QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFFTixnQkFBZ0IsUUFBdUI7QUFDckMsYUFBTyxRQUFRLElBQVMsV0FBSyxTQUFTLElBQUksQ0FBQztBQUMzQyxhQUFPLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxTQUFTO0FBQ3pDLFlBQUksQ0FBQyxLQUFLLFdBQVcsT0FBTyxFQUFHO0FBQy9CLGNBQU0sTUFBTSxPQUFPLFlBQVksY0FBYyxpQkFBaUI7QUFDOUQsWUFBSSxJQUFLLFFBQU8sWUFBWSxpQkFBaUIsR0FBRztBQUNoRCxlQUFPLEdBQUcsS0FBSyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQUEsTUFDeEMsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUVBLFVBQVUsSUFBWTtBQUNwQixVQUFJLE9BQU8sWUFBYSxRQUFPO0FBQy9CLFVBQUksR0FBRyxXQUFXLFVBQVUsRUFBRyxRQUFPLHNCQUFzQixHQUFHLE1BQU0sV0FBVyxNQUFNO0FBQUEsSUFDeEY7QUFBQSxJQUVBLE1BQU0sS0FBSyxJQUFZO0FBQ3JCLFVBQUksT0FBTyxtQkFBbUI7QUFDNUIsY0FBTSxRQUFRLFNBQVMsT0FBTztBQUM5QixjQUFNLE1BQU0sYUFBYSxLQUFLO0FBQzlCLGNBQU0sU0FBUyxNQUFNLFdBQVdBLFlBQVc7QUFFM0MsY0FBTSxZQUFZLE1BQ2YsSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLFVBQVUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEtBQUssVUFBVSxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFDOUYsS0FBSyxLQUFLO0FBRWIsY0FBTSxVQUFVLE1BQ2IsSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLFVBQVUsRUFBRSxJQUFJLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFBRSxLQUFLLENBQUMsV0FBVyxLQUFLLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUNoSCxLQUFLLEtBQUs7QUFFYixlQUFPO0FBQUEsVUFDTCxzQkFBc0IsS0FBSyxVQUFVLEdBQUcsQ0FBQztBQUFBLFVBQ3pDO0FBQUEsRUFBMEIsT0FBTztBQUFBO0FBQUEsVUFDakM7QUFBQSxFQUFrQyxTQUFTO0FBQUE7QUFBQSxVQUMzQyx5QkFBeUIsS0FBSyxVQUFVLE1BQU0sQ0FBQztBQUFBLFFBQ2pELEVBQUUsS0FBSyxJQUFJO0FBQUEsTUFDYjtBQUVBLFVBQUksR0FBRyxXQUFXLG1CQUFtQixHQUFHO0FBQ3RDLGNBQU0sT0FBTyxHQUFHLE1BQU0sb0JBQW9CLE1BQU07QUFDaEQsY0FBTSxRQUFRLFNBQVMsT0FBTztBQUM5QixjQUFNLE9BQU8sTUFBTSxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsSUFBSTtBQUM5QyxZQUFJLENBQUMsTUFBTTtBQUNULGlCQUFPO0FBQUE7QUFBQTtBQUFBLFFBR1Q7QUFFQSxjQUFNLE1BQVMsaUJBQWEsS0FBSyxVQUFVLE9BQU87QUFDbEQsY0FBTSxFQUFFLE1BQU0sWUFBWSxJQUFJQyxRQUFPLEdBQUc7QUFFeEMsY0FBTSxXQUFzQixDQUFDO0FBRTdCLGNBQU0sV0FBVyxNQUFNLFFBQVEsS0FBSztBQUFBLFVBQ2xDLGVBQWUsQ0FBQyxtQkFBbUIsc0JBQXNCLFFBQVEsQ0FBQztBQUFBLFVBQ2xFLGVBQWUsQ0FBQyxVQUFVO0FBQUEsVUFDMUIsc0JBQXNCO0FBQUEsUUFDeEIsQ0FBQztBQUVELGVBQ0UsT0FBTyxRQUFRLElBQ2Y7QUFBQSw2QkFBZ0MsS0FBSyxVQUFVLFdBQVcsQ0FBQztBQUFBLDBCQUM5QixLQUFLLFVBQVUsUUFBUSxDQUFDO0FBQUEsTUFFekQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOzs7QUQ1SEEsT0FBT0MsV0FBVTtBQUhqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFNLGNBQWMsUUFBUSxJQUFJLG1CQUFtQixRQUFRLElBQUk7QUFFL0QsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sZ0JBQWdCLFdBQVc7QUFBQSxFQUM3QjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsT0FBTyxDQUFDLGFBQWFDLE1BQUssUUFBUSxnQ0FBUyxDQUFDO0FBQUEsSUFDOUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsZUFBZTtBQUFBLEVBQzNCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsiZnMiLCAicGF0aCIsICJtYXR0ZXIiLCAicHJvamVjdFBhdGgiLCAibWF0dGVyIiwgInBhdGgiLCAicGF0aCJdCn0K
