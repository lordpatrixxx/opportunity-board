import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata: Metadata = {
  title: 'Opportunity Board — Discover Internships, Hackathons & Fellowships',
  description:
    'The centralized discovery platform for student opportunities with absolute deadline clarity. Discover, track, and apply to top internships, hackathons, and research fellowships.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
