'use client';

import { ReactNode } from 'react';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <CartProvider>
        <QueryProvider>{children}</QueryProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
