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
  logo: File
  init_liquidity: number
  total_supply: number
}

/**
 * Token 相关接口
 */
export const TokenAPI = {
  /**
   * 获取 token 列表
   */
  getTokenList: (): Promise<Token[]> => {
    return request.get('/list')
  },

  /**
   * 创建新的 token
   * @param data token 创建参数
   */
  createToken: (data: CreateTokenParams): Promise<Token> => {
    // 使用 FormData 处理文件上传
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('symbol', data.symbol)
    formData.append('file', data.logo)
    formData.append('init_liquidity', data.init_liquidity.toString())
    formData.append('total_supply', data.total_supply.toString())

    return request.post('/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default TokenAPI
