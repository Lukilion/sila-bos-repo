import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Only enable standalone output when explicitly requested in docker/custom container environments.
  // In Vercel, standalone mode prevents Vercel CLI from tracing .next/next-server.js.nft.json causing ENOENT build errors.
  ...(process.env.NEXT_OUTPUT_STANDALONE === "true" ? { output: "standalone" } : {}),
};

export default withNextIntl(nextConfig);

