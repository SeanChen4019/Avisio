import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/drawio/",
        destination: "/drawio/index.html",
      },
    ];
  },
};

export default nextConfig;
