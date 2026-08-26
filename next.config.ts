import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autocontido para Docker/Cloud Run (gera .next/standalone/server.js).
  output: "standalone",
};

export default nextConfig;
