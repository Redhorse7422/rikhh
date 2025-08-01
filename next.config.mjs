/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // env: {
  //   TEMPLATE: process.env.TEMPLATE,
  // },
  // rewrites: async () => {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `/api/:path*`,
  //     },
  //     {
  //       source: '/:path*',
  //       destination: `/${process.env.TEMPLATE}/:path*`,
  //     },
  //   ]
  // },
  // Only use standalone output for production builds
  // ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  // outputFileTracingRoot: process.cwd(),
  // ...(process.env.SEPARATE_BUILD === 'true' && process.env.TEMPLATE !== ''
  //   ? { distDir: `.next-${process.env.TEMPLATE}` }
  //   : {}),

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.firebasestorage.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rikhh-9d30a.firebasestorage.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rikhh-9d30a.appspot.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    // Allow unoptimized images for Firebase Storage URLs to avoid issues
    unoptimized: false,
    // Increase image quality
    // quality: 85,
    // Add domains for better compatibility
    domains: [
      'firebasestorage.googleapis.com',
      'rikhh-9d30a.firebasestorage.app',
      'rikhh-9d30a.appspot.com'
    ],
  },
}

export default nextConfig
