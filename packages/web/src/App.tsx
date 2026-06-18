import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Layout } from './components/Layout';
import { DocPage } from './components/DocPage';
import { LandingPage } from './pages/LandingPage';
import CustomLanding from 'virtual:custom-landing';
import { PrintPage } from './pages/PrintPage';
import { mdxComponents } from './components/mdx';
import {
  nav, docs, docImporters, config,
  versions, defaultVersion, versionedNav, versionedDocs, versionedDocImporters,
} from 'virtual:docs-manifest';

const allDocsList = Object.entries(docs).map(([slug, d]) => ({ slug, ...d }));
const hasVersions = Array.isArray(versions) && versions.length > 0;
const LOCALE_CODES = new Set(['en', 'fr', 'de', 'es', 'pt', 'ja', 'zh', 'ko', 'it', 'ru', 'nl', 'pl', 'tr', 'vi', 'ar']);

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('monkey-doc-dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('monkey-doc-dark', String(isDark));
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((d) => !d) };
}

function useLang() {
  const [lang, setLang] = useState<string | null>(() => {
    if (config.languages.length === 0) return null;
    return localStorage.getItem('monkey-doc-lang') || config.defaultLanguage || config.languages[0];
  });

  function switchLang(code: string) {
    setLang(code);
    localStorage.setItem('monkey-doc-lang', code);
  }

  return { lang, switchLang };
}

// ── Versioned route ────────────────────────────────────────────────────────

interface VersionedRouteProps {
  isDark: boolean;
  toggle: () => void;
  lang: string | null;
  switchLang: (code: string) => void;
}

function VersionedRoute({ isDark, toggle, lang, switchLang }: VersionedRouteProps) {
  const { version: activeVersion = defaultVersion ?? '', '*': docSlug = '' } = useParams<{ version: string; '*': string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Invalid version → redirect to default
  const versionConfig = versions.find(v => v.value === activeVersion);
  if (!versionConfig) {
    return <Navigate to={`/${defaultVersion}`} replace />;
  }

  const activeNav = versionedNav[activeVersion] ?? [];
  const activeDocs = versionedDocs[activeVersion] ?? {};
  const activeImporters = versionedDocImporters[activeVersion] ?? {};

  // Detect languages from folder nodes in this version's nav
  const versionLanguages = activeNav
    .filter(n => n.isFolder && LOCALE_CODES.has(n.slug))
    .map(n => n.slug);

  const allVersionDocsList = Object.entries(activeDocs)
    .map(([slug, d]) => ({ slug, ...d }))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

  // Apply language filter (same logic as non-versioned mode)
  const filteredNav = lang && versionLanguages.includes(lang)
    ? [
        ...activeNav.filter(n => !versionLanguages.includes(n.slug)),
        ...(activeNav.find(n => n.isFolder && n.slug === lang)?.children ?? []),
      ]
    : activeNav;

  const docsList = lang && versionLanguages.includes(lang)
    ? [
        ...allVersionDocsList.filter(d => !versionLanguages.some(l => d.slug.startsWith(l + '/'))),
        ...allVersionDocsList.filter(d => d.slug.startsWith(lang + '/')),
      ].sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
    : allVersionDocsList;

  // No slug → redirect to first doc
  if (!docSlug && docsList.length > 0) {
    return <Navigate to={docsList[0].path} replace />;
  }

  // Version-aware language switcher: keep version prefix, swap language segment
  function handleSwitchLang(newLang: string) {
    switchLang(newLang);
    const parts = pathname.split('/').filter(Boolean);
    // parts = ['v4', 'en', 'getting-started']
    if (parts[0] === activeVersion) {
      if (lang && parts[1] === lang) {
        // /v4/en/getting-started → /v4/fr/getting-started
        navigate('/' + [activeVersion, newLang, ...parts.slice(2)].join('/'));
      } else {
        navigate(`/${activeVersion}/${newLang}`);
      }
    }
  }

  return (
    <Layout
      nav={filteredNav}
      title={config.title}
      logo={config.logo}
      onToggleDark={toggle}
      isDark={isDark}
      docsList={docsList}
      lang={lang}
      languages={versionLanguages.length > 0 ? versionLanguages : config.languages}
      github={config.github}
      onSwitchLang={handleSwitchLang}
      versions={versions}
      currentVersion={activeVersion}
      versionedDocs={versionedDocs as Record<string, Record<string, { path: string }>>}
    >
      <DocPage
        docImporters={activeImporters}
        docsList={docsList}
        lang={lang}
        github={config.github}
      />
    </Layout>
  );
}

// ── Root app ───────────────────────────────────────────────────────────────

export function App() {
  const { isDark, toggle } = useDarkMode();
  const { lang, switchLang } = useLang();

  useEffect(() => { document.title = config.title; }, []);

  // Non-versioned setup
  const orderBySlug = new Map(allDocsList.map((d) => [d.slug, d.order]));

  function navOrder(node: { slug: string; isFolder: boolean; children: { slug: string }[] }): number {
    if (!node.isFolder) return orderBySlug.get(node.slug) ?? 999;
    const min = Math.min(...node.children.map((c) => orderBySlug.get(c.slug) ?? 999));
    return isFinite(min) ? min : 999;
  }

  const filteredNav = lang
    ? [
        ...nav.filter((n) => !config.languages.includes(n.slug)),
        ...(nav.find((n) => n.isFolder && n.slug === lang)?.children ?? []),
      ].sort((a, b) => navOrder(a) - navOrder(b) || a.title.localeCompare(b.title))
    : nav;

  const docsList = lang
    ? [
        ...allDocsList.filter((d) => !config.languages.some((l) => d.slug.startsWith(l + '/'))),
        ...allDocsList.filter((d) => d.slug.startsWith(lang + '/')),
      ].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    : allDocsList;

  const firstDocPath = docsList[0]?.path ?? '/';

  // With versioning the LandingPage is skipped — redirect straight to docs.
  const defaultVersionFirstPath = (() => {
    if (!hasVersions) return '/';
    const dv = defaultVersion ?? versions[0]?.value;
    if (!dv) return '/';
    const entries = Object.values(versionedDocs[dv] ?? {});
    const sorted = [...entries].sort((a, b) => a.order - b.order || a.path.localeCompare(b.path));
    return sorted[0]?.path ?? `/${dv}`;
  })();

  const landingCfg = config.landingPage;
  const landingPageEl = (firstPath: string) => {
    if (CustomLanding) return <CustomLanding firstDocPath={firstPath} />;
    if (landingCfg === false) return <Navigate to={firstPath} replace />;
    return <LandingPage firstDocPath={firstPath} landingConfig={typeof landingCfg === 'object' ? landingCfg : undefined} />;
  };

  return (
    <MDXProvider components={mdxComponents}>
      <BrowserRouter>
        <Routes>
          {hasVersions ? (
            <>
              <Route path="/" element={landingPageEl(defaultVersionFirstPath)} />
              <Route path="/print" element={<PrintPage />} />
              <Route
                path="/:version/*"
                element={<VersionedRoute isDark={isDark} toggle={toggle} lang={lang} switchLang={switchLang} />}
              />
            </>
          ) : (
            <>
              <Route path="/" element={landingPageEl(firstDocPath)} />
              <Route path="/print" element={<PrintPage />} />
              <Route
                path="/*"
                element={
                  <Layout
                    nav={filteredNav}
                    title={config.title}
                    logo={config.logo}
                    onToggleDark={toggle}
                    isDark={isDark}
                    docsList={docsList}
                    lang={lang}
                    languages={config.languages}
                    github={config.github}
                    onSwitchLang={switchLang}
                  >
                    <DocPage
                      docImporters={docImporters}
                      docsList={docsList}
                      lang={lang}
                      github={config.github}
                    />
                  </Layout>
                }
              />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </MDXProvider>
  );
}
