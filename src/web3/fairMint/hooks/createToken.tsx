import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  sendAndConfirmTransaction,
  VersionedTransaction,
} from '@solana/web3.js'
import { Program, AnchorProvider, web3, BN, utils } from '@coral-xyz/anchor'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token'

import { Metaplex } from '@metaplex-foundation/js'
import { TokenFormData } from './interface'

import idl from '../idl/fair_mint.json'
import { useSolana } from '@/contexts/solanaProvider'

export const useProgram = () => {
  const { conn, publicKey } = useSolana()
  const programId = new PublicKey(
    '74Vcnsny6346VKieUkDZuDtUCeNrv4UA8kKb8re7U5yc'
  )
  const createToken = async (formData: TokenFormData) => {
    const metaplex = new Metaplex(conn)
    const key = new PublicKey(publicKey)
    const FAIR_CURVE_SEED = Buffer.from('fair_curve')

    const wallet = {
      publicKey: key,
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
    const provider = new AnchorProvider(conn, wallet, {
      commitment: 'confirmed',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const program = new Program(idl as any, provider)

    const mintKeypair = Keypair.generate()

    const supply = new BN(Number(1000000000) * Math.pow(10, 6))

    const [fairCurvePda] = PublicKey.findProgramAddressSync(
      [FAIR_CURVE_SEED, mintKeypair.publicKey.toBuffer()],
      programId
    )
    // 获取元数据 PDA
    const metadataPda = metaplex
      .nfts()
      .pdas()
      .metadata({ mint: mintKeypair.publicKey })

    // 计算 FairCurve PDA 的关联代币账户地址
    const associatedFairCurveAta = await getAssociatedTokenAddress(
      mintKeypair.publicKey, // mint 地址
      fairCurvePda, // 所有者
      true // 允许 PDA 作为所有者
    )

    // 提交创建代币的交易
    const tx = await program.methods
      .createToken(
        // 调用合约的 createToken 方法
        formData.name, // 代币名称
        formData.symbol, // 代币符号
        formData.uri, // 元数据 URI
        supply // 供应量
      )
      .accounts({
        // 设置交易所需的账户
        signer: wallet.publicKey, // 交易签名者
        authority: wallet.publicKey, // 权限持有者
        mint: mintKeypair.publicKey, // mint 账户
        fairCurve: fairCurvePda, // FairCurve PDA
        associatedFairCurve: associatedFairCurveAta, // FairCurve 关联代币账户
        metadata: metadataPda, // 元数据账户
        mplTokenMetadata: metaplex.programs().getTokenMetadata().address, // 元数据程序
        tokenProgram: TOKEN_PROGRAM_ID, // 代币程序
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID, // 关联代币程序
        systemProgram: SystemProgram.programId, // 系统程序
        rent: SYSVAR_RENT_PUBKEY, // 租金系统变量
      })
      .signers([mintKeypair]) // 添加 mint 密钥对作为签名者
      .rpc() // 通过 RPC 发送交易

    await conn.confirmTransaction(tx, 'confirmed')
  }

  return { createToken }
}
