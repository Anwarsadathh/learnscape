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
  },
  async rewrites() {
    return [
      { 
        source: '/api/:path*', 
        destination: 'http://localhost:6667/api/:path*'
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
