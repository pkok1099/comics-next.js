/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Mengizinkan semua domain dengan protokol HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // Mengizinkan semua domain dengan protokol HTTP
      },
    ],
  },
};

export default nextConfig;
