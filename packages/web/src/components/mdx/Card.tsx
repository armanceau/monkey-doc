import React from 'react';
import {
  Card as ShadCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  description?: string;
  href?: string;
  children?: React.ReactNode;
}

export function Card({ title, description, href, children }: CardProps) {
  const inner = (
    <ShadCard className={cn(
      'not-prose my-4 shadow-card-2 transition-shadow hover:shadow-card-3',
      href && 'cursor-pointer'
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-[14px] font-semibold tracking-[-0.02em]">{title}</CardTitle>
        {description && (
          <CardDescription className="text-[14px] leading-6">{description}</CardDescription>
        )}
      </CardHeader>
      {children && (
        <CardContent className="text-[14px] text-muted-foreground">{children}</CardContent>
      )}
      {href && (
        <CardFooter className="pt-0">
          <span className="text-[13px] text-[#0070f3] group-hover:underline">Learn more →</span>
        </CardFooter>
      )}
    </ShadCard>
  );

  return href ? (
    <a href={href} className="block group">{inner}</a>
  ) : inner;
}
