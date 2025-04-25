const webpack = require('webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // 在构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在构建时忽略 TypeScript 错误
    ignoreBuildErrors: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        buffer: require.resolve('buffer/'),
        events: require.resolve('events/'),
      }

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      )
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
