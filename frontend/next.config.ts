import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['lucide-react'],
  images: {
    domains: ['localhost', 'learnscapeedu.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'learnscapeedu.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '6667',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
