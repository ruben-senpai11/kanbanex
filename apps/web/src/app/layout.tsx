import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { PreferencesProvider } from '@/lib/preferences-context';
import { SplashScreen } from '@/components/ui/SplashScreen';

export const metadata: Metadata = {
  title: 'KabanEx - Vos projets. Une seule vision.',
  description:
    'Plateforme collaborative premium KabanEx. Vue panoramique signature Projects Overview, Kanban agile, Gantt interactif et calendrier unifié.',
  icons: {
    icon: '/images/kabanex-logo.jpg',
    apple: '/images/kabanex-logo.jpg',
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
