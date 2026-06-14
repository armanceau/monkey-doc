import React from 'react';
import { AppSidebar } from './Sidebar';
import { Header } from './Header';
import { ReadingProgress } from './ReadingProgress';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import type { NavNode } from '../types';

interface VersionConfig {
  label: string;
  value: string;
  path: string;
  tag?: string;
}

interface LayoutProps {
  nav: NavNode[];
  title: string;
  logo?: string;
  children: React.ReactNode;
  onToggleDark: () => void;
  isDark: boolean;
  docsList: Array<{ slug: string; title: string; path: string; sections: Array<{ heading: string; anchor: string; text: string }> }>;
  lang: string | null;
  languages: string[];
  github?: string;
  onSwitchLang: (code: string) => void;
  versions?: VersionConfig[];
  currentVersion?: string;
  versionedDocs?: Record<string, Record<string, { path: string }>>;
}

export function Layout({
  nav, title, logo, children, onToggleDark, isDark,
  docsList, lang, languages, github, onSwitchLang,
  versions, currentVersion, versionedDocs,
}: LayoutProps) {
  return (
    <SidebarProvider>
      <ReadingProgress />
      <AppSidebar
        nav={nav}
        title={title}
        logo={logo}
        versions={versions}
        currentVersion={currentVersion}
        versionedDocs={versionedDocs}
      />
      <SidebarInset>
        <Header
          onToggleDark={onToggleDark}
          isDark={isDark}
          nav={nav}
          docsList={docsList}
          lang={lang}
          languages={languages}
          github={github}
          onSwitchLang={onSwitchLang}
        />
        <div className="xl:pr-[220px]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
