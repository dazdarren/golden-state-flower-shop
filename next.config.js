/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for Cloudflare Pages
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  experimental: {
    // No server actions in static export
  },
};

module.exports = nextConfig;
