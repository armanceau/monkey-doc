import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Layout } from './components/Layout';
import { DocPage } from './components/DocPage';
import { mdxComponents } from './components/mdx';
import { nav, docs, docImporters, config } from 'virtual:docs-manifest';

const allDocsList = Object.entries(docs).map(([slug, d]) => ({ slug, ...d }));

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

export function App() {
  const { isDark, toggle } = useDarkMode();
  const { lang, switchLang } = useLang();

  const filteredNav = lang
    ? (nav.find((n) => n.isFolder && n.slug === lang)?.children ?? [])
    : nav;

  const docsList = lang
    ? allDocsList.filter((d) => d.slug.startsWith(lang + '/'))
    : allDocsList;

  const firstDocPath = docsList[0]?.path ?? '/';

  return (
    <MDXProvider components={mdxComponents}>
      <BrowserRouter>
        <Layout
          nav={filteredNav}
          title={config.title}
          onToggleDark={toggle}
          isDark={isDark}
          docsList={docsList}
          lang={lang}
          languages={config.languages}
          github={config.github}
          onSwitchLang={switchLang}
        >
          <Routes>
            <Route path="/" element={<Navigate to={firstDocPath} replace />} />
            <Route
              path="/*"
              element={
                <DocPage docImporters={docImporters} docsList={docsList} />
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </MDXProvider>
  );
}
