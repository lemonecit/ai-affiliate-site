/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images-na.ssl-images-amazon.com', 'ae01.alicdn.com', 'm.media-amazon.com'],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AMAZON_ACCESS_KEY: process.env.AMAZON_ACCESS_KEY,
    AMAZON_SECRET_KEY: process.env.AMAZON_SECRET_KEY,
    AMAZON_ASSOCIATE_TAG: process.env.AMAZON_ASSOCIATE_TAG,
    ALIEXPRESS_APP_KEY: process.env.ALIEXPRESS_APP_KEY,
    ALIEXPRESS_SECRET_KEY: process.env.ALIEXPRESS_SECRET_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig
