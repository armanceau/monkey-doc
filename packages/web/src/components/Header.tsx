import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchDialog } from './SearchDialog';
import type { NavNode } from '../types';

interface HeaderProps {
  onToggleDark: () => void;
  isDark: boolean;
  nav: NavNode[];
  docsList: Array<{ slug: string; title: string; path: string }>;
}

function findBreadcrumb(nodes: NavNode[], pathname: string): NavNode[] {
  for (const node of nodes) {
    if (!node.isFolder && node.path === pathname) return [node];
    if (node.isFolder) {
      const sub = findBreadcrumb(node.children, pathname);
      if (sub.length > 0) return [node, ...sub];
    }
  }
  return [];
}

export function Header({ onToggleDark, isDark, nav, docsList }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const breadcrumb = findBreadcrumb(nav, pathname);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground min-w-0">
          {breadcrumb.map((node, i) => (
            <React.Fragment key={node.slug}>
              {i > 0 && <span className="text-border select-none">/</span>}
              <span
                className={
                  i === breadcrumb.length - 1
                    ? 'truncate font-medium text-foreground'
                    : 'truncate'
                }
              >
                {node.title}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-3.5" />
            <span>Search…</span>
            <kbd className="ml-1 font-mono text-[11px]">⌘K</kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="size-[14px] sm:hidden" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full border-border"
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="size-[14px]" /> : <Moon className="size-[14px]" />}
          </Button>
        </div>
      </header>

      <SearchDialog
        docsList={docsList}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </>
  );
}
