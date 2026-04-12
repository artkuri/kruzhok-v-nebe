import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Replace eval-based source maps with CSP-compatible ones
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};

export default nextConfig;
