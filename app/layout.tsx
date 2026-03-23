import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import AntdRegistry from './AntdRegistry';
import { ThemeProvider } from '@/components/ThemeProvider';

import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Sanket Kedare | Full Stack Web Dev',
  description:
    'MERN Full Stack Developer portfolio — React, Next.js, Node.js, MongoDB. Based in Pune, Maharashtra, India.',
  keywords: ['Full Stack Developer', 'MERN', 'React', 'Next.js', 'Sanket Kedare'],
  authors: [{ name: 'Sanket Kedare', url: 'https://github.com/sanketkedare' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" style={{ scrollPaddingTop: '100px' }} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-[family-name:var(--font-inter)] bg-slate-50 dark:bg-[#050511] text-slate-800 dark:text-slate-300 antialiased min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-white transition-colors duration-500`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="sanket-portfolio-theme">
          <AntdRegistry>
            <Navbar />
            <Sidebar />
            {children}
            <Footer />
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
