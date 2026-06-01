import React, { useState, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";

function CopyIcon({ done }: { done: boolean }) {
  if (done) return <span className="text-[#50e3c2]">✓</span>;
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M2 10V3a1 1 0 011-1h7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function extractCodeProps(children: React.ReactNode): {
  code: string;
  language: string;
} {
  if (React.isValidElement(children)) {
    const el = children as React.ReactElement<{
      className?: string;
      children?: string;
    }>;
    const lang = (el.props.className ?? "").replace("language-", "") || "text";
    return {
      code: String(el.props.children ?? "").replace(/\n$/, ""),
      language: lang,
    };
  }
  return { code: String(children ?? ""), language: "text" };
}

export function CodeBlock({ children }: { children?: React.ReactNode }) {
  const { code, language } = extractCodeProps(children);
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="not-prose my-5 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-950 px-4 py-2.5 border-b border-zinc-200 dark:border-white/[0.06]">
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-zinc-500">
          {language === "text" ? "code" : language}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
          aria-label="Copy code"
        >
          <CopyIcon done={copied} />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-950">
        <Highlight
          theme={isDark ? themes.oneDark : themes.github}
          code={code}
          language={language === "text" ? "plain" : language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={className}
              style={{
                ...style,
                background: "transparent",
                margin: 0,
                borderRadius: 0,
                padding: "1.125rem 1.25rem",
                fontSize: "13px",
                lineHeight: "20px",
                fontFamily:
                  '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                overflowX: "auto",
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

export function InlineCode({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <code
      className={`rounded-sm bg-[#f5f5f5] px-[0.375em] py-[0.15em] font-mono text-[0.8125em] font-[400] text-[#171717]
        dark:bg-[#1f1f1f] dark:text-[#e5e5e5] ${className ?? ""}`}
    >
      {children}
    </code>
  );
}
