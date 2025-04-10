/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ปิด ESLint ระหว่าง build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // ใช้ port default (443) สำหรับ HTTPS
        pathname: "/dkhahzgfn/image/upload/**", // เฉพาะ Cloudinary account ของคุณ
      },
    ],
  },
};

export default nextConfig;