declare const __MONKEY_DOC_VERSION__: string;

declare module 'virtual:docs-manifest' {
  import type { NavNode } from './types';

  export const nav: NavNode[];
  export const docs: Record<string, { title: string; path: string; order: number; editPath: string; sections: Array<{ heading: string; anchor: string; text: string }> }>;
  export const docImporters: Record<string, () => Promise<import('./types').DocModule>>;
  export const config: { title: string; description?: string; github?: string; logo?: string; languages: string[]; defaultLanguage?: string };
}
