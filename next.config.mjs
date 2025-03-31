/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    // Add any experimental flags if needed
  },
  typescript: {
    ignoreBuildErrors: true, // Optional: use during early development/pre-release
  },
};

export default nextConfig;
