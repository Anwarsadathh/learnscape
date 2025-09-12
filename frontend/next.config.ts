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
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      { 
        source: '/api/:path*', 
        destination: 'http://localhost:5000/api/:path*' 
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Completely disable the development indicator
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right' as const,
  },
};

export default nextConfig;