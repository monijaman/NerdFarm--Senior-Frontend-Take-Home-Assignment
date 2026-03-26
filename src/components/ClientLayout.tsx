'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Header />
      {children}
    </ErrorBoundary>
  );
}
