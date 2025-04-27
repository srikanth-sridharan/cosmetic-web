/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline'",
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during the build process
  },
};

module.exports = nextConfig;
