import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Heading } from '../types';

interface TocProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TocProps) {
  const [activeId, setActiveId] = useState<string>('');

  const filtered = headings.filter((h) => h.level === 2 || h.level === 3);

  useEffect(() => {
    if (filtered.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );
    filtered.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (filtered.length === 0) return null;

  return (
    <aside className="fixed top-0 right-0 hidden h-screen w-[220px] xl:flex flex-col border-l border-border bg-card">
      <ScrollArea className="flex-1 px-5 py-8">
        <p className="mb-2 font-mono text-[11px] font-[400] uppercase tracking-[0.06em] text-muted-foreground">
          On this page
        </p>
        <Separator className="mb-3" />
        <nav className="space-y-0.5">
          {filtered.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-[13px] tracking-body-sm leading-5 py-0.5 transition-colors ${
                h.level === 3 ? 'pl-3' : ''
              } ${
                activeId === h.id
                  ? 'text-[#0070f3] font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
