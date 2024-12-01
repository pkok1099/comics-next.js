/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'komikindo.wtf',
      '127.0.0.1',
      'doujindesu.tv',
    ], // Tambahkan domain di sini
  },
};

export default nextConfig;
