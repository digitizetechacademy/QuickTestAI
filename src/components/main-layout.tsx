'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { BrainCircuit, History, Home, LogOut, PanelLeft, Briefcase, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isQuizOpen, setIsQuizOpen] = React.useState(pathname === '/' || pathname === '/history' || pathname === '/jobs');


  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

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
            <Collapsible open={isQuizOpen} onOpenChange={setIsQuizOpen} className="w-full">
              <SidebarMenuItem>
                 <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Home />
                      <span>Quiz Section</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </SidebarMenuButton>
                 </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenuSub>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/'}>
                            <Link href="/">
                                <span>New Quiz</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/history'}>
                            <Link href="/history">
                                <span>Quiz History</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/jobs'}>
                            <Link href="/jobs">
                                <span>Upcoming Jobs</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL || undefined} alt="User" />
              <AvatarFallback>
                {user?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">
                {user?.displayName || 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                    {user?.email || ''}
                </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut />
            </Button>
          </div>
        </SidebarFooter>
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
