import React, { useEffect, useState } from 'react';
import { docs as allDocs, docImporters, config } from 'virtual:docs-manifest';
import type { DocModule } from '../types';

interface PrintDoc {
  slug: string;
  title: string;
  order: number;
  mod: DocModule;
}

export function PrintPage() {
  const [printDocs, setPrintDocs] = useState<PrintDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.classList.remove('dark');

    const entries = Object.entries(allDocs)
      .map(([slug, d]) => ({ slug, ...d }))
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

    const total = entries.length;
    let loaded = 0;

    Promise.all(
      entries.map(async (entry) => {
        const importer = docImporters[entry.slug];
        if (!importer) return null;
        try {
          const mod = await importer();
          loaded++;
          setProgress(Math.round((loaded / total) * 100));
          return { slug: entry.slug, title: entry.title, order: entry.order, mod };
        } catch {
          loaded++;
          setProgress(Math.round((loaded / total) * 100));
          return null;
        }
      })
    ).then((results) => {
      setPrintDocs(results.filter(Boolean) as PrintDoc[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && printDocs.length > 0) {
      const t = setTimeout(() => window.print(), 600);
      return () => clearTimeout(t);
    }
  }, [loading, printDocs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-white text-neutral-900">
        <img src="/icon-monkey-doc.svg" alt="" className="size-12 opacity-60" />
        <div className="text-[15px] font-medium">Preparing PDF export…</div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-52 h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[12px] text-neutral-400 tabular-nums">{progress}%</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toolbar — hidden at print */}
      <div className="print-toolbar">
        <div className="flex items-center gap-2">
          <img src="/icon-monkey-doc.svg" alt="" className="size-5" />
          <span className="font-medium text-[13px]">{config.title || 'Documentation'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="print-btn-primary" onClick={() => window.print()}>
            Save as PDF
          </button>
          <button className="print-btn-ghost" onClick={() => window.close()}>
            Close
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="print-root">
        {/* Cover page */}
        <div className="print-cover">
          <img src="/icon-monkey-doc.svg" alt="" className="print-cover-logo" />
          <h1 className="print-cover-title">{config.title || 'Documentation'}</h1>
          {config.description && (
            <p className="print-cover-desc">{config.description}</p>
          )}
          <p className="print-cover-date">
            {new Date().toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Each doc page */}
        {printDocs.map((doc) => {
          const Component = doc.mod.default;
          return (
            <article key={doc.slug} className="print-doc">
              <div className="prose prose-DEFAULT max-w-none">
                <Component />
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
