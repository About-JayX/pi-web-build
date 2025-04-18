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
  setPublicKey: (publicKey: string | null) => void
  conn: Connection | null
  FAIR_CURVE_SEED: Buffer
  programId: PublicKey
  wallet: Wallet | null
}

export const SolanaContext = createContext<solanaContextType>({
  publicKey: '',
  setPublicKey: () => {},
  conn: null,
  FAIR_CURVE_SEED: Buffer.from('fair_curve'),
  programId: new PublicKey(PROGRAM_ID),
  wallet: null,
})

export const useSolana = () => useContext(SolanaContext)
export const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const [publicKey, setPublicKey] = useState<string>('')
  const [conn, setConn] = useState<Connection | null>(null)
  const FAIR_CURVE_SEED = Buffer.from('fair_curve')
  const programId = new PublicKey(PROGRAM_ID)
  const key = publicKey ? new PublicKey(publicKey) : null
  const wallet = publicKey ? {
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
  } : null

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
        FAIR_CURVE_SEED,
        programId,
        wallet,
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}
