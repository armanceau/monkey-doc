import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchDialog } from "./SearchDialog";
import type { NavNode } from "../types";

interface HeaderProps {
  onToggleDark: () => void;
  isDark: boolean;
  nav: NavNode[];
  docsList: Array<{ slug: string; title: string; path: string }>;
  lang: string | null;
  languages: string[];
  github?: string;
  onSwitchLang: (code: string) => void;
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

export function Header({
  onToggleDark,
  isDark,
  nav,
  docsList,
  lang,
  languages,
  github,
  onSwitchLang,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const breadcrumb = findBreadcrumb(nav, pathname);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function switchLang(newLang: string) {
    onSwitchLang(newLang);
    const parts = pathname.split("/").filter(Boolean);
    if (lang && parts[0] === lang) {
      navigate("/" + [newLang, ...parts.slice(1)].join("/"));
    } else {
      navigate("/" + newLang);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground min-w-0">
          {breadcrumb.map((node, i) => (
            <React.Fragment key={node.slug}>
              {i > 0 && <span className="text-border select-none">/</span>}
              <span
                className={
                  i === breadcrumb.length - 1
                    ? "truncate font-medium text-foreground"
                    : "truncate"
                }
              >
                {node.title}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-3.5" />
            <span>Search…</span>
            <kbd className="ml-1 font-mono text-[11px]">⌘K</kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 sm:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="size-[14px]" />
          </Button>

          {/* Language switcher */}
          {languages.length > 1 && lang && (
            <Select value={lang} onValueChange={switchLang}>
              <SelectTrigger className="h-7 w-auto gap-1 border-border px-2 font-mono text-[11px] uppercase text-muted-foreground shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  {languages.map((l) => (
                    <SelectItem
                      key={l}
                      value={l}
                      className="font-mono text-[11px] uppercase"
                    >
                      {l.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {/* GitHub */}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center size-7 rounded-md text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-[15px]"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          )}

          {/* Dark mode */}
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full border-border"
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="size-[14px]" />
            ) : (
              <Moon className="size-[14px]" />
            )}
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
