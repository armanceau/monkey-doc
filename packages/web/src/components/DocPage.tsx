import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TableOfContents } from './TableOfContents';
import type { DocModule } from '../types';

interface DocEntry {
  slug: string;
  title: string;
  path: string;
  editPath: string;
}

interface DocPageProps {
  docImporters: Record<string, () => Promise<DocModule>>;
  docsList: DocEntry[];
  lang?: string | null;
  github?: string;
}

function PageSkeleton() {
  return (
    <div className="px-10 py-14 max-w-3xl mx-auto flex flex-col gap-4">
      <Skeleton className="h-9 w-1/2" />
      <Skeleton className="h-5 w-5/6" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-4/5" />
    </div>
  );
}

function NotFound({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-4xl mb-5 select-none">📄</p>
      <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-foreground mb-2">
        Page not found.
      </h1>
      <p className="text-[14px] text-muted-foreground">
        No document at{' '}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded-sm">
          {slug}
        </code>
      </p>
    </div>
  );
}

export function DocPage({ docImporters, docsList, lang, github }: DocPageProps) {
  const { '*': slug = '' } = useParams();
  const [mod, setMod] = useState<DocModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const currentIndex = docsList.findIndex((d) => d.slug === slug);
  const prev = currentIndex > 0 ? docsList[currentIndex - 1] : null;
  const next = currentIndex < docsList.length - 1 ? docsList[currentIndex + 1] : null;
  const current = docsList[currentIndex];

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setMod(null);
    const importer = docImporters[slug];
    if (!importer) { setNotFound(true); setLoading(false); return; }
    importer().then((m) => { setMod(m); setLoading(false); })
              .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (loading) return <PageSkeleton />;
  if (notFound || !mod) return <NotFound slug={slug} />;

  const Component = mod.default;
  const editUrl = github && current?.editPath
    ? `${github}/edit/main/${current.editPath}`
    : null;

  return (
    <>
      <TableOfContents headings={mod.headings ?? []} lang={lang} />
      <article className="px-8 lg:px-12 py-12 max-w-3xl mx-auto">
        <div className="prose prose-DEFAULT dark:prose-dark max-w-none">
          <Component />
        </div>

        {editUrl && (
          <div className="mt-10 pt-6 border-t border-border">
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="size-3.5" />
              Edit this page on GitHub
            </a>
          </div>
        )}

        {(prev || next) && (
          <nav className="mt-10 flex items-stretch justify-between gap-4 border-t border-border pt-8">
            {prev ? (
              <Button
                variant="outline"
                className="flex h-auto flex-col items-start gap-1 px-4 py-3 max-w-[48%] shadow-sm"
                asChild
              >
                <Link to={prev.path}>
                  <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
                    <ChevronLeft className="h-3 w-3" /> Previous
                  </span>
                  <span className="text-[14px] font-medium tracking-[-0.02em] text-foreground leading-snug">
                    {prev.title}
                  </span>
                </Link>
              </Button>
            ) : <div />}

            {next ? (
              <Button
                variant="outline"
                className="flex h-auto flex-col items-end gap-1 px-4 py-3 max-w-[48%] shadow-sm ml-auto"
                asChild
              >
                <Link to={next.path}>
                  <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
                    Next <ChevronRight className="h-3 w-3" />
                  </span>
                  <span className="text-[14px] font-medium tracking-[-0.02em] text-foreground text-right leading-snug">
                    {next.title}
                  </span>
                </Link>
              </Button>
            ) : <div />}
          </nav>
        )}
      </article>
    </>
  );
}
