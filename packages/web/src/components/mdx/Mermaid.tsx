import React, { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';

function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

export function Mermaid({ children }: { children: string }) {
  const rawId = useId();
  const id = 'mmd-' + rawId.replace(/:/g, '');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: isDarkMode() ? 'dark' : 'default',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 14,
        });
        const { svg: output } = await mermaid.render(id, children.trim());
        if (!cancelled) setSvg(output);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    }

    render();
    return () => { cancelled = true; };
  }, [children, id]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setSvg('');
      setError('');
      async function rerender() {
        try {
          mermaid.initialize({
            startOnLoad: false,
            theme: isDarkMode() ? 'dark' : 'default',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 14,
          });
          const { svg: output } = await mermaid.render(id + '-r', children.trim());
          setSvg(output);
        } catch (e) {
          setError(String(e));
        }
      }
      rerender();
    });
    observer.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [children, id]);

  if (error) {
    return (
      <div className="not-prose my-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-mono text-[12px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="not-prose my-5 flex h-20 items-center justify-center rounded-lg border border-border bg-muted/30 text-[13px] text-muted-foreground">
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className="not-prose my-5 overflow-x-auto rounded-lg border border-border bg-card p-6 [&_svg]:mx-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
