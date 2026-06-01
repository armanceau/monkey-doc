declare module 'virtual:docs-manifest' {
  import type { NavNode } from './types';

  export const nav: NavNode[];
  export const docs: Record<string, { title: string; path: string }>;
  export const docImporters: Record<string, () => Promise<import('./types').DocModule>>;
  export const config: { title: string; description?: string; github?: string; languages: string[]; defaultLanguage?: string };
}
