import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Content Finder AI — Smart Semantic Search & Discovery Engine',
  description: 'AI-Powered Content Search & Discovery Engine for indexing, summarizing, and semantically discovering web content, articles, videos, and documentation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 antialiased font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative min-h-screen flex flex-col justify-between">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
