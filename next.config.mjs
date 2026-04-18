/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  /** Menší Node image na Render / Docker (`next start` funguje stejně). */
  output: "standalone",
};

export default nextConfig;
