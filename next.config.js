import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Force webpack to use the correct Prisma Client location
    config.resolve.alias = {
      ...config.resolve.alias,
      '@prisma/client': require.resolve('@prisma/client'),
    };
    return config;
  },
};

export default config;
