/* src/app/layout.tsx */

import { ThemeProvider } from '@/components/theme-provider';
import { CloudProviderProvider } from '@/contexts/CloudProviderContext';
import { LanguageProvider, DEFAULT_LANGUAGE } from '@/i18n/LanguageContext';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import TableWrapper from '@/components/table-wrapper';
import NavigationProgress from '@/components/navigation-progress';

declare global {
  interface Window {
    // @ts-ignore
    gtag: any;
  }
}

const inter = Inter({ subsets: ['latin'] });

const description =
  'An essential resource for cloud developers, engineers, architects, and consultants seeking to understand Azure services. It provides links to Microsoft Learn documentation, examples of infrastructure as code using Terraform, Bicep, and ARM templates, as well as direct links to the Azure Portal for managing and deploying new resources.';

const previewImage =
  'https://azure-periodic-table.onwardplatforms.com/periodic-table.png';

// Declared through the Metadata API: `next/head` is not supported in the app
// directory and logs a warning at runtime.
export const metadata: Metadata = {
  title: 'The Azure Periodic Table',
  description,
  openGraph: {
    title: 'Azure Periodic Table',
    description,
    images: [{ url: previewImage, alt: 'The Azure Periodic Table' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Azure Periodic Table',
    description,
    images: [{ url: previewImage, alt: 'The Azure Periodic Table' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={DEFAULT_LANGUAGE} style={{ width: '100%' }}>
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ${process.env.GA_TRACKING_ID});
        `}
      </Script>
      <body className={inter.className} style={{ width: '100%' }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <NavigationProgress />
            <CloudProviderProvider>
              <TableWrapper>
                <>{children}</>
              </TableWrapper>
            </CloudProviderProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
