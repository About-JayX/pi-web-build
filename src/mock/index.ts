// 空的模拟数据替代 - 在删除模拟数据后提供兼容性

// 基础类型定义
export type TokenHolder = {
  address: string;
  amount: string;
  percentage: number;
};

// 空的代币列表
export const mintingTokensPi: any[] = [];
export const mintingTokensSol: any[] = [];
export const marketTokens: any[] = [];

// 空的持有人查询函数
export const getTokenHolders = (address: string): TokenHolder[] => []; 