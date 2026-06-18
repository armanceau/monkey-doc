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

export interface VersionConfig {
  label: string;
  value: string;
  path: string;
  tag?: string;
}

export interface LandingPageConfig {
  title?: string;
  description?: string;
  features?: Array<{ title: string; body: string }>;
}

export interface MonkeyDocConfig {
  title: string;
  description?: string;
  docsDir?: string;
  logo?: string;
  github?: string;
  defaultLanguage?: string;
  versions?: VersionConfig[];
  defaultVersion?: string;
  landingPage?: false | LandingPageConfig;
}
