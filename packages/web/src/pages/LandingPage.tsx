import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const INSTALL_CMD = 'npx monkey-doc init';

const FEATURES = [
  {
    title: 'Narrative-first',
    body: 'Write guides and stories, not component catalogs. Focus on the journey your users take, not the API surface.',
    icon: <BookIcon />,
  },
  {
    title: 'Zero config',
    body: 'One command. No webpack setup, no complex configuration. npx monkey-doc init scaffolds everything in seconds.',
    icon: <ZapIcon />,
  },
  {
    title: 'Ships beautiful',
    body: 'A three-panel layout with sidebar navigation, table of contents, breadcrumbs, dark mode, and full MDX support.',
    icon: <SparkleIcon />,
  },
];

const STEPS = [
  { n: '1', cmd: 'npx monkey-doc init',  label: 'Initialize', desc: 'Creates a /docs folder with example files and config.' },
  { n: '2', cmd: 'docs/my-guide.mdx',    label: 'Write MDX',  desc: 'Use Callouts, Steps, Cards, Tabs — all built-in, no imports needed.' },
  { n: '3', cmd: 'npx monkey-doc dev',   label: 'Preview',    desc: 'Live server at localhost:5173 with hot reload on every save.' },
];

const NAV_ITEMS  = ['Getting Started', 'Installation', 'Writing Guides', 'Components', 'Best Practices'];
const TOC_ITEMS  = ['Introduction', 'Installation', 'Quick Start', 'Configuration'];
const FAKE_LINES = [1, 0.7, 0.85, 0.6, 0.9, 0.5];

export function LandingPage({ firstDocPath }: { firstDocPath: string }) {
  const [copied, setCopied]       = useState(false);
  const [copiedCta, setCopiedCta] = useState(false);

  const copy = (set: (v: boolean) => void) => {
    navigator.clipboard.writeText(INSTALL_CMD).catch(() => {});
    set(true);
    setTimeout(() => set(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5 select-none">
            <img src="/icon-monkey-doc.svg" alt="" className="size-6" />
            <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, letterSpacing: '-0.01em' }}
                  className="text-foreground">
              monkey-doc
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/armanceau/monkey-doc"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitHubIcon />
              GitHub
            </a>
            <Link
              to={firstDocPath}
              className="rounded-md bg-foreground px-3 py-1.5 text-[13px] font-medium text-background transition-opacity hover:opacity-80"
            >
              Open Docs
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-24 md:pt-32">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/30" />
          v{__MONKEY_DOC_VERSION__} · open source
        </div>

        <h1 className="mb-6 text-[clamp(40px,7vw,68px)] font-semibold leading-[1.02] tracking-[-0.05em] text-foreground">
          Your product has a story.{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              className="font-normal not-italic text-muted-foreground">
            Now&nbsp;tell&nbsp;it.
          </em>
        </h1>

        <p className="mb-10 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
          Monkey-Doc is a zero-config documentation tool for teams who believe
          great products deserve great docs — not just component counts.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <CopyInstall onCopy={() => copy(setCopied)} copied={copied} />
          <Link
            to={firstDocPath}
            className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-[14px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Read the docs <ArrowRight />
          </Link>
        </div>
      </section>

      <Divider />

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionLabel>Features</SectionLabel>
        <h2 className="mb-12 text-[clamp(24px,3.5vw,36px)] font-semibold tracking-[-0.04em] text-foreground">
          Everything you need to write{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              className="font-normal not-italic text-muted-foreground">
            great docs.
          </em>
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title}
                 className="rounded-xl border border-border bg-card p-6 shadow-card-2 transition-shadow hover:shadow-card-3">
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground/60">
                {f.icon}
              </div>
              <h3 className="mb-2 text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mb-12 text-[clamp(24px,3.5vw,36px)] font-semibold tracking-[-0.04em] text-foreground">
          Up and running{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              className="font-normal not-italic text-muted-foreground">
            in minutes.
          </em>
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[11px] text-foreground/50">
                  {s.n}
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>
              <code className="inline-block rounded-md border border-border bg-muted px-3 py-2 font-mono text-[12px] text-foreground/70">
                {s.cmd}
              </code>
              <div>
                <p className="mb-1 text-[14px] font-semibold tracking-[-0.02em] text-foreground">{s.label}</p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── UI Preview ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionLabel>Preview</SectionLabel>
        <h2 className="mb-10 text-[clamp(24px,3.5vw,36px)] font-semibold tracking-[-0.04em] text-foreground">
          A reading experience{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              className="font-normal not-italic text-muted-foreground">
            worth sharing.
          </em>
        </h2>

        {/* Browser mockup */}
        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-card-4">
          {/* Chrome bar */}
          <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
            <div className="flex gap-1.5">
              {['#FF5F57', '#FFBD2E', '#28CA41'].map((c, i) => (
                <div key={i} style={{ background: c }} className="h-2.5 w-2.5 rounded-full opacity-70" />
              ))}
            </div>
            <div className="mx-auto flex w-48 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground">
              localhost:5173
            </div>
          </div>

          {/* 3-panel */}
          <div className="flex h-72 overflow-hidden">
            {/* Sidebar */}
            <div className="flex w-44 shrink-0 flex-col gap-0.5 border-r border-border bg-card p-3 pt-4">
              <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                My Project
              </p>
              {NAV_ITEMS.map((item, i) => (
                <div key={item}
                     className={`rounded-md px-2.5 py-1.5 text-[12px] ${i === 0 ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {item}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-7">
              <div className="mb-4 text-[17px] font-semibold tracking-[-0.03em] text-foreground">
                Getting Started
              </div>
              <div className="flex flex-col gap-2">
                {FAKE_LINES.map((w, i) => (
                  <div key={i}
                       style={{ width: `${w * 100}%`, opacity: i < 2 ? 0.12 : 0.06 }}
                       className="h-2.5 rounded-sm bg-foreground" />
                ))}
                <div className="mt-2 rounded-r-md border-l-2 border-foreground/20 bg-muted p-3">
                  {[0.8, 0.55].map((w, i) => (
                    <div key={i}
                         style={{ width: `${w * 100}%`, opacity: 0.12 }}
                         className={`h-2 rounded-sm bg-foreground ${i === 0 ? 'mb-1.5' : ''}`} />
                  ))}
                </div>
                {[0.75, 0.5].map((w, i) => (
                  <div key={i}
                       style={{ width: `${w * 100}%`, opacity: 0.06 }}
                       className="h-2.5 rounded-sm bg-foreground" />
                ))}
              </div>
            </div>

            {/* TOC */}
            <div className="flex w-36 shrink-0 flex-col gap-2 border-l border-border p-4 pt-4">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                On this page
              </p>
              {TOC_ITEMS.map((item, i) => (
                <div key={item}
                     style={{ paddingLeft: i > 1 ? 8 : 0 }}
                     className={`text-[11px] ${i === 0 ? 'font-medium text-foreground' : 'text-muted-foreground/40'}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-xl border border-border bg-foreground px-8 py-16 text-center text-background">
          <h2 className="mb-3 text-[clamp(28px,4.5vw,48px)] font-semibold tracking-[-0.04em]">
            Ready to start writing?
          </h2>
          <p className="mb-10 text-[15px] text-background/50">
            Free and open source. Works with any project.
          </p>
          <div className="flex flex-col items-center gap-4">
            <CopyInstallDark onCopy={() => copy(setCopiedCta)} copied={copiedCta} />
            <Link
              to={firstDocPath}
              className="text-[13px] text-background/40 underline underline-offset-4 transition-colors hover:text-background/70"
            >
              or read the documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 select-none">
              <img src="/icon-monkey-doc.svg" alt="" className="size-5 opacity-50" />
              <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 17 }}
                    className="text-muted-foreground">
                monkey-doc
              </span>
            </div>
            <span className="text-[12px] text-muted-foreground/40">A narrative documentation tool.</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/armanceau/monkey-doc" target="_blank" rel="noopener noreferrer"
               className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
              GitHub
            </a>
            <Link to={firstDocPath}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function CopyInstall({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return (
    <button
      onClick={onCopy}
      className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 font-mono text-[13px] text-foreground/70 shadow-card-1 transition-shadow hover:shadow-card-2"
    >
      <span className="text-muted-foreground/40">$</span>
      {INSTALL_CMD}
      <span className={`ml-1 text-[11px] font-sans transition-colors ${copied ? 'text-foreground' : 'text-muted-foreground/40'}`}>
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
}

function CopyInstallDark({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return (
    <button
      onClick={onCopy}
      className="flex items-center gap-2 rounded-md border border-background/10 bg-background/10 px-4 py-2.5 font-mono text-[13px] text-background/70 transition-colors hover:bg-background/15"
    >
      <span className="text-background/30">$</span>
      {INSTALL_CMD}
      <span className={`ml-1 text-[11px] font-sans transition-colors ${copied ? 'text-background' : 'text-background/30'}`}>
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground/50">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-border" /></div>;
}

function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75z" /><path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
