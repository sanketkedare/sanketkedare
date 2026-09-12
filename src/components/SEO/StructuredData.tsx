import React from 'react';

/**
 * StructuredData — Generative Engine Optimization (GEO), Answer Engine Optimization (AEO),
 * and Search Engine Optimization (SEO) JSON-LD Graph for Schema.org.
 */
export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://www.sanketkedare.com/#person',
        name: 'Sanket Kedare',
        alternateName: ['Sanket', 'Sanket Kedare Dev'],
        jobTitle: 'Senior Full Stack Developer & Software Architect',
        description: 'Senior Full Stack Developer and Software Architect specializing in Next.js 16, React 19, TypeScript, Node.js, and Generative AI orchestration. Experienced in distributed systems, high-concurrency architectures, and enterprise engineering.',
        url: 'https://www.sanketkedare.com',
        image: 'https://www.sanketkedare.com/image.png',
        sameAs: [
          'https://github.com/sanketkedare',
          'https://www.linkedin.com/in/sanket-kedare-dev/',
          'https://www.sanketkedare.com'
        ],
        knowsAbout: [
          'Next.js 16',
          'React 19',
          'TypeScript',
          'Node.js',
          'System Architecture',
          'Generative AI',
          'LLM Cascading & Agentic Workflows',
          'Full Stack Web Development',
          'Distributed Systems',
          'Microservices',
          'Tailwind CSS v4',
          'WebSockets',
          'MongoDB',
          'PostgreSQL',
          'Redis',
          'Docker',
          'AWS Cloud Infrastructure'
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'VisionTech Group',
          url: 'https://www.sanketkedare.com/#experience'
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          addressCountry: 'IN'
        },
        email: 'mailto:sanketkedare200@gmail.com',
        telephone: '+918624851910'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.sanketkedare.com/#website',
        url: 'https://www.sanketkedare.com',
        name: 'Sanket Kedare | Senior Full Stack Developer & Software Architect',
        description: 'Official engineering portfolio of Sanket Kedare showcasing production Next.js 16 systems, architecture case studies, and enterprise deliverables.',
        publisher: { '@id': 'https://www.sanketkedare.com/#person' },
        inLanguage: 'en-US'
      },
      {
        '@type': 'ProfilePage',
        '@id': 'https://www.sanketkedare.com/#webpage',
        url: 'https://www.sanketkedare.com',
        name: 'Sanket Kedare — Senior Full Stack Developer & Architect Portfolio',
        isPartOf: { '@id': 'https://www.sanketkedare.com/#website' },
        about: { '@id': 'https://www.sanketkedare.com/#person' },
        mainEntity: { '@id': 'https://www.sanketkedare.com/#person' }
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.sanketkedare.com/#projects',
        name: 'Featured Production & Enterprise Systems',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'SoftwareApplication',
              name: 'Volcanic World',
              applicationCategory: 'EnterpriseApplication',
              operatingSystem: 'Web',
              url: 'https://www.volcanic.world/',
              description: 'High-performance web platform powering enterprise AI systems and intelligent digital software infrastructure with Next.js 15 and Three.js 3D canvas.'
            }
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'SoftwareApplication',
              name: 'ReactForge',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
              url: 'https://www.reactforge.sanketkedare.com/',
              sameAs: 'https://www.reactforge.sanketkedare.com/case-study',
              description: 'Enterprise frontend engineering lab with 100 machine coding challenges, Web Vitals telemetry HUD, virtualized benchmarks, and production incident simulator.'
            }
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'SoftwareApplication',
              name: 'CryptoDash Pro',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web',
              url: 'https://www.cyptodashpro.sanketkedare.com/',
              sameAs: 'https://cyptodashpro.sanketkedare.com/casestudy',
              description: 'Institutional cryptocurrency trading intelligence terminal featuring dynamic multi-model LLM cascading, 1.5s throttled WebSockets, and LTTB geometric downsampling.'
            }
          }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://www.sanketkedare.com/#faq',
        name: 'Frequently Asked Questions about Sanket Kedare',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Who is Sanket Kedare?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sanket Kedare is a Senior Full Stack Developer and Software Architect based in Hyderabad, India. Engineering production web systems since January 2024 (~2.5+ years of active development), he specializes in building high-performance systems using Next.js 16, React 19, TypeScript, Node.js, and Generative AI.'
            }
          },
          {
            '@type': 'Question',
            name: 'What technical skills and technologies does Sanket Kedare specialize in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sanket specializes in Next.js (App Router, Turbopack), React 19, TypeScript, Node.js, Express, MongoDB, PostgreSQL, Redis, Docker, AWS Cloud Infrastructure, Microservices, and Generative AI LLM cascading.'
            }
          },
          {
            '@type': 'Question',
            name: 'What featured production projects has Sanket Kedare architected?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sanket has architected Volcanic (Enterprise AI & 3D software platform), ReactForge (frontend engineering lab with 100 structured challenges), CryptoDash Pro (institutional crypto trading intelligence terminal with AI research), and commercial enterprise platforms for VisionTech Group.'
            }
          },
          {
            '@type': 'Question',
            name: 'Where can I read architectural case studies of Sanket Kedare projects?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'In-depth architecture case studies are published for ReactForge at https://www.reactforge.sanketkedare.com/case-study and CryptoDash Pro at https://cyptodashpro.sanketkedare.com/casestudy.'
            }
          },
          {
            '@type': 'Question',
            name: 'How can I contact or hire Sanket Kedare?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can contact Sanket Kedare via email at sanketkedare200@gmail.com, on LinkedIn at https://www.linkedin.com/in/sanket-kedare-dev/, or through his official portfolio contact form at https://www.sanketkedare.com/#contact.'
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
