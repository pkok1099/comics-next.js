import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from './components/sidebar';
import Header from './components/header';
import { SidebarProvider } from './contexts/SidebarContext';
import { SidebarToggle } from './components/sidebar-toggle';
import { Suspense, ReactNode } from 'react';
import { geistSans, geistMono } from './font';
import { metadata, generateViewport } from './metaConfig';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='description' content={metadata.description} />
        <meta name='keywords' content={metadata.keywords} />
        <meta name='author' content={metadata.author} />
        <meta name='viewport' content={generateViewport().viewport} />
        <meta name='robots' content={metadata.robots} />
        <title>{metadata.title}</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className='flex h-screen'>
              <Sidebar />
              <div className='flex flex-1 flex-col overflow-hidden'>
                <Header>
                  <SidebarToggle />
                </Header>
                <main className='flex-1 overflow-y-auto overflow-x-hidden bg-background'>
                  <Suspense>{children}</Suspense>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
