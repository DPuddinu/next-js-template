import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-8 pt-2 md:p-8">
                <Navbar />
                {children}
              </main>
            </div>
            <Toaster richColors />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
