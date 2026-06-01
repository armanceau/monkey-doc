import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Layout } from './components/Layout';
import { DocPage } from './components/DocPage';
import { mdxComponents } from './components/mdx';
import { nav, docs, docImporters, config } from 'virtual:docs-manifest';

const docsList = Object.entries(docs).map(([slug, d]) => ({ slug, ...d }));
const firstDocPath = docsList[0]?.path ?? '/';

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

export function App() {
  const { isDark, toggle } = useDarkMode();

  return (
    <MDXProvider components={mdxComponents}>
      <BrowserRouter>
        <Layout nav={nav} title={config.title} onToggleDark={toggle} isDark={isDark}>
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
