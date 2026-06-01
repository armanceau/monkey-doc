import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onToggleDark: () => void;
  isDark: boolean;
}

export function Header({ onToggleDark, isDark }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-border bg-background/90 px-5 backdrop-blur">
      <Button
        variant="outline"
        size="icon"
        className="size-7 rounded-full border-border"
        onClick={onToggleDark}
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="size-[14px]" /> : <Moon className="size-[14px]" />}
      </Button>
    </header>
  );
}
