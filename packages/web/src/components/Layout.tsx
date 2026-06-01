import React from 'react';
import { AppSidebar } from './Sidebar';
import { Header } from './Header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import type { NavNode } from '../types';

interface LayoutProps {
  nav: NavNode[];
  title: string;
  children: React.ReactNode;
  onToggleDark: () => void;
  isDark: boolean;
}

export function Layout({ nav, title, children, onToggleDark, isDark }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar nav={nav} title={title} />
      <SidebarInset>
        <Header onToggleDark={onToggleDark} isDark={isDark} />
        <div className="xl:pr-[220px]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
