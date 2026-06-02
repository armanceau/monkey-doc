import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: (string | BreadcrumbItem)[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const normalized = items.map((item) =>
    typeof item === 'string' ? { label: item } : item,
  );

  return (
    <nav className="not-prose my-4 flex items-center gap-1 text-[13px]">
      {normalized.map((item, i) => {
        const isLast = i === normalized.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <ChevronRight className="size-3.5 shrink-0 text-[#c0c0c0] dark:text-[#444]" />
            )}
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="text-[#666] hover:text-[#171717] dark:text-[#888] dark:hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={
                  isLast
                    ? 'font-medium text-[#171717] dark:text-white'
                    : 'text-[#666] dark:text-[#888]'
                }
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
