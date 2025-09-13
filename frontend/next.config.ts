import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: any) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
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
  // ✅ REMOVE THE REWRITES - They're causing conflicts in production
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
