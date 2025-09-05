
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { BrainCircuit, PanelLeft, Briefcase, Home, Book, Newspaper } from 'lucide-react';
import { Button } from './ui/button';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <BrainCircuit className="w-6 h-6 text-primary" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Quick Test AI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/jobs'}>
                <Link href="/jobs">
                  <Briefcase />
                  <span>Upcoming Jobs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/current-affairs'}>
                    <Link href="/current-affairs">
                        <Newspaper />
                        <span>Current Affairs</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/library'}>
                <Link href="/library">
                  <Book />
                  <span>Library</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/'}>
                <Link href="/">
                  <Home />
                  <span>Quiz</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:hidden">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="">Quick Test AI</span>
            </Link>
            <SidebarTrigger>
                <PanelLeft />
                <span className="sr-only">Toggle Menu</span>
            </SidebarTrigger>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
