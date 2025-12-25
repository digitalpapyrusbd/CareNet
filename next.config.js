/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  
  // Enable Turbopack configuration to satisfy Next 16
  turbopack: {},
  
  // Ignore TypeScript errors during production build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
    CDN_URL: process.env.CDN_URL || '',
    CDN_ENABLED: process.env.CDN_ENABLED || 'false',
  },
  
  // Image optimization with CDN
  images: {
    domains: process.env.CDN_ENABLED === 'true' && process.env.CDN_URL
      ? [new URL(process.env.CDN_URL).hostname]
      : [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';",
          },
        ],
      },
      // Cache headers for static assets
      {
        source: '/_next/static/(.*)',
        headers: process.env.CDN_ENABLED === 'true' ? [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-CDN-Cache-Status',
            value: 'HIT',
          },
        ] : [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enhance webpack configuration
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    return config;
  },
  
  // Output configuration
  output: 'standalone',
  
  // Compression
  compress: true,
  
  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
  
  // Internationalization (App Router: configure per-route instead of next.config.js)
};


module.exports = nextConfig;