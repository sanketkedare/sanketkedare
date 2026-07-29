import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.indianexpress.com' },
      { protocol: 'https', hostname: 'bs-uploads.toptal.io' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 'blog.vantagecircle.com' },
      { protocol: 'https', hostname: 'almablog-media.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'clipart-library.com' },
    ],
  },
};

export default nextConfig;
