// 平台统计数据 - Pi 网络
export const platformStatsPi = {
  tokensCount: 128,
  tradingVolume24h: '45,670 Pi',
  activeUsers: 2845,
  totalLockedValue: '158,000 Pi',
  monthlyGrowth: 23.36,
  volumeGrowth: 12.5,
  userGrowth: 36.1,
  tvlGrowth: 9.2
};

// 平台统计数据 - Solana 网络
export const platformStatsSol = {
  tokensCount: 96,
  tradingVolume24h: '18,420 SOL',
  activeUsers: 1930,
  totalLockedValue: '72,500 SOL',
  monthlyGrowth: 17.82,
  volumeGrowth: 9.7,
  userGrowth: 24.3,
  tvlGrowth: 6.8
};

// 默认导出Pi网络的数据（保持向后兼容）
export const platformStats = platformStatsPi; 