import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {},
  allowedDevOrigins: [
    'https://6000-firebase-studio-1756951519134.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev',
    'https://quicktestai.vercel.app',
  ],
};

export default nextConfig;
