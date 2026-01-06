'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TranslationProvider } from './TranslationProvider';
import { ThemeProvider } from './ThemeProvider';

interface ClientProvidersProps {
  children: ReactNode;
  locale?: string;
}

export default function ClientProviders({ children, locale }: ClientProvidersProps) {
  // Create QueryClient instance only once using useState
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TranslationProvider initialLocale={locale as any}>
          {children}
        </TranslationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}