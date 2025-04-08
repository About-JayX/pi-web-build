import {
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js'
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token'

import { Metaplex } from '@metaplex-foundation/js'
import { TokenFormData } from './interface'

import idl from '../idl/fair_mint.json'
import { useSolana } from '@/contexts/solanaProvider'

export const useProgram = () => {
  const { conn, FAIR_CURVE_SEED, programId, wallet, publicKey } = useSolana()
  const provider = new AnchorProvider(conn, wallet, {
    commitment: 'confirmed',
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const program = new Program(idl as any, provider)

  const createToken = async (formData: TokenFormData) => {
    const metaplex = new Metaplex(conn)

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

  const mintToken = async () => {
    const solAmountLamports = new BN(1_000_000_000)

    const mintPublicKey = new PublicKey(
      'FvyoWQ7ZegVB17c7hbwHiPGAmS7CcjhcpTJnJUoyQEHH'
    )

    const [fairCurvePda] = PublicKey.findProgramAddressSync(
      [FAIR_CURVE_SEED, mintPublicKey.toBuffer()],
      programId
    )

    const key = new PublicKey(publicKey)
    // 找到代币保管库账户
    const tokenVault = await getAssociatedTokenAddress(
      mintPublicKey,
      fairCurvePda,
      true
    )

    // 找到或创建用户的代币账户
    const userTokenAccount = await getAssociatedTokenAddress(mintPublicKey, key)
    const tx = await program.methods
      .mintToken(solAmountLamports) // 传入 SOL 金额
      .accounts({
        signer: publicKey, // 签名者和付款人
        mint: mintPublicKey, // 代币的 mint 地址
        fairCurve: fairCurvePda, // FairCurve PDA
        tokenVault: tokenVault, // 代币保管库账户
        userTokenAccount: userTokenAccount, // 用户的代币账户
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID, // 关联代币程序
        tokenProgram: TOKEN_PROGRAM_ID, // 代币程序
        systemProgram: SystemProgram.programId, // 系统程序
      })
      .rpc()

    // 等待交易确认
    await conn.confirmTransaction(tx, 'confirmed')
  }
  return { createToken, mintToken }
}
