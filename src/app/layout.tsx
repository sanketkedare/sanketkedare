import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '@/styles/globals.css';
import AntdRegistry from '@/components/providers/AntdRegistry';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';

import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer/Footer';
import ServiceWorkerRegister from '@/components/Pwa/ServiceWorkerRegister';
import StructuredData from '@/components/SEO/StructuredData';
import ChatWidget from '@/components/Chat/ChatWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050511' },
    { media: '(prefers-color-scheme: light)', color: '#050511' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sanketkedare.com'),
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sanket Kedare',
  },
  title: {
    default: 'Sanket Kedare | Senior Full Stack Developer & Software Architect',
    template: '%s | Sanket Kedare'
  },
  description: 'Portfolio of Sanket Kedare — Senior Full Stack Developer & Software Architect specializing in Next.js 16, React 19, TypeScript, Node.js, and GenAI systems. Explore production platforms, architecture case studies, and enterprise deliverables.',
  keywords: [
    'Sanket Kedare', 
    'Senior Full Stack Developer', 
    'Software Architect',
    'Frontend Architect',
    'Full Stack Engineer', 
    'Next.js 16 Developer', 
    'React 19 Engineer', 
    'TypeScript Developer',
    'Node.js Architect',
    'GenAI Engineer',
    'Generative AI LLM Systems',
    'ReactForge Case Study',
    'CryptoDash Pro Case Study',
    'Volcanic World',
    'Full Stack Developer Hyderabad',
    'Full Stack Developer India',
    'MERN Stack Developer',
    'Microservices Architecture',
    'Docker AWS DevOps'
  ],
  authors: [{ name: 'Sanket Kedare', url: 'https://www.sanketkedare.com' }],
  creator: 'Sanket Kedare',
  publisher: 'Sanket Kedare',
  category: 'technology',
  classification: 'Software Engineering & Architecture Portfolio',
  icons: {
    icon: '/image.png',
    shortcut: '/image.png',
    apple: '/image.png',
  },
  alternates: {
    canonical: 'https://www.sanketkedare.com',
  },
  openGraph: {
    type: 'profile',
    firstName: 'Sanket',
    lastName: 'Kedare',
    username: 'sanketkedare',
    gender: 'male',
    locale: 'en_US',
    url: 'https://www.sanketkedare.com',
    title: 'Sanket Kedare | Senior Full Stack Developer & Software Architect',
    description: 'Portfolio of Sanket Kedare — Senior Full Stack Developer & Software Architect specializing in Next.js 16, React 19, TypeScript, Node.js, and GenAI systems.',
    siteName: 'Sanket Kedare Portfolio',
    images: [{
      url: '/image.png',
      width: 1200,
      height: 630,
      alt: 'Sanket Kedare — Senior Full Stack Developer & Software Architect',
      type: 'image/png',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanket Kedare | Senior Full Stack Developer & Software Architect',
    description: 'Senior Full Stack Developer & Software Architect specializing in Next.js 16, React 19, TypeScript, Node.js, and GenAI systems.',
    images: ['/image.png'],
    creator: '@sanketkedare',
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
  other: {
    'geo.region': 'IN-TG',
    'geo.placename': 'Hyderabad',
    'geo.position': '17.3850;78.4867',
    'ICBM': '17.3850, 78.4867',
    'ai-content-declaration': 'author-verified',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <StructuredData />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                document.documentElement.style.colorScheme = 'dark';
                localStorage.setItem('theme', 'dark');
                localStorage.setItem('sanket-portfolio-theme', 'dark');
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} bg-[#050511] text-slate-300 antialiased min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-white`} suppressHydrationWarning>
        <ThemeProvider>
          <AntdRegistry>
            <Sidebar />
            <Navbar />
            {children}
            <Footer />
            <ChatWidget />
            <ServiceWorkerRegister />
            <Analytics />
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
