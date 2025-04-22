'use client'

import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider'
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js'
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import { PROGRAM_ID } from '@/config'

interface solanaContextType {
  publicKey: string
  setPublicKey: (publicKey: string) => void
  conn: Connection | null
  FAIR_CURVE_SEED: Buffer
  programId: PublicKey
  wallet: Wallet | null
  disconnectWallet: () => void
  isConnecting: boolean
  reconnectWallet: () => Promise<void>
  autoConnected: boolean
}

export const SolanaContext = createContext<solanaContextType>({
  publicKey: '',
  setPublicKey: () => {},
  conn: null,
  FAIR_CURVE_SEED: Buffer.from('fair_curve'),
  programId: new PublicKey(PROGRAM_ID),
  wallet: null,
  disconnectWallet: () => {},
  isConnecting: false,
  reconnectWallet: async () => {},
  autoConnected: false,
})

export const useSolana = () => useContext(SolanaContext)
export const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const [publicKey, setPublicKey] = useState('')
  const [conn, setConn] = useState<Connection | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [autoConnected, setAutoConnected] = useState(false)
  
  const FAIR_CURVE_SEED = Buffer.from('fair_curve')
  const programId = new PublicKey(PROGRAM_ID)
  const key = publicKey ? new PublicKey(publicKey) : null
  
  // 更新钱包对象
  useEffect(() => {
    if (publicKey) {
      const newWallet: Wallet = {
        publicKey: new PublicKey(publicKey),
        signTransaction: async <T extends Transaction | VersionedTransaction>(
          transaction: T
        ): Promise<T> => {
          // 检查是否为 VersionedTransaction
          if ('version' in transaction) {
            // 处理 VersionedTransaction
            return (await window.solana.signTransaction(transaction)) as T
          } else {
            // 处理普通 Transaction
            return (await window.solana.signTransaction(transaction)) as T
          }
        },
        signAllTransactions: async <T extends Transaction | VersionedTransaction>(
          transactions: T[]
        ): Promise<T[]> => {
          return (await window.solana.signAllTransactions(transactions)) as T[]
        },
      }
      setWallet(newWallet)
    } else {
      setWallet(null)
    }
  }, [publicKey])

  // 保存连接状态到localStorage
  useEffect(() => {
    if (publicKey) {
      console.log('保存钱包地址到localStorage:', publicKey)
      localStorage.setItem('walletConnected', 'true')
      localStorage.setItem('walletAddress', publicKey)
    }
  }, [publicKey])

  // 断开钱包连接
  const disconnectWallet = async () => {
    try {
      if (window.solana && window.solana.disconnect) {
        await window.solana.disconnect()
      }
      setPublicKey('')
      localStorage.removeItem('walletConnected')
      localStorage.removeItem('walletAddress')
      console.log('钱包已断开连接')
    } catch (error) {
      console.error('断开钱包连接失败:', error)
    }
  }

  // 重新连接钱包
  const reconnectWallet = async () => {
    if (!window.solana) {
      console.log('Phantom钱包未安装')
      return
    }
    
    setIsConnecting(true)
    try {
      console.log('尝试重新连接钱包...')
      const result = await window.solana.connect()
      if (result.publicKey) {
        const newPublicKey = result.publicKey.toString()
        console.log('钱包连接成功:', newPublicKey)
        setPublicKey(newPublicKey)
      }
    } catch (error) {
      console.error('重新连接钱包失败:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // 监听钱包连接状态变化
  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana) {
      console.log('添加钱包状态监听器')
      
      const handleAccountsChanged = () => {
        console.log('钱包账户变更')
        if (window.solana.publicKey) {
          const newKey = window.solana.publicKey.toString()
          console.log('新的钱包地址:', newKey)
          setPublicKey(newKey)
        } else {
          console.log('钱包已断开连接')
          setPublicKey('')
          localStorage.removeItem('walletConnected')
          localStorage.removeItem('walletAddress')
        }
      }
      
      const handleDisconnect = () => {
        console.log('钱包断开连接事件')
        setPublicKey('')
        localStorage.removeItem('walletConnected')
        localStorage.removeItem('walletAddress')
      }

      window.solana.on('accountChanged', handleAccountsChanged)
      window.solana.on('disconnect', handleDisconnect)

      return () => {
        console.log('移除钱包状态监听器')
        if (window.solana) {
          window.solana.removeListener('accountChanged', handleAccountsChanged)
          window.solana.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window === 'undefined' || !window.solana) {
      console.log('Phantom钱包未安装或不在浏览器环境')
      return
    }
    
    setIsConnecting(true)
    
    try {
      setConn(new Connection('https://api.devnet.solana.com', 'confirmed'))
      
      // 检查钱包是否已连接
      const isPhantomConnected = window.solana.isConnected
      console.log('Phantom钱包连接状态:', isPhantomConnected)
      
      // 获取上次保存的钱包地址
      const savedWalletAddress = localStorage.getItem('walletAddress')
      console.log('保存的钱包地址:', savedWalletAddress)
      
      // 如果钱包已连接，直接使用当前公钥
      if (isPhantomConnected && window.solana.publicKey) {
        const currentKey = window.solana.publicKey.toString()
        console.log('当前连接的钱包地址:', currentKey)
        setPublicKey(currentKey)
        return
      }
      
      // 如果有保存的连接记录，尝试恢复连接
      if (localStorage.getItem('walletConnected') === 'true') {
        console.log('尝试恢复钱包连接')
        
        try {
          // 首先尝试静默连接 - 不需要用户确认
          console.log('尝试静默连接...')
          const result = await window.solana.connect({ onlyIfTrusted: true })
          if (result.publicKey) {
            const newPublicKey = result.publicKey.toString()
            console.log('静默连接成功:', newPublicKey)
            setPublicKey(newPublicKey)
            setAutoConnected(true)
            return
          }
        } catch (error) {
          console.log('静默连接失败，可能需要用户确认', error)
          
          // 如果静默连接失败，且我们处于页面加载初期，暂时不弹出连接请求
          // 用户可以通过点击"连接"按钮来手动连接
          console.log('不尝试弹出连接请求，等待用户主动连接')
        }
      }
    } catch (error) {
      console.error('检查钱包状态失败:', error)
    } finally {
      setIsConnecting(false)
    }
  }
  
  // 初始化时检查钱包状态
  useEffect(() => {
    console.log('初始化钱包检查...')
    checkWalletConnection()
  }, [])

  return (
    <SolanaContext.Provider
      value={{
        publicKey,
        setPublicKey,
        conn,
        FAIR_CURVE_SEED,
        programId,
        wallet,
        disconnectWallet,
        isConnecting,
        reconnectWallet,
        autoConnected,
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}
