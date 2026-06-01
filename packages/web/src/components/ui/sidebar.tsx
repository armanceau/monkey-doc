import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ─── Context ──────────────────────────────────────────────────────────────────

type SidebarContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue>({
  open: true,
  setOpen: () => undefined,
});

function useSidebar() {
  return React.useContext(SidebarContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
}

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ defaultOpen = true, className, children, style, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen);
    return (
      <SidebarContext.Provider value={{ open, setOpen }}>
        <div
          ref={ref}
          style={{ '--sidebar-width': '260px', '--sidebar-width-icon': '3rem', ...style } as React.CSSProperties}
          className={cn('flex min-h-svh w-full', className)}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open } = useSidebar();
    return (
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden w-[--sidebar-width] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all md:flex',
          !open && '-translate-x-full',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = 'Sidebar';

// ─── SidebarInset ─────────────────────────────────────────────────────────────

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex min-h-svh flex-1 flex-col md:pl-[--sidebar-width]', className)}
      {...props}
    />
  )
);
SidebarInset.displayName = 'SidebarInset';

// ─── SidebarTrigger ───────────────────────────────────────────────────────────

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { open, setOpen } = useSidebar();
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn('h-7 w-7', className)}
        onClick={(e) => { setOpen(!open); onClick?.(e); }}
        {...props}
      >
        <PanelLeft />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  }
);
SidebarTrigger.displayName = 'SidebarTrigger';

// ─── Sections ─────────────────────────────────────────────────────────────────

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 p-3', className)} {...props} />
  )
);
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 p-3', className)} {...props} />
  )
);
SidebarFooter.displayName = 'SidebarFooter';

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-2 py-3 scrollbar-thin', className)}
      {...props}
    />
  )
);
SidebarContent.displayName = 'SidebarContent';

// ─── Group ────────────────────────────────────────────────────────────────────

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative flex flex-col gap-0.5', className)} {...props} />
  )
);
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-sidebar-foreground/50',
        className
      )}
      {...props}
    />
  )
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-0.5', className)} {...props} />
  )
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

// ─── Menu ─────────────────────────────────────────────────────────────────────

const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-col gap-0.5', className)} {...props} />
  )
);
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('relative', className)} {...props} />
  )
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild, isActive, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        data-active={isActive}
        className={cn(
          'relative flex w-full items-center rounded-sm px-3 py-1.5 text-[13px] tracking-body-sm leading-5 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring',
          isActive
            ? 'text-sidebar-primary font-medium before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:rounded-full before:bg-sidebar-primary'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

// ─── Sub-menu ─────────────────────────────────────────────────────────────────

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-sidebar-border pl-3', className)}
      {...props}
    />
  )
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ ...props }, ref) => <li ref={ref} {...props} />
);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

interface SidebarMenuSubButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  isActive?: boolean;
}

const SidebarMenuSubButton = React.forwardRef<HTMLAnchorElement, SidebarMenuSubButtonProps>(
  ({ asChild, isActive, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref as React.Ref<HTMLAnchorElement>}
        data-active={isActive}
        className={cn(
          'relative flex w-full items-center rounded-sm px-3 py-1.5 text-[13px] tracking-body-sm leading-5 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring',
          isActive
            ? 'text-sidebar-primary font-medium before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:rounded-full before:bg-sidebar-primary'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
  useSidebar,
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
};
