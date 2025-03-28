/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
      ignoreDuringBuilds: true, // ปิด ESLint ระหว่าง build
  },
};

export default nextConfig;