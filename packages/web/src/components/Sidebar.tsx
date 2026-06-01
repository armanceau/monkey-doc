import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import type { NavNode } from '../types';

interface AppSidebarProps {
  nav: NavNode[];
  title: string;
}

function NavItem({ node }: { node: NavNode }) {
  const location = useLocation();

  const isDescendantActive = (n: NavNode): boolean =>
    (!n.isFolder && n.path === location.pathname) ||
    n.children.some(isDescendantActive);

  const [open, setOpen] = useState(() => node.isFolder && isDescendantActive(node));

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
            className={`size-3.5 shrink-0 transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
          />
        </SidebarMenuButton>
        {open && (
          <SidebarMenuSub>
            {node.children.map((child) => (
              <SidebarMenuSubItem key={child.slug}>
                <NavLink to={child.path!}>
                  {({ isActive }) => (
                    <SidebarMenuSubButton asChild isActive={isActive}>
                      <span>{child.title}</span>
                    </SidebarMenuSubButton>
                  )}
                </NavLink>
              </SidebarMenuSubItem>
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

export function AppSidebar({ nav, title }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-5 py-0">
        <div className="flex items-center gap-2.5">
          <span className="text-lg leading-none select-none">🐒</span>
          <span className="text-[14px] font-semibold tracking-[-0.025em] text-foreground truncate">
            {title}
          </span>
        </div>
      </SidebarHeader>
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
