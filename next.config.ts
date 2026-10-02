import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Articles are read from disk at request time (API routes, ISR), so ship them
  // inside every server function on serverless hosts such as Netlify or Vercel.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
};

export default nextConfig;
