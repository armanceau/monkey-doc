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

export interface DocModule {
  default: React.ComponentType;
  frontmatter: Record<string, unknown>;
  headings: Heading[];
}
