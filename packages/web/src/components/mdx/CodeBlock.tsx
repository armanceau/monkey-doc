import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Match Vercel's code editor surface: #171717 bg, 13px JetBrains Mono
const codeTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#171717',
    margin: 0,
    borderRadius: 0,
    fontSize: '13px',
    lineHeight: '20px',
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'none',
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '13px',
  },
};

function CopyIcon({ done }: { done: boolean }) {
  if (done) return <span className="text-[#50e3c2]">✓</span>;
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2 10V3a1 1 0 011-1h7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function extractCodeProps(children: React.ReactNode): { code: string; language: string } {
  if (React.isValidElement(children)) {
    const el = children as React.ReactElement<{ className?: string; children?: string }>;
    const lang = (el.props.className ?? '').replace('language-', '') || 'text';
    return { code: String(el.props.children ?? '').replace(/\n$/, ''), language: lang };
  }
  return { code: String(children ?? ''), language: 'text' };
}

export function CodeBlock({ children }: { children?: React.ReactNode }) {
  const { code, language } = extractCodeProps(children);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="not-prose my-5 overflow-hidden rounded-md shadow-card-3 dark:shadow-card-dark-2">
      {/* Header bar — code-editor-mockup chrome */}
      <div className="flex items-center justify-between bg-[#171717] px-4 py-2.5 border-b border-white/5">
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#888888]">
          {language === 'text' ? 'code' : language}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 font-mono text-[11px] text-[#666666] transition-colors hover:text-[#a1a1a1]"
          aria-label="Copy code"
        >
          <CopyIcon done={copied} />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language === 'text' ? 'plaintext' : language}
        style={codeTheme}
        customStyle={{ padding: '1.125rem 1.25rem', margin: 0, background: '#171717', borderRadius: 0 }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function InlineCode({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <code
      className={`rounded-sm bg-[#f5f5f5] px-[0.375em] py-[0.15em] font-mono text-[0.8125em] font-[400] text-[#171717]
        dark:bg-[#1f1f1f] dark:text-[#e5e5e5] ${className ?? ''}`}
    >
      {children}
    </code>
  );
}
