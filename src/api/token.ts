import request from '@/config/axios'

export interface Token {
  id: number
  name: string
  symbol: string
  logo: string
  init_liquidity: number
  total_supply: number
  created_at?: string
  updated_at?: string
}

/**
 * Token 相关接口
 */
export const TokenAPI = {
  /**
   * 获取 token 列表
   */
  getTokenList: (): Promise<Token[]> => {
    console.log('Calling getTokenList API')
    return request.get('/token/list')
  },

  /**
   * 创建新的 token
   * @param data token 创建参数
   */
}

export default TokenAPI
