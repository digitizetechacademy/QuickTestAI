
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BrainCircuit,
  Briefcase,
  Book,
  Newspaper,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import { useTranslation } from '@/hooks/use-translation';


const navItems = [
  { href: '/', icon: Briefcase, labelKey: 'nav_jobs' },
  { href: '/current-affairs', icon: Newspaper, labelKey: 'nav_affairs' },
  { href: '/quiz', icon: BrainCircuit, labelKey: 'nav_quiz' },
  { href: '/library', icon: Book, labelKey: 'nav_library' },
  { href: '/results', icon: ClipboardList, labelKey: 'nav_results' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center justify-between border-b px-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="">{t('app_title')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 pb-24">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur-sm z-10">
        <nav className="h-full">
          <ul className="grid h-full grid-cols-5">
            {navItems.map((item) => (
              <li key={item.href} className="h-full">
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{t(item.labelKey)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </footer>
    </div>
  );
}
