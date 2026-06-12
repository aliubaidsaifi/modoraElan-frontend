/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.blogspot.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
};
module.exports = nextConfig;
