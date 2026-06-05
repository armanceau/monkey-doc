import React from 'react';

type Variant = 'default' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-foreground text-background hover:opacity-80',
  outline: 'border border-border text-foreground hover:bg-accent',
  ghost:   'text-foreground hover:bg-accent',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-7  px-3   text-[12px]',
  md: 'h-9  px-4   text-[13px]',
  lg: 'h-11 px-5   text-[14px]',
};

export function LinkButton({
  href,
  children,
  variant = 'default',
  size = 'md',
  external,
  icon,
}: LinkButtonProps) {
  const isExternal = external ?? (href.startsWith('http://') || href.startsWith('https://'));

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={[
        'not-prose inline-flex items-center gap-2 rounded-md font-medium transition-all no-underline',
        variantClasses[variant],
        sizeClasses[size],
      ].join(' ')}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {isExternal && (
        <svg
          width="11" height="11" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          className="shrink-0 opacity-60"
          aria-hidden
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )}
    </a>
  );
}
