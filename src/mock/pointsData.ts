// 用户数据模型
export interface UserData {
  username: string;
  avatar: string;
  totalPoints: number;
  inviteLink: string;
  checkedInToday: boolean;
  telegramConnected: boolean;
  twitterConnected: boolean;
  level: number;
  nextLevelPoints: number;
  pointsHistory: PointHistoryEntry[];
  rank?: number;
  walletAddress: string;
}

// 积分历史条目模型
export interface PointHistoryEntry {
  id: number;
  activity: string;
  points: number;
  date: string;
}

// 排行榜用户模型
export interface LeaderboardEntry {
  id: number;
  username: string;
  avatar: string;
  points: number;
  level: number;
  isCurrentUser?: boolean;
  walletAddress: string;
}

// 积分奖励配置
export const REWARDS = {
  dailyCheckin: 10,
  inviteFriend: 50,
  connectSocial: 25
};

// 模拟用户数据
export const userData: UserData = {
  username: 'PiUser',
  avatar: '/pi.png',
  totalPoints: 1250,
  inviteLink: 'https://pi.sale/invite/PiUser123',
  checkedInToday: false,
  telegramConnected: false,
  twitterConnected: false,
  level: 3,
  nextLevelPoints: 1500,
  rank: 5,
  walletAddress: 'BHxZi5w6Sy8gJjbzGzNUL4VW9RNmzz4fw6CCrGyWi5Xa',
  pointsHistory: [
    { id: 1, activity: 'checkedIn', points: 10, date: '2025-04-10' },
    { id: 2, activity: 'inviteAccepted', points: 50, date: '2025-04-08' },
    { id: 3, activity: 'inviteSent', points: 5, date: '2025-04-07' },
    { id: 4, activity: 'checkedIn', points: 10, date: '2025-04-06' },
    { id: 5, activity: 'checkedIn', points: 10, date: '2025-04-05' },
  ]
};

// 用户等级信息
export const levelInfo = [
  { level: 1, pointsRequired: 0, title: '新手' },
  { level: 2, pointsRequired: 500, title: '探索者' },
  { level: 3, pointsRequired: 1000, title: '实践者' },
  { level: 4, pointsRequired: 1500, title: '专家' },
  { level: 5, pointsRequired: 2500, title: '大师' },
  { level: 6, pointsRequired: 3500, title: '传奇' },
];

// 模拟排行榜数据
export const leaderboardData: LeaderboardEntry[] = [
  { id: 1, username: 'CryptoKing', avatar: '/pi.png', points: 3850, level: 6, walletAddress: 'AK23onMmK87TPJSmkGAFzUQrdJRCzKK86MoVXLnXvdT7' },
  { id: 2, username: 'BlockchainMaster', avatar: '/pi.png', points: 3210, level: 5, walletAddress: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' },
  { id: 3, username: 'PiLover', avatar: '/pi.png', points: 2980, level: 5, walletAddress: '2xDxMDNNPt2J2B5D1fxYfmqifBA9NQT4GbLS4JYMhxBA' },
  { id: 4, username: 'TokenCollector', avatar: '/pi.png', points: 2450, level: 4, walletAddress: '6fDDtrRRvVYZsize8vQGKmyeV7GZJv5vNuHQ9nNr1pf' },
  { id: 5, username: 'PiUser', avatar: '/pi.png', points: 1250, level: 3, isCurrentUser: true, walletAddress: 'BHxZi5w6Sy8gJjbzGzNUL4VW9RNmzz4fw6CCrGyWi5Xa' },
  { id: 6, username: 'CoinHunter', avatar: '/pi.png', points: 1150, level: 3, walletAddress: 'EbxDy3xwmLzKNZJkFJCR9gzxZ4CLYqHXsmYm3b9Js8aY' },
  { id: 7, username: 'BlockExplorer', avatar: '/pi.png', points: 950, level: 2, walletAddress: 'FV9DQPGAMSHYTw3nKtXjsZZm3oLkxSFNUEpCGJvc57GB' },
  { id: 8, username: 'ChainWatcher', avatar: '/pi.png', points: 780, level: 2, walletAddress: '5TpQA54ULbooosBkWEeF1fGVWLrz8xcPozFQS5MBSQcf' },
  { id: 9, username: 'HashMiner', avatar: '/pi.png', points: 650, level: 2, walletAddress: 'AeLuG8cRwKXQbE8tsYzvqsb2NN3zMEwVJwbFQsvZGB9V' },
  { id: 10, username: 'TokenTrader', avatar: '/pi.png', points: 520, level: 1, walletAddress: 'ECN92UZq1tQUm7VaribZd8qQYMRQGcQpxtNfZSF6KVgB' },
];

// 获取用户当前等级的函数
export function getUserLevelInfo(points: number) {
  // 逆序查找用户当前等级
  for (let i = levelInfo.length - 1; i >= 0; i--) {
    if (points >= levelInfo[i].pointsRequired) {
      const currentLevel = levelInfo[i];
      const nextLevel = i < levelInfo.length - 1 ? levelInfo[i + 1] : null;
      
      // 计算等级进度
      const currentLevelPoints = points - currentLevel.pointsRequired;
      const pointsToNextLevel = nextLevel ? nextLevel.pointsRequired - currentLevel.pointsRequired : 0;
      const progress = nextLevel ? (currentLevelPoints / pointsToNextLevel) * 100 : 100;
      
      return {
        currentLevel: currentLevel.level,
        currentTitle: currentLevel.title,
        nextLevel: nextLevel ? nextLevel.level : null,
        nextTitle: nextLevel ? nextLevel.title : null,
        progress: Math.min(progress, 100),
        pointsToNextLevel: nextLevel ? nextLevel.pointsRequired - points : 0,
      };
    }
  }
  
  // 如果没有找到匹配的等级（应该不会发生）
  return {
    currentLevel: 1,
    currentTitle: levelInfo[0].title,
    nextLevel: 2,
    nextTitle: levelInfo[1].title,
    progress: 0,
    pointsToNextLevel: levelInfo[1].pointsRequired,
  };
} 