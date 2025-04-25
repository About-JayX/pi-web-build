/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // 在构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在构建时忽略 TypeScript 错误
    ignoreBuildErrors: true,
  },
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
      stream: false,
      crypto: false,
      // You might also need these fallbacks
      path: false,
      os: false,
      buffer: false,
    }

    return config
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://192.168.1.97:8888/:path*',
  //     },
  //   ]
  // },

  // 使用rewrites功能将未上线的路由重定向到"即将上线"页面
  async rewrites() {
    // 只在生产环境中应用重定向
    if (process.env.NODE_ENV === 'production') {
      // 需要排除的路由
      const excludeRoutes = ['market', 'home', 'swap', 'news', 'docs', 'points']

      console.log(`[Build] 重定向的路由: ${excludeRoutes.join(', ')}`)

      // 将每个排除的路由重定向到即将上线页面
      return excludeRoutes.map(route => ({
        source: `/${route}/:path*`,
        destination: '/coming',
      }))
    }

    return []
  },
}

module.exports = nextConfig
