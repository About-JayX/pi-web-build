// 代币基本信息类型
export interface Token {
  id: number;
  name: string;
  symbol: string;
  logo?: string;
  image?: string;
  description?: string;
  totalSupply?: string;
  marketCap: string;
  price?: string;
  volume24h: string;
  change24h: string | number;
  change24hValue?: number;
  holders?: number;
  rank?: number;
}

// 铸造中的代币类型
export interface MintingToken {
  id: number;
  name: string;
  symbol: string;
  totalSupply: string;
  target: string;
  raised: string;
  participants: number;
  progress: number;
  image: string;
  presaleRate?: string;
  platformFee?: string;
  website?: string;     // 官网链接
  twitter?: string;     // X/Twitter 链接
  telegram?: string;    // Telegram 链接
  contractAddress?: string; // 合约地址
  deployedAt?: number;   // 部署时间戳
}

// 类别类型
export interface Category {
  name: string;
  count: number;
}

// 市场概览数据类型
export interface MarketOverview {
  totalTokens: number;
  totalMarketCap: string;
  totalVolume24h: string;
  averageChange: string;
}

// 平台统计数据类型
export interface PlatformStats {
  tokensCount: number;
  tradingVolume24h: string;
  activeUsers: number;
  totalLockedValue: string;
  monthlyGrowth: number;
  volumeGrowth: number;
  userGrowth: number;
  tvlGrowth: number;
} 