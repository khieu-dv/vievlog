import type { NextConfig } from "next";

const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.githubassets.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "**.digitaloceanspaces.com" },
      { protocol: "https", hostname: "api.github.com" },
      { protocol: "https", hostname: "**.vievlog.com" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    turbo: {
      resolveAlias: {
        "~": "./src",
      },
    },
  },
} satisfies NextConfig;

export default nextConfig;
