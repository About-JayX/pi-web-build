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
        console.log('User already logged in, no restoration needed')
        return
      }
      
      // 检查是否有钱包地址和保存的token
      const savedToken = localStorage.getItem('token')
      console.log('Checking token and wallet status', { 
        'token': !!savedToken, 
        'wallet_connected': !!publicKey,
        'wallet_address': publicKey
      })
      
      if (!savedToken) {
        console.log('No saved token found, cannot restore login state')
        return
      }
      
      if (!publicKey) {
        console.log('Wallet not connected, cannot restore login state')
        return
      }
      
      console.log('Found saved token and wallet address, attempting to restore session')
      
      try {
        // 不调用API验证token，直接假设token有效并恢复登录状态
        // 创建基本用户信息
        const basicUserInfo = {
          userId: parseInt(localStorage.getItem('userId') || '0'),
          nickname: localStorage.getItem('nickname') || 'User',
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
        
        console.log('User session restored via saved token and wallet address')
        
      } catch (error) {
        console.error('Error restoring session:', error)
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