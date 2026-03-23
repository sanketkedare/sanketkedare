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
  metadataBase: new URL('https://www.sanketkedare.com'),
  title: {
    default: 'Sanket Kedare | Full Stack Web Developer',
    template: '%s | Sanket Kedare'
  },
  description: 'Portfolio of Sanket Kedare, a Full Stack Developer specializing in the MERN stack and Next.js. Architecting scalable, high-performance web applications.',
  keywords: [
    'Sanket Kedare', 
    'Full Stack Developer', 
    'MERN Stack Developer', 
    'Next.js Developer', 
    'React Developer', 
    'Web Developer Pune',
    'Software Engineer'
  ],
  authors: [{ name: 'Sanket Kedare', url: 'https://www.sanketkedare.com' }],
  creator: 'Sanket Kedare',
  publisher: 'Sanket Kedare',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.sanketkedare.com',
    title: 'Sanket Kedare | Full Stack Web Developer',
    description: 'Specializing as a Full Stack Developer based in India, I architect and engineer robust, high-performance applications leveraging the MERN stack and Next.js.',
    siteName: 'Sanket Kedare',
    images: [{
      url: '/hero.jpg',
      width: 1200,
      height: 630,
      alt: 'Sanket Kedare - Full Stack Developer'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanket Kedare | Full Stack Web Developer',
    description: 'Architecting scalable, high-performance applications using the MERN stack and Next.js.',
    images: ['/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-[family-name:var(--font-inter)] bg-slate-50 dark:bg-[#050511] text-slate-800 dark:text-slate-300 antialiased min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-white transition-colors duration-500`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="sanket-portfolio-theme">
          <AntdRegistry>
            <Sidebar />
            <Navbar />
            {children}
            <Footer />
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
