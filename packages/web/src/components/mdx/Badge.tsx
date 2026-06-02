import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'new'
  | 'beta'
  | 'deprecated';

const variants: Record<BadgeVariant, string> = {
  default:    'bg-muted text-muted-foreground',
  info:       'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  success:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning:    'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  error:      'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  new:        'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  beta:       'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400',
  deprecated: 'bg-zinc-200 text-zinc-500 line-through dark:bg-zinc-700 dark:text-zinc-400',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide',
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
