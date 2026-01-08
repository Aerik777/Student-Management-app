import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // New import
import { GeistMono } from 'geist/font/mono'; // New import
import 'tailwindcss';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'College Management System',
  description: 'Built with Next.js and NextAuth',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
