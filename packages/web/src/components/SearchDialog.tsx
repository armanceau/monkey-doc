import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, FileText, Hash } from 'lucide-react';

interface DocSection {
  heading: string;
  anchor: string;
  text: string;
}

interface Doc {
  slug: string;
  title: string;
  path: string;
  sections: DocSection[];
}

interface SearchDialogProps {
  docsList: Doc[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  doc: Doc;
  anchor: string | null;
  sectionHeading: string | null;
  snippet: string | null;
  titleMatch: boolean;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#fef08a] dark:bg-[#713f12] text-[#171717] dark:text-[#fde68a] rounded-[2px] px-0.5 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function getSnippet(text: string, query: string, radius = 55): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, radius * 2) + (text.length > radius * 2 ? '…' : '');
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + query.length + radius);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

function search(docs: Doc[], query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const doc of docs) {
    const titleMatch = doc.title.toLowerCase().includes(q);

    // Find best matching section
    let bestSection: DocSection | null = null;
    for (const section of doc.sections) {
      if (section.heading.toLowerCase().includes(q) || section.text.toLowerCase().includes(q)) {
        bestSection = section;
        break;
      }
    }

    if (titleMatch && !bestSection) {
      // Title match, no specific section — link to top of page
      results.push({ doc, anchor: null, sectionHeading: null, snippet: null, titleMatch: true });
    } else if (bestSection) {
      const snippet = getSnippet(bestSection.text, q);
      results.push({
        doc,
        anchor: bestSection.anchor,
        sectionHeading: bestSection.heading,
        snippet,
        titleMatch,
      });
      // If title also matches and the section is not the first one, add a separate top-of-page result
      if (titleMatch && doc.sections[0]?.anchor !== bestSection.anchor) {
        results.unshift({ doc, anchor: null, sectionHeading: null, snippet: null, titleMatch: true });
      }
    }
  }

  // Title matches first
  results.sort((a, b) => {
    if (a.titleMatch && !b.titleMatch) return -1;
    if (!a.titleMatch && b.titleMatch) return 1;
    return 0;
  });

  return results;
}

export function SearchDialog({ docsList, open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const results = search(docsList, query);

  useEffect(() => { setActiveIndex(0); }, [query]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  function goTo(path: string, anchor: string | null) {
    const target = anchor ? `${path}#${anchor}` : path;
    window.history.pushState(null, '', target);
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    onOpenChange(false);
    // Let React Router render first, then scroll
    if (anchor) {
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      const r = results[activeIndex];
      goTo(r.doc.path, r.anchor);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          onKeyDown={handleKeyDown}
          className="fixed left-1/2 top-[18vh] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        >
          <Dialog.Title className="sr-only">Search documentation</Dialog.Title>

          <div className="flex items-center border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation…"
              className="flex-1 bg-transparent px-3 py-4 text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex items-center rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              Esc
            </kbd>
          </div>

          <div className="max-h-[420px] overflow-y-auto py-1.5">
            {query.trim() && results.length === 0 ? (
              <p className="px-4 py-10 text-center text-[13px] text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : query.trim() ? (
              results.map((r, i) => (
                <button
                  key={`${r.doc.slug}-${r.anchor ?? 'top'}`}
                  ref={activeIndex === i ? activeRef : undefined}
                  onClick={() => goTo(r.doc.path, r.anchor)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                    activeIndex === i
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent/50'
                  }`}
                >
                  {r.anchor ? (
                    <Hash className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium leading-snug">
                      {highlight(r.doc.title, query.trim())}
                      {r.sectionHeading && (
                        <span className="ml-1.5 text-muted-foreground font-normal">
                          › {highlight(r.sectionHeading, query.trim())}
                        </span>
                      )}
                    </p>
                    {r.snippet && (
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                        {highlight(r.snippet, query.trim())}
                      </p>
                    )}
                  </div>
                </button>
              ))
            ) : null}
          </div>

          <div className="flex items-center gap-4 border-t border-border px-4 py-2">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <kbd className="rounded border border-border px-1 py-0.5">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <kbd className="rounded border border-border px-1 py-0.5">↵</kbd>
              open
            </span>
            {query.trim() && results.length > 0 && (
              <span className="ml-auto font-mono text-[11px] text-muted-foreground/50">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
