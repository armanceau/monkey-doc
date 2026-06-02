import React from 'react';

interface PropertyProps {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  deprecated?: boolean;
  children?: React.ReactNode;
}

export function Property({ name, type, defaultValue, required, deprecated, children }: PropertyProps) {
  return (
    <div className={`not-prose my-3 rounded-lg border border-[#e5e5e5] dark:border-[#2a2a2a] overflow-hidden ${deprecated ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-center gap-3 bg-[#fafafa] dark:bg-[#111] px-4 py-3">
        <code className={`text-[13px] font-semibold font-mono text-[#171717] dark:text-white ${deprecated ? 'line-through' : ''}`}>
          {name}
        </code>
        <span className="rounded-md bg-[#eff6ff] dark:bg-[#0d1f3c] px-2 py-0.5 font-mono text-[11px] text-[#3b82f6] dark:text-[#60a5fa]">
          {type}
        </span>
        {required && (
          <span className="rounded-md bg-[#fff1f2] dark:bg-[#2d0a0e] px-2 py-0.5 font-mono text-[11px] text-[#e11d48] dark:text-[#fb7185]">
            required
          </span>
        )}
        {deprecated && (
          <span className="rounded-md bg-[#f5f5f5] dark:bg-[#1a1a1a] px-2 py-0.5 font-mono text-[11px] text-[#999] dark:text-[#555]">
            deprecated
          </span>
        )}
        {defaultValue !== undefined && (
          <span className="ml-auto font-mono text-[12px] text-[#999] dark:text-[#555]">
            default:{' '}
            <code className="text-[#4d4d4d] dark:text-[#a1a1a1]">{defaultValue}</code>
          </span>
        )}
      </div>
      {children && (
        <div className="border-t border-[#e5e5e5] dark:border-[#2a2a2a] px-4 py-3 text-[13px] leading-6 text-[#4d4d4d] dark:text-[#a1a1a1]">
          {children}
        </div>
      )}
    </div>
  );
}

export function PropertyGroup({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="not-prose my-6">
      {title && (
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#999] dark:text-[#555]">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}
