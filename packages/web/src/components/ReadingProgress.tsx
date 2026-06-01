import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    setProgress(0);
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 z-50 h-0.5 bg-primary transition-[width] duration-100 ease-linear"
      style={{ width: `${progress}%` }}
    />
  );
}
