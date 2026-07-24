'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Bookmark, PlusCircle, Moon, Sun, Compass } from 'lucide-react';
import { useTheme } from 'next-themes';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg sm:text-xl tracking-tight uppercase text-zinc-900 dark:text-zinc-100">
              ContentFinder AI
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-widest hidden sm:inline-block">
              Engine
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              pathname === '/'
                ? 'text-zinc-900 dark:text-zinc-100 font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </Link>

          <Link
            href="/collections"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
              pathname === '/collections'
                ? 'text-zinc-900 dark:text-zinc-100 font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Collections</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {savedCount}
              </span>
            )}
          </Link>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          )}

          {/* Submit / Index CTA button */}
          <button
            onClick={onOpenIndexModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 rounded-md font-semibold text-xs tracking-wide transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ INDEX LINK</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
