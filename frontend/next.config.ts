import path from "path";
import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL;
if (!backendUrl) {
  // Surfaces misconfiguration loudly at build/runtime instead of every API
  // call silently 404ing.
  console.error(
    "BACKEND_URL is not set — API requests will fail. See .env.example."
  );
}

const nextConfig: NextConfig = {
  // The repo also has a root package-lock.json (for the convenience
  // `npm run dev` that starts both apps), which otherwise makes Next.js
  // guess the workspace root incorrectly. Pin it to this app explicitly.
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    if (!backendUrl) return [];
    // Proxy API calls through this app's own origin instead of the browser
    // calling the backend's domain directly. The backend sets the auth
    // cookies on whichever origin actually answers the request, so routing
    // through here (rather than a separate backend domain) is what lets
    // both the browser and our own middleware see the session cookie.
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
