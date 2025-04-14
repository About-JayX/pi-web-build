import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 在构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  // 确保不使用静态导出
  output: 'standalone'
}

export default nextConfig
