/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits .next/standalone — a self-contained server bundle the Docker runner
  // stage copies, so the image ships without node_modules or the build toolchain.
  output: 'standalone',
};

export default nextConfig;
