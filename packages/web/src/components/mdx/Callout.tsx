import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type CalloutType = 'info' | 'warning' | 'success';

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
}

const variants: Record<CalloutType, { classes: string; icon: string }> = {
  info: {
    classes: 'border-[#0070f3]/20 bg-[#d3e5ff] text-[#0761d1] dark:bg-[#0070f3]/10 dark:text-[#6cb8ff]',
    icon: 'ℹ',
  },
  warning: {
    classes: 'border-[#f5a623]/30 bg-[#ffefcf] text-[#ab570a] dark:bg-[#f5a623]/10 dark:text-[#f5a623]',
    icon: '!',
  },
  success: {
    classes: 'border-[#0070f3]/20 bg-[#d3e5ff] text-[#0761d1] dark:bg-[#0070f3]/10 dark:text-[#6cb8ff]',
    icon: '✓',
  },
};

export function Callout({ type = 'info', children }: CalloutProps) {
  const { classes, icon } = variants[type];
  return (
    <Alert className={cn('not-prose my-5 flex gap-3 rounded-md py-3 [&>svg~*]:pl-0', classes)}>
      <span
        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold leading-none"
        aria-hidden
      >
        {icon}
      </span>
      <AlertDescription className="text-[14px] leading-6 [&_a]:underline [&_strong]:font-semibold">
        {children}
      </AlertDescription>
    </Alert>
  );
}
