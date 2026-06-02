import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CodeGroupContext } from './CodeBlock';

interface CodeGroupProps {
  labels: string[];
  children: React.ReactNode;
}

export function CodeGroup({ labels, children }: CodeGroupProps) {
  const [active, setActive] = useState(0);
  const panels = React.Children.toArray(children);

  return (
    <div className="not-prose my-5 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center border-b border-border bg-zinc-100 dark:bg-zinc-950 px-2">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            className={cn(
              'border-b-2 px-3 py-2.5 font-mono text-[12px] transition-colors',
              i === active
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <CodeGroupContext.Provider value={true}>
        {panels[active]}
      </CodeGroupContext.Provider>
    </div>
  );
}
