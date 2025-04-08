'use client'

import { Connection } from '@solana/web3.js'
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'

interface solanaContextType {
  publicKey: string
  setPublicKey: (publicKey: string | null) => void
  conn: Connection | null
}

export const SolanaContext = createContext<solanaContextType>({
  publicKey: '',
  setPublicKey: () => {},
  conn: null,
})

export const useSolana = () => useContext(SolanaContext)
export const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [conn, setConn] = useState<Connection | null>(null)
  const checkWallet = async () => {
    const key = window.solana.publicKey
    setConn(new Connection('https://api.devnet.solana.com', 'confirmed'))
    if (key) setPublicKey(key.toString())
  }
  // 从localStorage初始化网络设置
  useEffect(() => {
    checkWallet()
  }, [])

  return (
    <SolanaContext.Provider
      value={{
        publicKey,
        setPublicKey,
        conn,
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}
