declare const __MONKEY_DOC_VERSION__: string;

declare module 'virtual:docs-manifest' {
  import type { NavNode } from './types';

  interface VersionConfig {
    label: string;
    value: string;
    path: string;
    tag?: string;
  }

  type DocEntry = {
    title: string;
    path: string;
    order: number;
    editPath: string;
    sections: Array<{ heading: string; anchor: string; text: string }>;
  };

  export const nav: NavNode[];
  export const docs: Record<string, DocEntry>;
  export const docImporters: Record<string, () => Promise<import('./types').DocModule>>;
  export const config: {
    title: string;
    description?: string;
    github?: string;
    logo?: string;
    languages: string[];
    defaultLanguage?: string;
  };

  // Versioning
  export const versions: VersionConfig[];
  export const defaultVersion: string | undefined;
  export const versionedNav: Record<string, NavNode[]>;
  export const versionedDocs: Record<string, Record<string, DocEntry>>;
  export const versionedDocImporters: Record<string, Record<string, () => Promise<import('./types').DocModule>>>;
}
