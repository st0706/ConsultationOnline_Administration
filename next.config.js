// @ts-check
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"]
  },
  images: {
    domains: ["localhost", "anphat-consultation.vercel.app"]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  async redirects() {
    return [
      {
        source: "/consultation",
        destination: "/consultation/appointment",
        permanent: false
      }
    ];
  }
};

module.exports = nextConfig;
