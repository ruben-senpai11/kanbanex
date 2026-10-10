import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { PreferencesProvider } from '@/lib/preferences-context';
import { SplashScreen } from '@/components/ui/SplashScreen';

export const metadata: Metadata = {
  title: 'KanbanEx - Vos projets. Une seule vision.',
  description:
    'Plateforme collaborative premium KanbanEx. Vue panoramique signature Projects Overview, Kanban agile, Gantt interactif et calendrier unifié.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/kanbanex-logo-small.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/kanbanex-logo.png', sizes: '256x256', type: 'image/png' },
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
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0D11] dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <PreferencesProvider>
          <SplashScreen />
          <AuthProvider>{children}</AuthProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
