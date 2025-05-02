/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "https://whiskygoogles.onrender.com/api/:path*",
      }
    ];
  },
  images: {
    domains: ['localhost', 'whiskygoogles.onrender.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/downloaded_images/**',
      },
      {
        protocol: 'https',
        hostname: 'whiskygoogles.onrender.com',
        port: '',
        pathname: '/downloaded_images/**',
      },
    ],
    unoptimized: true
  },
};

module.exports = nextConfig;
