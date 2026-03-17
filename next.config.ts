import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    cacheComponents: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qoynstvdggbsfasskawd.supabase.co",
        port: '',
        pathname: "/storage/v1/object/public/photos/**",
      }
    ],
  },
};

export default nextConfig;
