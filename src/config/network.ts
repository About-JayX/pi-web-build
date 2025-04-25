/**
 * Solana 网络配置
 * 包含开发环境和生产环境的 RPC 节点地址
 */

// 开发环境 (Devnet)
export const DEVNET_RPC_URL = 'https://api.devnet.solana.com'

// 生产环境 (Mainnet)
export const MAINNET_RPC_URL = 'https://api.mainnet-beta.solana.com'

// 默认使用的环境，可以根据构建环境自动切换
export const DEFAULT_NETWORK = process.env.NODE_ENV === 'production' 
  ? DEVNET_RPC_URL 
  : DEVNET_RPC_URL

// 连接配置选项
export const CONNECTION_COMMITMENT = 'confirmed'

// 导出网络配置对象
export const networkConfig = {
  devnet: {
    rpcUrl: DEVNET_RPC_URL,
    name: 'Devnet',
    commitment: CONNECTION_COMMITMENT
  },
  mainnet: {
    rpcUrl: MAINNET_RPC_URL,
    name: 'Mainnet',
    commitment: CONNECTION_COMMITMENT
  },
  // 您可以添加更多网络，如测试网等
}

// 默认网络配置
export const defaultNetworkConfig = process.env.NODE_ENV === 'production'
  ? networkConfig.devnet
  : networkConfig.devnet

export default networkConfig 