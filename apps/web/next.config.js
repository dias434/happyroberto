/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: true
  },
  images: {
    remotePatterns: []
  }
};

module.exports = nextConfig;
