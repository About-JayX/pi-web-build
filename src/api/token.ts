import request from '@/config/axios'
import type { CreateTokenParams, TokenInfo } from './types'

export interface Token extends TokenInfo {
  logo: string
  description?: string
}

export interface PlatformMetrics {
  token_count: number    // 代币总数
  total_mint: number    // 铸造代币总数
  mint_accounts: number // 铸造地址总数
  tvl: number          // 锁仓总价值
}

/**
 * Token 相关接口
 */
export const TokenAPI = {
  /**
   * 获取 token 列表
   */
  getTokenList: (): Promise<Token[]> => {
    return request.get('/token/list')
  },

  /**
   * 创建新的 token
   * @param data token 创建参数
   */
  createToken: (data: CreateTokenParams): Promise<Token> => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('symbol', data.symbol)
    formData.append('init_liquidity', String(50 * 1e9))
    formData.append('total_supply', String(Number(data.total_supply) * 1e6))
    formData.append('file', data.file)
    formData.append('description', data.description || '')
    return request.post('/token/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * 获取平台数据
   * @returns Promise<PlatformMetrics> 返回平台统计数据
   */
  getPlatformMetrics: (): Promise<PlatformMetrics> => {
    return request.get('/metrics/platform')
  },
}

export default TokenAPI
