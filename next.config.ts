import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Turbopack is the default in Next.js 16.
  // GLSL shaders are inlined as template literals — no loader required.
  turbopack: {},
};

export default nextConfig;
