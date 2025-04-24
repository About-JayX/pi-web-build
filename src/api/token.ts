import request from '@/config/axios'
import type { CreateTokenParams, TokenInfo } from './types'

export interface Token extends TokenInfo {
  logo: string
  description?: string
}

export interface PlatformMetrics {
  token_count: number // 代币总数
  total_mint: number // 铸造代币总数
  mint_accounts: number // 铸造地址总数
  tvl: number // 锁仓总价值
}

export interface SymbolCheckResponse {
  exists: boolean
}

/**
 * Token 相关接口
 */
export const TokenAPI = {
  /**
   * 创建新的 token
   * @param data token 创建参数
   */
  createToken: (data: CreateTokenParams): Promise<Token> => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('metadata', JSON.stringify(data.Metadata))
    return request.post('/token/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * 获取token详情
   * @param address token地址
   * @returns Promise<Token> 返回token详情
   */
  getTokenDetail: (address: string): Promise<TokenInfo> => {
    return request.get(`/token/${address}`)
  },

  /**
   * 获取平台数据
   * @returns Promise<PlatformMetrics> 返回平台统计数据
   */
  getPlatformMetrics: (): Promise<PlatformMetrics> => {
    return request.get('/metrics/platform')
  },

  /**
   * 检查代币符号是否可用
   * @param symbol 代币符号
   * @returns Promise<SymbolCheckResponse> 返回代币符号检查结果
   */
  checkSymbol: (symbol: string): Promise<SymbolCheckResponse> => {
    return request.get(`/token/ticker/check?symbol=${symbol}`)
  },
}

export default TokenAPI
