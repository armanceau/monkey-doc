import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      className="not-prose my-2 overflow-hidden rounded-lg border border-border"
    >
      <Collapsible.Trigger className="group flex w-full items-center justify-between px-4 py-3 text-left text-[14px] font-medium transition-colors hover:bg-muted/50">
        <span>{title}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="border-t border-border px-4 py-3 text-[14px] leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px]">
          {children}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
