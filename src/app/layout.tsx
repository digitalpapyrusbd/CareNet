import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientProviders from '@/components/providers/ClientProviders';
import { TranslationProvider } from '@/components/providers/TranslationProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ServiceWorkerRegistration } from '@/components/providers/ServiceWorkerRegistration';
import { TouchTargetAuditPanel } from '@/hooks/use-touch-audit';
import { PerformanceMonitoring } from '@/components/performance/PerformanceMonitoring';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'CaregiverBD - Professional Caregiver Services in Bangladesh',
    template: '%s | CaregiverBD'
  },
  description: 'Connect with professional caregivers in Bangladesh. Find verified caregivers, manage patient care, and access comprehensive healthcare services.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CaregiverBD',
  },
  applicationName: 'Caregiver Platform Bangladesh',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00AEEF' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e0e' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PerformanceMonitoring />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      
      <body className={`${inter.className} antialiased min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <ServiceWorkerRegistration />
        <ThemeProvider>
          <TranslationProvider>
            <ClientProviders>
              {/* Main content wrapper */}
              <div id="main-content" className="min-h-screen flex flex-col">
                {children}
              </div>
            </ClientProviders>
          </TranslationProvider>
        </ThemeProvider>
        {/* Touch Target Audit Tool (Development Only) */}
        <TouchTargetAuditPanel />
      </body>
    </html>
  );
}