'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Bookmark, PlusCircle, Moon, Sun, Compass } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onOpenIndexModal?: () => void;
  savedCount?: number;
}

function useIsMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function Header({ onOpenIndexModal, savedCount = 0 }: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Left Group: Logo & Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-6 h-6 bg-zinc-900 dark:bg-zinc-100 rounded flex items-center justify-center text-white dark:text-black">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                ContentFinder
              </span>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              Discover
            </Link>
            <Link
              href="/collections"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname === '/collections'
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              Collections
              {savedCount > 0 && (
                <Badge variant="secondary" className="px-1 py-0 h-4 min-w-[16px] flex items-center justify-center rounded bg-zinc-200 dark:bg-zinc-800 text-[9px] text-zinc-900 dark:text-zinc-100 border-none">
                  {savedCount}
                </Badge>
              )}
            </Link>
          </nav>
        </div>

        {/* Right Group: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Nav Links (Compact) */}
          <nav className="flex sm:hidden items-center gap-3 mr-2">
            <Link
              href="/"
              className={`text-zinc-500 dark:text-zinc-400 ${pathname === '/' ? 'text-zinc-900 dark:text-zinc-100' : ''}`}
            >
              <Compass className="w-4 h-4" />
            </Link>
            <Link
              href="/collections"
              className={`relative text-zinc-500 dark:text-zinc-400 ${pathname === '/collections' ? 'text-zinc-900 dark:text-zinc-100' : ''}`}
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3 h-3 flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-full text-[8px] font-bold">
                  {savedCount}
                </span>
              )}
            </Link>
          </nav>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}

          <Button
            onClick={onOpenIndexModal}
            className="h-8 px-3 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-md shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            Index Link
          </Button>
        </div>
      </div>
    </header>
  );
}
