import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Product Dashboard',
  description:
    'Product inventory dashboard with search, filter, and cart functionality',
  icons: {
    icon: '/fav/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <QueryProvider>
              <Header />
              {children}
            </QueryProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
