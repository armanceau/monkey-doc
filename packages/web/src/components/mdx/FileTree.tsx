import React, { createContext, useContext } from 'react';
import { FileIcon, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const DepthCtx = createContext(0);

export function FileTree({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-5 overflow-hidden rounded-lg border border-border bg-card py-2 font-mono">
      {children}
    </div>
  );
}

export function FileTreeFolder({
  name,
  children,
}: {
  name: string;
  children?: React.ReactNode;
}) {
  const depth = useContext(DepthCtx);
  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-[3px] select-none"
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <FolderOpen className="size-3.5 shrink-0 text-sky-500 dark:text-sky-400" />
        <span className="text-[13px] text-foreground/90">{name}</span>
      </div>
      <DepthCtx.Provider value={depth + 1}>{children}</DepthCtx.Provider>
    </div>
  );
}

export function FileTreeFile({
  name,
  highlight,
}: {
  name: string;
  highlight?: boolean;
}) {
  const depth = useContext(DepthCtx);
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 py-[3px]',
        highlight && 'bg-primary/5'
      )}
      style={{ paddingLeft: `${depth * 16 + 12}px` }}
    >
      <FileIcon
        className={cn(
          'size-3.5 shrink-0',
          highlight ? 'text-primary' : 'text-muted-foreground/50'
        )}
      />
      <span
        className={cn(
          'text-[13px]',
          highlight
            ? 'font-medium text-primary'
            : 'text-foreground/70'
        )}
      >
        {name}
      </span>
    </div>
  );
}
