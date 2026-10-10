import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { PreferencesProvider } from '@/lib/preferences-context';
import { PwaProvider } from '@/components/pwa/PwaProvider';
import { SplashScreen } from '@/components/ui/SplashScreen';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0D11' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'KanbanEx - Vos projets. Une seule vision.',
  description:
    'Plateforme collaborative premium KanbanEx. Vue panoramique signature Projects Overview, Kanban agile, Gantt interactif et calendrier unifié.',
  applicationName: 'KanbanEx',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KanbanEx',
    startupImage: [
      {
        url: '/images/kanbanex-mobile.jpg',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KanbanEx" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0D11] dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <PreferencesProvider>
          <PwaProvider>
            <SplashScreen />
            <AuthProvider>{children}</AuthProvider>
          </PwaProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
