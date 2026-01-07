import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/ShoppingCartInternational.html',
        destination: '/result',
      },
    ];
  },
};

export default nextConfig;
