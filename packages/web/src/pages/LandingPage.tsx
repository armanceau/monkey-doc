import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const INSTALL_CMD = 'npx monkey-doc init';

const FEATURES = [
  {
    num: '01',
    title: 'Narrative-first',
    body: 'Write guides and stories, not component catalogs. Focus on the journey your users take, not the API surface.',
  },
  {
    num: '02',
    title: 'Zero config',
    body: 'One command. No webpack setup, no complex configuration. npx monkey-doc init scaffolds everything in seconds.',
    code: INSTALL_CMD,
  },
  {
    num: '03',
    title: 'Ships beautiful',
    body: 'A refined three-panel layout — sidebar navigation, prose content, live table of contents. Designed, not assembled.',
  },
];

const STEPS = [
  { n: '1', cmd: 'npx monkey-doc init', title: 'Initialize', desc: 'Creates a /docs folder with example files, components, and a config file.' },
  { n: '2', cmd: 'docs/my-guide.mdx',   title: 'Write MDX',  desc: 'Use Callouts, Steps, Cards, Tabs — all built-in, no imports needed.' },
  { n: '3', cmd: 'npx monkey-doc dev',  title: 'Start server', desc: 'Live server at localhost:5173 with hot reload on every save.' },
];

const NAV_ITEMS = ['Getting Started', 'Installation', 'Writing Guides', 'Components', 'Best Practices'];
const TOC_ITEMS = ['Introduction', 'Installation', 'Quick Start', 'Configuration'];
const FAKE_LINES = [1, 0.7, 0.85, 0.6, 0.9, 0.5];

function InstallCmd({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return (
    <button onClick={onCopy} className="land-install" style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '11px 18px', background: '#141411',
      border: '1px solid #252522', borderRadius: 10,
      fontFamily: '"JetBrains Mono", monospace', fontSize: 14,
      color: '#C4F135', cursor: 'pointer',
    }}>
      <span style={{ color: '#4A4840' }}>$</span>
      {INSTALL_CMD}
      <span style={{
        marginLeft: 4, fontSize: 11, fontFamily: 'system-ui, sans-serif',
        color: copied ? '#C4F135' : '#4A4840', transition: 'color 0.2s',
      }}>
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
}

export function LandingPage({ firstDocPath }: { firstDocPath: string }) {
  const [copied, setCopied]     = useState(false);
  const [copiedCta, setCopiedCta] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);

  const copy = (set: (v: boolean) => void) => {
    navigator.clipboard.writeText(INSTALL_CMD).catch(() => {});
    set(true);
    setTimeout(() => set(false), 2000);
  };

  return (
    <div style={{ background: '#0C0C0A', color: '#F0ECE3', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .land-a0 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        .land-a1 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
        .land-a2 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.16s both; }
        .land-a3 { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
        .land-install   { transition: background 0.15s; }
        .land-install:hover   { background: #1C1C18 !important; }
        .land-ghost { transition: background 0.15s, color 0.15s; }
        .land-ghost:hover { background: #1C1C18 !important; }
        .land-feat  { transition: border-color 0.2s; }
        .land-feat:hover { border-color: #3A3A36 !important; }
        .land-accent-btn { transition: opacity 0.15s; }
        .land-accent-btn:hover { opacity: 0.88; }
        .land-subtle-link:hover { color: #9A9891 !important; }
        .land-subtle-link { transition: color 0.15s; }
      `}</style>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #1A1A18', background: 'rgba(12,12,10,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, letterSpacing: '-0.01em', color: '#F0ECE3' }}>
            monkey-doc
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="https://github.com/armanceau/monkey-doc"
              target="_blank" rel="noopener noreferrer"
              className="land-ghost"
              style={{ padding: '7px 14px', fontSize: 13, borderRadius: 8, border: '1px solid #252522', color: '#6A6860', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <GitHubIcon />
              GitHub
            </a>
            <Link
              to={firstDocPath}
              className="land-accent-btn"
              style={{ padding: '7px 16px', fontSize: 13, fontWeight: 500, borderRadius: 8, background: '#C4F135', color: '#1A2E04', textDecoration: 'none' }}
            >
              Open Docs
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 32px 96px' }}>
        <div className="land-a0" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 44,
          padding: '5px 14px', borderRadius: 100, border: '1px solid #252522',
          fontSize: 11, fontFamily: '"JetBrains Mono", monospace',
          color: '#4A4840', letterSpacing: '0.04em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C4F135', display: 'inline-block', flexShrink: 0 }} />
          v0.1 · open source
        </div>

        <h1 className="land-a1" style={{
          fontSize: 'clamp(52px, 9vw, 96px)', lineHeight: 1.0,
          letterSpacing: '-0.045em', fontWeight: 300, margin: '0 0 32px',
          color: '#F0ECE3',
        }}>
          Your product<br />has a story.{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400, color: '#C4F135', letterSpacing: '-0.02em' }}>
            Now tell it.
          </em>
        </h1>

        <p className="land-a2" style={{
          fontSize: 18, lineHeight: 1.65, color: '#7A7870',
          maxWidth: 500, margin: '0 0 52px', fontWeight: 400,
        }}>
          Monkey-Doc is a zero-config documentation tool for teams who believe great products deserve great docs — not just component counts.
        </p>

        <div className="land-a3" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <InstallCmd onCopy={() => copy(setCopied)} copied={copied} />
          <Link
            to={firstDocPath}
            className="land-ghost"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '11px 18px', background: 'transparent',
              border: '1px solid #252522', borderRadius: 10,
              fontSize: 14, color: '#6A6860', textDecoration: 'none',
            }}
          >
            Read the docs
            <ArrowRight />
          </Link>
        </div>
      </section>

      <Divider />

      {/* ── Features ────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
        <SectionLabel>Features</SectionLabel>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, letterSpacing: '-0.035em', margin: '0 0 56px' }}>
          Everything you need to write{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', color: '#C4F135' }}>great docs</em>.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1C1C18', borderRadius: 16, overflow: 'hidden', border: '1px solid #1C1C18' }}>
          {FEATURES.map((f) => (
            <div key={f.num} className="land-feat" style={{ background: '#0C0C0A', padding: '36px 30px' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#C4F135', letterSpacing: '0.06em', marginBottom: 20 }}>
                {f.num}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.025em', margin: '0 0 12px', color: '#F0ECE3' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#5E5C58', margin: 0 }}>
                {f.body}
              </p>
              {f.code && (
                <div style={{ marginTop: 20, display: 'inline-flex', padding: '6px 12px', background: '#141411', borderRadius: 6, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#6A6860', border: '1px solid #252522' }}>
                  $ {f.code}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── How it works ────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
        <SectionLabel>How it works</SectionLabel>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, letterSpacing: '-0.035em', margin: '0 0 64px' }}>
          Up and running{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', color: '#C4F135' }}>in minutes</em>.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #2A2A26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#C4F135', flexShrink: 0 }}>
                  {s.n}
                </div>
                <div style={{ height: 1, flex: 1, background: '#1C1C18' }} />
              </div>
              <div style={{ padding: '10px 14px', background: '#0E0E0B', border: '1px solid #1C1C18', borderRadius: 8, fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#6A6860' }}>
                {s.cmd}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 6px', color: '#F0ECE3' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#5E5C58', margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── UI Preview ──────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
        <SectionLabel>Preview</SectionLabel>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, letterSpacing: '-0.035em', margin: '0 0 48px' }}>
          A reading experience{' '}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', color: '#C4F135' }}>worth sharing</em>.
        </h2>

        <div style={{ border: '1px solid #252522', borderRadius: 16, overflow: 'hidden', background: '#0E0E0B' }}>
          {/* Browser chrome */}
          <div style={{ background: '#141411', borderBottom: '1px solid #252522', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#FF5F57', '#FFBD2E', '#28CA41'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.75 }} />
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ padding: '5px 16px', background: '#1C1C18', borderRadius: 6, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#4A4840', display: 'flex', alignItems: 'center', gap: 6, width: 220, justifyContent: 'center' }}>
                localhost:5173
              </div>
            </div>
          </div>

          {/* 3-panel */}
          <div style={{ display: 'flex', height: 320, overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ width: 196, borderRight: '1px solid #1A1A18', padding: '20px 14px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#3A3836', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 10 }}>
                My Project
              </div>
              {NAV_ITEMS.map((item, i) => (
                <div key={item} style={{ padding: '6px 10px', borderRadius: 6, fontSize: 12, color: i === 0 ? '#E8E4DC' : '#3A3836', background: i === 0 ? '#1C1C18' : 'transparent', fontWeight: i === 0 ? 500 : 400 }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '28px 36px', overflow: 'hidden' }}>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.03em', color: '#E8E4DC', marginBottom: 20 }}>
                Getting Started
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FAKE_LINES.map((w, i) => (
                  <div key={i} style={{ height: 9, background: `rgba(240,236,227,${i < 2 ? 0.12 : 0.05})`, borderRadius: 4, width: `${w * 100}%` }} />
                ))}
                <div style={{ marginTop: 10, padding: '12px 14px', background: '#141411', borderLeft: '3px solid #C4F135', borderRadius: '0 6px 6px 0' }}>
                  {[0.8, 0.6].map((w, i) => (
                    <div key={i} style={{ height: 8, background: `rgba(196,241,53,${i === 0 ? 0.25 : 0.12})`, borderRadius: 3, width: `${w * 100}%`, marginBottom: i === 0 ? 6 : 0 }} />
                  ))}
                </div>
                {[0.75, 0.55].map((w, i) => (
                  <div key={i} style={{ height: 9, background: 'rgba(240,236,227,0.05)', borderRadius: 4, width: `${w * 100}%` }} />
                ))}
              </div>
            </div>

            {/* TOC */}
            <div style={{ width: 156, borderLeft: '1px solid #1A1A18', padding: '20px 16px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#3A3836', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                On this page
              </div>
              {TOC_ITEMS.map((item, i) => (
                <div key={item} style={{ fontSize: 11, color: i === 0 ? '#C4F135' : '#3A3836', paddingLeft: i > 1 ? 10 : 0 }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 120px' }}>
        <div style={{ background: '#0E0E0B', border: '1px solid #252522', borderRadius: 20, padding: 'clamp(48px, 8vw, 80px) 48px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, letterSpacing: '-0.04em', margin: '0 0 16px', lineHeight: 1.05 }}>
            Ready to start{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', color: '#C4F135' }}>writing</em>?
          </h2>
          <p style={{ fontSize: 16, color: '#5E5C58', margin: '0 0 44px' }}>
            Free and open source. Works with any project.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <InstallCmd onCopy={() => copy(setCopiedCta)} copied={copiedCta} />
            <Link
              to={firstDocPath}
              className="land-subtle-link"
              style={{ fontSize: 13, color: '#4A4840', textDecoration: 'none', borderBottom: '1px solid #252522', paddingBottom: 2 }}
            >
              or read the documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #1A1A18', maxWidth: 1100, margin: '0 auto', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 16, color: '#3A3836' }}>monkey-doc</span>
          <span style={{ fontSize: 12, color: '#2E2E2C' }}>A narrative documentation tool.</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="https://github.com/armanceau/monkey-doc" target="_blank" rel="noopener noreferrer"
             className="land-subtle-link"
             style={{ fontSize: 13, color: '#3A3836', textDecoration: 'none' }}>
            GitHub
          </a>
          <Link to={firstDocPath} className="land-subtle-link"
                style={{ fontSize: 13, color: '#3A3836', textDecoration: 'none' }}>
            Docs
          </Link>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3A3836', marginBottom: 18 }}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1C1C18 20%, #1C1C18 80%, transparent)' }} />
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
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
