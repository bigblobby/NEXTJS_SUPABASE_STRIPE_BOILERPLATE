'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system">
      {children}
    </NextThemeProvider>
  );
}