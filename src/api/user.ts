import { userApi } from '@/config/axios'
import type {
  LoginResponse,
  SolanaLoginParams,
  UserInfo,
  RankResponse,
  SignInInfoResponse,
} from './types'

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

  /**
   * 签到
   */
  signin: (): Promise<{ success: boolean; msg: string }> => {
    return userApi.post('/web/sginin/sginin')
  },

  /**
   * 获取签到信息
   */
  getSignInInfo: () => {
    return userApi.post<SignInInfoResponse>('/web/sginin/signInfo')
  },

  /**
   * 获取积分排行榜
   */
  getRank: (): Promise<RankResponse> => {
    return userApi.post('/web/wallet/UserPoints-Rank')
  },
}

export default UserAPI
