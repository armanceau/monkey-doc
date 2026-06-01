export interface DocFile {
  title: string;
  slug: string;
  path: string;
  filePath: string;
  order: number;
}

export interface NavNode {
  title: string;
  path: string | null;
  slug: string;
  children: NavNode[];
  isFolder: boolean;
  order: number;
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface MonkeyDocConfig {
  title: string;
  description?: string;
  docsDir?: string;
}
