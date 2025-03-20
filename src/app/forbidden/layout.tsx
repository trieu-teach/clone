import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Forbidden',
  description: 'You do not have permission to access this page.',
};

interface ForbiddenLayoutProps {
  children: React.ReactNode;
}

export default function ForbiddenLayout({ children }: ForbiddenLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}