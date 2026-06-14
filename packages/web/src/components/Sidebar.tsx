import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import type { NavNode } from "../types";
import { VersionSwitcher } from "./VersionSwitcher";

interface VersionConfig {
  label: string;
  value: string;
  path: string;
  tag?: string;
}

interface AppSidebarProps {
  nav: NavNode[];
  title: string;
  logo?: string;
  versions?: VersionConfig[];
  currentVersion?: string;
  versionedDocs?: Record<string, Record<string, { path: string }>>;
}

function isDescendantActive(node: NavNode, pathname: string): boolean {
  if (!node.isFolder) return node.path === pathname;
  return node.children.some((c) => isDescendantActive(c, pathname));
}

// Renders items at depth >= 1 (inside a SidebarMenuSub).
function SubNavItem({ node, depth }: { node: NavNode; depth: number }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => node.isFolder && isDescendantActive(node, pathname));

  if (node.isFolder) {
    return (
      <SidebarMenuSubItem>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{ paddingLeft: `${(depth - 1) * 10}px` }}
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[12px] text-muted-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <ChevronRight
            className={`size-3 shrink-0 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.06em]">
            {node.title}
          </span>
        </button>
        {open && (
          <SidebarMenuSub>
            {node.children.map((child) => (
              <SubNavItem key={child.slug} node={child} depth={depth + 1} />
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuSubItem>
      <NavLink to={node.path!}>
        {({ isActive }) => (
          <SidebarMenuSubButton
            asChild
            isActive={isActive}
            style={{ paddingLeft: depth > 1 ? `${(depth - 1) * 10 + 8}px` : undefined }}
          >
            <span>{node.title}</span>
          </SidebarMenuSubButton>
        )}
      </NavLink>
    </SidebarMenuSubItem>
  );
}

// Renders top-level nav items (depth 0).
function NavItem({ node }: { node: NavNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => node.isFolder && isDescendantActive(node, pathname));

  if (node.isFolder) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setOpen((o) => !o)}
          className="text-muted-foreground/70"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] flex-1">
            {node.title}
          </span>
          <ChevronRight
            className={`size-3.5 shrink-0 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
          />
        </SidebarMenuButton>
        {open && (
          <SidebarMenuSub>
            {node.children.map((child) => (
              <SubNavItem key={child.slug} node={child} depth={1} />
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <NavLink to={node.path!}>
        {({ isActive }) => (
          <SidebarMenuButton asChild isActive={isActive}>
            <span>{node.title}</span>
          </SidebarMenuButton>
        )}
      </NavLink>
    </SidebarMenuItem>
  );
}

export function AppSidebar({ nav, title, logo, versions, currentVersion, versionedDocs }: AppSidebarProps) {
  const showVersionSwitcher = versions && versions.length > 0 && currentVersion && versionedDocs;

  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-5 py-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {logo ? (
            <img src={logo} alt="" className="size-6 shrink-0 object-contain" />
          ) : (
            <img src="/icon-monkey-doc.svg" alt="" className="size-6 shrink-0 object-contain" />
          )}
          <span
            className="truncate select-none"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 20,
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            {title}
          </span>
        </div>
      </SidebarHeader>
      {showVersionSwitcher && (
        <VersionSwitcher
          versions={versions!}
          currentVersion={currentVersion!}
          versionedDocs={versionedDocs!}
        />
      )}
      <SidebarContent>
        <SidebarMenu>
          {nav.map((node) => (
            <NavItem key={node.slug} node={node} />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
