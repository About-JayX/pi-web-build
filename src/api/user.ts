import { userApi } from '@/config/axios'
import type { LoginResponse, SolanaLoginParams, UserInfo } from './types'

/**
 * 用户相关接口
 */
export const UserAPI = {
  /**
   * Solana钱包登录
   * @param data 登录参数
   */
  loginWithSolana: (data: SolanaLoginParams): Promise<LoginResponse> => {
    return userApi.post('/web/wallet/login-solana', data)
  },

  /**
   * 获取用户信息
   */
  getUserInfo: (): Promise<UserInfo> => {
    return userApi.get('/web/user/info')
  },

  /**
   * 用户登出
   */
  logout: (): Promise<{ code: number; message: string }> => {
    return userApi.post('/web/user/logout')
  },
}

export default UserAPI
