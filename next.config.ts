import type { NextConfig } from "next";
import { OBRAS_VERSION } from "./src/lib/obras";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1280, 1600, 1920, 2400],
    // Las fotos de /obras llevan ?v=N para que un cambio de foto no quede en caché
    localPatterns: [
      { pathname: "/obras/**", search: `?v=${OBRAS_VERSION}` },
      { pathname: "/**", search: "" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(obras|img)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
