/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'pub-your-r2-bucket.r2.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  // Webpack configuration to handle Node.js modules in client-side code
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallbacks for Node.js modules that shouldn't be used in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        'firebase-admin': false,
        'firebase-admin/app': false,
        'firebase-admin/firestore': false,
      }
    }
    return config
  },
}

export default nextConfig
