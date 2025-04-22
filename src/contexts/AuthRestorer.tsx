'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUser } from '@/store/slices/userSlice'
import { useSolana } from './solanaProvider'

/**
 * 身份验证恢复组件
 * 用于在应用启动时检查localStorage中的token
 * 如果存在有效token，尝试恢复用户登录状态
 */
const AuthRestorer = () => {
  const dispatch = useAppDispatch()
  const { isLoggedIn } = useAppSelector(state => state.user)
  const { publicKey } = useSolana()
  
  useEffect(() => {
    const restoreAuth = async () => {
      // 如果已经登录，不需要恢复
      if (isLoggedIn) {
        console.log('用户已登录，无需恢复状态')
        return
      }
      
      // 检查是否有钱包地址和保存的token
      const savedToken = localStorage.getItem('token')
      console.log('检查token和钱包状态', { 
        'token存在': !!savedToken, 
        '钱包已连接': !!publicKey,
        '当前钱包地址': publicKey
      })
      
      if (!savedToken) {
        console.log('未找到保存的token，无法恢复登录状态')
        return
      }
      
      if (!publicKey) {
        console.log('钱包未连接，无法恢复登录状态')
        return
      }
      
      console.log('找到保存的token和钱包地址，尝试恢复登录状态')
      
      try {
        // 不调用API验证token，直接假设token有效并恢复登录状态
        // 创建基本用户信息
        const basicUserInfo = {
          userId: parseInt(localStorage.getItem('userId') || '0'),
          nickname: localStorage.getItem('nickname') || '用户',
          avatar_url: localStorage.getItem('avatar_url') || '',
          twitterId: null,
          telegramId: null,
          token: '',
          status: 1,
          free_power: 0,
          ip_address: '',
          create_time: 0,
          last_time: 0,
          os: '',
          version: '',
          code: '',
          solana_wallet: publicKey,
          pi_network: null,
          from_type: '',
        }
        
        // 恢复登录状态
        dispatch(
          setUser({
            user: basicUserInfo,
            authToken: savedToken,
          })
        )
        
        console.log('用户登录状态已恢复（通过保存的token和钱包地址）')
        
      } catch (error) {
        console.error('恢复登录状态时出错:', error)
        // 出错时清除token
        localStorage.removeItem('token')
      }
    }
    
    restoreAuth()
  }, [dispatch, isLoggedIn, publicKey])

  // 这是一个纯逻辑组件，不渲染任何内容
  return null
}

export default AuthRestorer 