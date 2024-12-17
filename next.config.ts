import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos"], // Add external domains here
  },
  trailingSlash: false, // Ensure clean routes without trailing slashes
  reactStrictMode: true, // Enable React strict mode
};

export default nextConfig;