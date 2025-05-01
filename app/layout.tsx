import { ReactNode } from 'react';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>WhiskeyGoggles</title>
        <meta name="description" content="WhiskeyGoggles is a whiskey bottle identification app that helps you discover similar options." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}