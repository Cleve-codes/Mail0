'use client';

import { CommandPaletteProvider } from '@/components/context/command-palette-context';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { dexieStorageProvider } from '@/lib/idb';
import { SWRConfig } from 'swr';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HotkeysProvider>
      <CommandPaletteProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <SWRConfig
            value={{
              provider: typeof window !== 'undefined' ? dexieStorageProvider : undefined,
              revalidateOnFocus: false,
              revalidateIfStale: false,
              shouldRetryOnError: false,
            }}
          >
            {children}
          </SWRConfig>
        </div>
      </CommandPaletteProvider>
    </HotkeysProvider>
  );
}
