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
import { useTranslation } from 'react-i18next'
import { DEFAULT_NETWORK, CONNECTION_COMMITMENT } from '@/config/network'

interface solanaContextType {
  publicKey: string | null
  setPublicKey: (publicKey: string | null) => void
  conn: Connection
  FAIR_CURVE_SEED: Buffer
  programId: PublicKey
  wallet: Wallet | null
  disconnectWallet: () => void
  isConnecting: boolean
  reconnectWallet: () => Promise<void>
  autoConnected: boolean
  walletType: string | null
  setWalletType: (type: string) => void
}

export const SolanaContext = createContext<solanaContextType>({
  publicKey: null,
  setPublicKey: () => {},
  conn: new Connection(DEFAULT_NETWORK, CONNECTION_COMMITMENT),
  FAIR_CURVE_SEED: Buffer.from('fair_curve'),
  programId: new PublicKey(PROGRAM_ID),
  wallet: null,
  disconnectWallet: () => {},
  isConnecting: false,
  reconnectWallet: async () => {},
  autoConnected: false,
  walletType: null,
  setWalletType: () => {},
})

export const useSolana = () => useContext(SolanaContext)
export const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [conn, setConn] = useState<Connection>(new Connection(DEFAULT_NETWORK, CONNECTION_COMMITMENT))
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [autoConnected, setAutoConnected] = useState(false)
  const [walletType, setWalletType] = useState<string | null>(null)
  
  const FAIR_CURVE_SEED = Buffer.from('fair_curve')
  const programId = new PublicKey(PROGRAM_ID)
  const key = publicKey ? new PublicKey(publicKey) : null
  
  // 确保连接始终可用，如果初始化失败则重试
  useEffect(() => {
    // 如果连接对象已存在，可以选择刷新或验证连接
    const validateConnection = async () => {
      try {
        // 简单验证连接是否工作 - 例如获取最新区块高度
        const blockHeight = await conn.getBlockHeight()
        
        // 仅在开发环境中输出连接状态日志
        if (process.env.NODE_ENV === 'development') {
          console.log(`Solana connection valid, block height: ${blockHeight}`)
        }
      } catch (error) {
        // 保留错误日志，这是重要的
        console.error(`Solana connection failed: ${error}`)
        
        // 如果验证失败，重新创建连接
        try {
          const newConnection = new Connection(DEFAULT_NETWORK, CONNECTION_COMMITMENT)
          setConn(newConnection)
          console.log('Solana connection reestablished')
        } catch (retryError) {
          console.error(`Connection recreation failed: ${retryError}`)
        }
      }
    }
    
    validateConnection()
  }, [t])
  
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
      // 仅在开发环境下输出日志
      if (process.env.NODE_ENV === 'development') {
        console.log(`Saving wallet address: ${publicKey}`)
      }
      localStorage.setItem('walletConnected', 'true')
      localStorage.setItem('walletAddress', publicKey)
    }
  }, [publicKey, t])

  // 断开钱包连接
  const disconnectWallet = async () => {
    setIsConnecting(true)
    try {
      // 根据钱包类型选择相应的断开方法
      if (walletType === "phantom" && window.solana) {
        await window.solana.disconnect()
      } else if (walletType === "solflare" && window.solflare) {
        await window.solflare.disconnect()
      } else if (walletType === "okx" && window.okxwallet) {
        await window.okxwallet.disconnect()
      } else if (walletType === "bitget" && window.bitkeep) {
        await window.bitkeep.disconnect()
      }
      
      // 清除状态
      setPublicKey(null)
      setWalletType(null)
      localStorage.removeItem('walletConnected')
      localStorage.removeItem('walletAddress')
    } catch (error) {
      console.error(`Disconnect wallet failed: ${error}`)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  // 重新连接钱包
  const reconnectWallet = async () => {
    setIsConnecting(true)
    try {
      // 检查是否有保存的钱包类型
      const savedWalletType = localStorage.getItem('wallet_type')
      if (!savedWalletType) {
        throw new Error('Previous wallet type not found')
      }
      
      // 获取对应的钱包实例
      let wallet: any
      switch (savedWalletType) {
        case 'phantom':
          wallet = window.solana
          break
        case 'solflare':
          wallet = window.solflare
          break
        case 'okx':
          wallet = window.okxwallet
          break
        case 'bitget':
          wallet = window.bitkeep
          break
        default:
          throw new Error('Unsupported wallet type')
      }
      
      // 检查钱包是否已安装
      if (!wallet) {
        throw new Error('Wallet not installed')
      }
      
      // 重新连接
      const result = await wallet.connect()
      const newPublicKey = result.publicKey.toString()
      
      // 更新状态
      setPublicKey(newPublicKey)
      setWalletType(savedWalletType)
      
      return result
    } catch (error) {
      console.error(`Wallet reconnection failed: ${error}`)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  // 监听钱包连接状态变化
  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana) {
      
      const handleAccountsChanged = () => {
        if (window.solana.publicKey) {
          const newKey = window.solana.publicKey.toString()
          
          // 保留简洁的连接成功日志，但仅在开发环境显示
          if (process.env.NODE_ENV === 'development') {
            console.log('Wallet connected:', newKey.slice(0, 6) + '...' + newKey.slice(-4))
          }
          
          setPublicKey(newKey)
        } else {
          setPublicKey(null)
          localStorage.removeItem('walletConnected')
          localStorage.removeItem('walletAddress')
        }
      }
      
      const handleDisconnect = () => {
        setPublicKey(null)
        localStorage.removeItem('walletConnected')
        localStorage.removeItem('walletAddress')
      }

      window.solana.on('accountChanged', handleAccountsChanged)
      window.solana.on('disconnect', handleDisconnect)

      return () => {
        if (window.solana) {
          window.solana.removeListener('accountChanged', handleAccountsChanged)
          window.solana.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [t])

  const checkWalletConnection = async () => {
    if (typeof window === 'undefined' || !window.solana) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Wallet not installed or non-browser environment')
      }
      return
    }
    
    setIsConnecting(true)
    
    try {
      // 检查钱包是否已连接
      const isPhantomConnected = window.solana.isConnected
      const savedWalletAddress = localStorage.getItem('walletAddress')
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Wallet status: ${isPhantomConnected ? 'Connected' : 'Disconnected'}`)
      }
      
      // 如果钱包已连接，直接使用当前公钥
      if (isPhantomConnected && window.solana.publicKey) {
        const currentKey = window.solana.publicKey.toString()
        
        // 重要的连接状态变更，仅在开发环境输出
        if (process.env.NODE_ENV === 'development') {
          console.log(`User already logged in, no restoration needed`)
        }
        
        setPublicKey(currentKey)
        return
      }
      
      // 如果有保存的连接记录，尝试恢复连接
      if (localStorage.getItem('walletConnected') === 'true') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Found saved token and wallet address, attempting to restore session')
        }
        
        try {
          // 尝试静默连接 - 不需要用户确认
          const result = await window.solana.connect({ onlyIfTrusted: true })
          if (result.publicKey) {
            const newPublicKey = result.publicKey.toString()
            
            // 重要的状态变更，但简化输出
            if (process.env.NODE_ENV === 'development') {
              console.log(`User session restored via saved token and wallet address`)
            }
            
            setPublicKey(newPublicKey)
            setAutoConnected(true)
            return
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Silent connection failed: ${error}`)
          }
        }
      }
    } catch (error) {
      // 保留错误日志
      console.error(`Wallet connection check failed: ${error}`)
    } finally {
      setIsConnecting(false)
    }
  }
  
  // 初始化时检查钱包状态
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Initializing wallet connection check')
    }
    checkWalletConnection()
  }, [t])

  // 自动重连逻辑
  useEffect(() => {
    const storedKey = localStorage.getItem('publicKey')
    const storedWalletType = localStorage.getItem('wallet_type') // 获取已保存的钱包类型
    
    if (storedKey && storedWalletType) {
      setPublicKey(storedKey)
      setWalletType(storedWalletType)
      setAutoConnected(true)
    }
  }, [])

  // 保存公钥到localStorage
  useEffect(() => {
    if (publicKey) {
      localStorage.setItem('publicKey', publicKey)
    } else {
      localStorage.removeItem('publicKey')
    }
  }, [publicKey])

  // 保存钱包类型到localStorage
  useEffect(() => {
    if (walletType) {
      localStorage.setItem('wallet_type', walletType)
    } else {
      localStorage.removeItem('wallet_type')
    }
  }, [walletType])

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
        walletType,
        setWalletType,
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}
