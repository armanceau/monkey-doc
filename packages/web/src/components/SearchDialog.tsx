import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, FileText } from 'lucide-react';

interface SearchDialogProps {
  docsList: Array<{ slug: string; title: string; path: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function filter(docs: SearchDialogProps['docsList'], query: string) {
  if (!query.trim()) return docs;
  const q = query.toLowerCase();
  return docs.filter((d) => d.title.toLowerCase().includes(q));
}

export function SearchDialog({ docsList, open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = filter(docsList, query);

  useEffect(() => { setActiveIndex(0); }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  function goTo(path: string) {
    navigate(path);
    onOpenChange(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      goTo(results[activeIndex].path);
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

          <div className="max-h-[360px] overflow-y-auto py-1.5">
            {results.length === 0 ? (
              <p className="px-4 py-10 text-center text-[13px] text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              results.map((doc, i) => (
                <button
                  key={doc.slug}
                  onClick={() => goTo(doc.path)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    activeIndex === i
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent/50'
                  }`}
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-[13px] font-medium leading-snug">{doc.title}</span>
                </button>
              ))
            )}
          </div>

          {results.length > 0 && (
            <div className="flex items-center gap-4 border-t border-border px-4 py-2">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <kbd className="rounded border border-border px-1 py-0.5">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <kbd className="rounded border border-border px-1 py-0.5">↵</kbd>
                open
              </span>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
