import React from 'react';
import { AppSidebar } from './Sidebar';
import { Header } from './Header';
import { ReadingProgress } from './ReadingProgress';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import type { NavNode } from '../types';

interface LayoutProps {
  nav: NavNode[];
  title: string;
  children: React.ReactNode;
  onToggleDark: () => void;
  isDark: boolean;
  docsList: Array<{ slug: string; title: string; path: string }>;
}

export function Layout({ nav, title, children, onToggleDark, isDark, docsList }: LayoutProps) {
  return (
    <SidebarProvider>
      <ReadingProgress />
      <AppSidebar nav={nav} title={title} />
      <SidebarInset>
        <Header
          onToggleDark={onToggleDark}
          isDark={isDark}
          nav={nav}
          docsList={docsList}
        />
        <div className="xl:pr-[220px]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
