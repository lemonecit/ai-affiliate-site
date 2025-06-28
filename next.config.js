/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images-na.ssl-images-amazon.com', 'ae01.alicdn.com', 'm.media-amazon.com'],
  },
}

module.exports = nextConfig
