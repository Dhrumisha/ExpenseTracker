import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo also has a root package-lock.json (for the convenience
  // `npm run dev` that starts both apps), which otherwise makes Next.js
  // guess the workspace root incorrectly. Pin it to this app explicitly.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
