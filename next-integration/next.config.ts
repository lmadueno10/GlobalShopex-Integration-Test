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

  async headers() {
    return [
      {
        // CSP relajada SOLO para el checkout (iframe)
        source: "/shopping-cart-international-form",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "frame-src http://testsrv.globalshopex.com",
              "form-action http://testsrv.globalshopex.com",
              "connect-src 'self' http://testsrv.globalshopex.com",
              "script-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
