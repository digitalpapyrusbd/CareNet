'use client';

import { ReactNode } from 'react';
import { TranslationProvider } from './TranslationProvider';
import { ThemeProvider } from './ThemeProvider';

interface ClientProvidersProps {
  children: ReactNode;
  locale?: string;
}

export default function ClientProviders({ children, locale }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <TranslationProvider initialLocale={locale as any}>
        {children}
      </TranslationProvider>
    </ThemeProvider>
  );
}