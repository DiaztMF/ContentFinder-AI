'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: 'bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-xl rounded-xl text-sm font-medium',
      }}
    />
  );
}
