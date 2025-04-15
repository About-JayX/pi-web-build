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

export interface CreateTokenParams {
  name: string
  symbol: string
  init_liquidity: number
  logo: File
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
    formData.append('name[0]', data.name)
    formData.append('symbol[0]', data.symbol)
    formData.append('init_liquidity[0]', data.init_liquidity.toString())
    formData.append('logo', data.logo)

    return request.post('/token/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default TokenAPI
