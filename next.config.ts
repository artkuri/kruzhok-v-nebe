import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: { unoptimized: true },
  webpack: (config, { dev }) => {
    if (dev) {
      // Replace eval-based source maps with CSP-compatible ones
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};

export default nextConfig;
