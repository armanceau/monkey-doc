import React from 'react';
import {
  Tabs as ShadTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

interface TabsProps {
  labels: string[];
  children: React.ReactNode;
}

export function Tabs({ labels, children }: TabsProps) {
  const panels = React.Children.toArray(children);

  return (
    <ShadTabs defaultValue={labels[0]} className="not-prose my-5">
      <TabsList className="h-auto rounded-t-md rounded-b-none border border-b-0 border-border bg-muted/50 p-1 gap-0.5">
        {labels.map((label) => (
          <TabsTrigger
            key={label}
            value={label}
            className="rounded-sm text-[13px] tracking-body-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {labels.map((label, i) => (
        <TabsContent
          key={label}
          value={label}
          className="mt-0 rounded-b-md rounded-tr-md border border-border bg-card p-4 text-[14px] text-muted-foreground"
        >
          {panels[i]}
        </TabsContent>
      ))}
    </ShadTabs>
  );
}
