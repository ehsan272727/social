import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.101"],
  images: {
    remotePatterns: [
      new URL("https://social-app.s3-website.ir-thr-at1.arvanstorage.ir/**"),
    ],
  },
};

export default nextConfig;
