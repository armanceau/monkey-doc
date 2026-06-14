import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

interface VersionConfig {
  label: string;
  value: string;
  path: string;
  tag?: string;
}

interface VersionSwitcherProps {
  versions: VersionConfig[];
  currentVersion: string;
  versionedDocs: Record<string, Record<string, { path: string }>>;
}

function tagLabel(tag: string): string {
  if (tag === 'maintenance') return 'In maintenance mode';
  if (tag === 'latest') return 'Latest';
  return tag;
}

export function VersionSwitcher({ versions, currentVersion, versionedDocs }: VersionSwitcherProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = versions.find(v => v.value === currentVersion);

  function handleSwitch(targetVersion: string) {
    if (targetVersion === currentVersion) return;

    const prefix = `/${currentVersion}/`;
    const currentSlug = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : '';
    const targetDocs = versionedDocs[targetVersion] ?? {};

    if (currentSlug && targetDocs[currentSlug]) {
      navigate(`/${targetVersion}/${currentSlug}`);
    } else {
      const firstPath = Object.values(targetDocs)[0]?.path;
      navigate(firstPath ?? `/${targetVersion}`);
    }

    localStorage.setItem('monkey-doc-version', targetVersion);
  }

  return (
    <div className="px-3 py-2.5 border-b border-sidebar-border">
      <Select value={currentVersion} onValueChange={handleSwitch}>
        <SelectTrigger className="h-auto w-full border-sidebar-border bg-sidebar px-3 py-2 shadow-none focus:ring-0 hover:bg-sidebar-accent transition-colors [&>span]:line-clamp-none">
          <div className="flex flex-col items-start text-left flex-1 min-w-0 mr-1">
            <span className="text-[13px] font-medium text-foreground leading-tight">
              {current?.label ?? currentVersion}
            </span>
            {current?.tag && (
              <span className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                {tagLabel(current.tag)}
              </span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent align="start" sideOffset={4}>
          {versions.map(v => (
            <SelectItem key={v.value} value={v.value} className="py-2 pr-8">
              <div className="flex flex-col">
                <span className="text-[13px] font-medium">{v.label}</span>
                {v.tag && (
                  <span className="text-[11px] text-muted-foreground">{tagLabel(v.tag)}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
