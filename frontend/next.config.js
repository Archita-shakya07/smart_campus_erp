/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Added for optimal Netlify deployment
  turbopack: {},
}

module.exports = nextConfig
