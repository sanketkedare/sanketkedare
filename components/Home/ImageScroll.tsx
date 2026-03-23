'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Tech logo imports
import bootstrapImg from '@/src/images/bootstrap.png';
import expressjsImg from '@/src/images/expressjs.png';
import javaImg from '@/src/images/java.png';
import jsImg from '@/src/images/js.png';
import mariadbImg from '@/src/images/mariadb.png';
import mongoDbImg from '@/src/images/mongodb.png';
import nextjsImg from '@/src/images/nextjs.png';
import nodejsImg from '@/src/images/nodejs.png';
import reactImg from '@/src/images/reactjs.png';
import springbootImg from '@/src/images/springboot.png';
import tailwindImg from '@/src/images/tailwind.png';

const sliderVarients = {
  initial: { x: 0 },
  animate: {
    x: '-60%',
    transition: { repeat: Infinity, repeatType: 'mirror' as const, duration: 20 },
  },
};

const images = [
  { src: bootstrapImg,  alt: 'Bootstrap'  },
  { src: expressjsImg,  alt: 'Express.js' },
  { src: javaImg,       alt: 'Java'       },
  { src: jsImg,         alt: 'JavaScript' },
  { src: mariadbImg,    alt: 'MariaDB'    },
  { src: mongoDbImg,    alt: 'MongoDB'    },
  { src: nextjsImg,     alt: 'Next.js'    },
  { src: nodejsImg,     alt: 'Node.js'    },
  { src: reactImg,      alt: 'React'      },
  { src: springbootImg, alt: 'SpringBoot' },
  { src: tailwindImg,   alt: 'Tailwind'   },
];

export default function ImageScroll() {
  return (
    <motion.div
      variants={sliderVarients}
      className="slidingTextContainer text-[5vh] bottom-[-140px] w-[100%] gap-5 bg-transparent grid justify-end lg:opacity-100 opacity-15 px-6"
      initial="initial"
      animate="animate"
    >
      {images.map((img) => (
        <Image
          key={img.alt}
          src={img.src}
          alt={img.alt}
          width={48}
          height={48}
          className="bg-transparent"
        />
      ))}
    </motion.div>
  );
}
