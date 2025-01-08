import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.dmcdn.net',
        port: '',
        pathname: '/v/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 's1.dmcdn.net',
        port: '',
        pathname: '/v/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
