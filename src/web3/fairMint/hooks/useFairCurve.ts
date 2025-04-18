import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { BN } from '@project-serum/anchor'
import { struct, u8, u16, seq } from '@solana/buffer-layout'
import { u64 } from '@solana/buffer-layout-utils'
import { publicKey as publicKeyLayout } from '@solana/buffer-layout-utils'
import { useSolana } from '@/contexts/solanaProvider'
import { useAppSelector } from '@/store/hooks'

export interface FormattedFairCurveState {
  liquidityAdded: boolean
  feeRate: number
  tokenDecimal: number
  solDecimal: number
  mint: string
  remaining: string
  supply: string
  supplied: string
  solReceived: string
  liquiditySol: string
  liquidityToken: string
  liquiditySolFee: string
  liquidityTokenFee: string
  fee: string
  progress: number
}

export interface FairCurveState {
  liquidityAdded: boolean
  feeRate: number
  tokenDecimal: number
  solDecimal: number
  mint: PublicKey
  remaining: BN
  supply: BN
  supplied: BN
  solReceived: BN
  liquiditySol: BN
  liquidityToken: BN
  liquiditySolFee: BN
  liquidityTokenFee: BN
  fee: BN
}

interface DecodedFairCurve {
  discriminator: number[]
  liquidityAdded: number
  feeRate: number
  tokenDecimal: number
  solDecimal: number
  mint: PublicKey
  remaining: BN
  supply: BN
  supplied: BN
  solReceived: BN
  liquiditySol: BN
  liquidityToken: BN
  liquiditySolFee: BN
  liquidityTokenFee: BN
  fee: BN
  reserved: number[]
}

// 定义常量
const FAIR_CURVE_DISCRIMINATOR = [218, 149, 243, 196, 210, 100, 233, 1]
const FAIR_CURVE_LEN =
  8 + // discriminator
  1 + // liquidity_added
  2 + // fee_rate
  1 + // token_decimal
  1 + // sol_decimal
  32 + // mint
  8 + // remaining
  8 + // supply
  8 + // supplied
  8 + // sol_received
  8 + // liquidity_sol
  8 + // liquidity_token
  8 + // liquidity_sol_fee
  8 + // liquidity_token_fee
  8 + // fee
  64 // reserved

// 定义 FairCurve 布局
const FairCurveLayout = struct<DecodedFairCurve>([
  seq(u8(), 8, 'discriminator'), // 8 bytes discriminator
  u8('liquidityAdded'), // 1 byte
  u16('feeRate'), // 2 bytes
  u8('tokenDecimal'), // 1 byte
  u8('solDecimal'), // 1 byte
  publicKeyLayout('mint'), // 32 bytes
  u64('remaining'), // 8 bytes
  u64('supply'), // 8 bytes
  u64('supplied'), // 8 bytes
  u64('solReceived'), // 8 bytes
  u64('liquiditySol'), // 8 bytes
  u64('liquidityToken'), // 8 bytes
  u64('liquiditySolFee'), // 8 bytes
  u64('liquidityTokenFee'), // 8 bytes
  u64('fee'), // 8 bytes
  seq(u8(), 64, 'reserved'), // 64 bytes reserved
])

export interface UseFairCurveResult {
  loading: boolean
  error: string | null
  data: FormattedFairCurveState | null
  refetch: () => Promise<void>
}

const formatFairCurveState = (
  state: FairCurveState
): FormattedFairCurveState => {
  // 确保数值是 BN 类型
  const supply = BN.isBN(state.supply) ? state.supply : new BN(state.supply)
  const supplied = BN.isBN(state.supplied)
    ? state.supplied
    : new BN(state.supplied)

  // 计算进度
  let progress = 0
  try {
    if (!supply.isZero()) {
      progress = (supplied.toNumber() / supply.toNumber()) * 100
    }
  } catch (error) {
    console.error('计算进度时出错:', error)
  }

  // 安全地转换其他数值
  const safeToString = (value: BN | number | string | unknown) => {
    try {
      if (BN.isBN(value)) {
        return value.toString()
      }
      return new BN(value as number | string).toString()
    } catch (error) {
      console.error('转换数值时出错:', error)
      return '0'
    }
  }

  return {
    liquidityAdded: state.liquidityAdded,
    feeRate: state.feeRate,
    tokenDecimal: state.tokenDecimal,
    solDecimal: state.solDecimal,
    mint: state.mint.toBase58(),
    remaining: safeToString(state.remaining),
    supply: safeToString(supply),
    supplied: safeToString(supplied),
    solReceived: safeToString(state.solReceived),
    liquiditySol: safeToString(state.liquiditySol),
    liquidityToken: safeToString(state.liquidityToken),
    liquiditySolFee: safeToString(state.liquiditySolFee),
    liquidityTokenFee: safeToString(state.liquidityTokenFee),
    fee: safeToString(state.fee),
    progress: Number(progress.toFixed(2)),
  }
}

export function useFairCurve(
  connection: Connection | null | undefined,
  mintAddress: string | undefined
): UseFairCurveResult {
  const { programId, FAIR_CURVE_SEED } = useSolana()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<FormattedFairCurveState | null>(null)

  const fetchFairCurveState = async () => {
    try {
      if (!connection) {
        throw new Error('未连接到 Solana 网络')
      }

      if (!mintAddress) {
        throw new Error('未提供 mint 地址')
      }

      // 验证 mint 地址是否有效
      let mintPubkey: PublicKey
      try {
        mintPubkey = new PublicKey(mintAddress)
      } catch {
        throw new Error('无效的 mint 地址')
      }

      setLoading(true)
      setError(null)

      // 计算 PDA 地址
      const [fairCurvePda] = PublicKey.findProgramAddressSync(
        [FAIR_CURVE_SEED, mintPubkey.toBuffer()],
        programId
      )

      // 获取账户信息
      const accountInfo = await connection.getAccountInfo(fairCurvePda)

      if (!accountInfo) {
        setError('找不到该代币的铸造信息')
        setData(null)
        return
      }

      console.log('账户数据长度:', accountInfo.data.length)
      console.log('账户数据:', Buffer.from(accountInfo.data).toString('hex'))

      // 检查数据长度
      if (accountInfo.data.length !== FAIR_CURVE_LEN) {
        throw new Error(
          `数据长度不匹配: 期望 ${FAIR_CURVE_LEN} 字节，实际 ${accountInfo.data.length} 字节`
        )
      }

      try {
        // 解码数据
        const rawData = FairCurveLayout.decode(
          accountInfo.data
        ) as DecodedFairCurve

        // 转换数值为 BN
        const decodedData = {
          ...rawData,
          remaining: new BN(rawData.remaining.toString()),
          supply: new BN(rawData.supply.toString()),
          supplied: new BN(rawData.supplied.toString()),
          solReceived: new BN(rawData.solReceived.toString()),
          liquiditySol: new BN(rawData.liquiditySol.toString()),
          liquidityToken: new BN(rawData.liquidityToken.toString()),
          liquiditySolFee: new BN(rawData.liquiditySolFee.toString()),
          liquidityTokenFee: new BN(rawData.liquidityTokenFee.toString()),
          fee: new BN(rawData.fee.toString()),
        }

        console.log('解码后的数据:', {
          discriminator: decodedData.discriminator,
          liquidityAdded: decodedData.liquidityAdded,
          feeRate: decodedData.feeRate,
          tokenDecimal: decodedData.tokenDecimal,
          solDecimal: decodedData.solDecimal,
          mint: decodedData.mint.toBase58(),
          remaining: decodedData.remaining.toString(),
          supply: decodedData.supply.toString(),
          supplied: decodedData.supplied.toString(),
          solReceived: decodedData.solReceived.toString(),
          liquiditySol: decodedData.liquiditySol.toString(),
          liquidityToken: decodedData.liquidityToken.toString(),
          liquiditySolFee: decodedData.liquiditySolFee.toString(),
          liquidityTokenFee: decodedData.liquidityTokenFee.toString(),
          fee: decodedData.fee.toString(),
        })

        // 验证 discriminator
        if (
          !decodedData.discriminator.every(
            (byte, i) => byte === FAIR_CURVE_DISCRIMINATOR[i]
          )
        ) {
          console.error('Discriminator 不匹配:', {
            期望: FAIR_CURVE_DISCRIMINATOR,
            实际: decodedData.discriminator,
          })
          throw new Error('账户类型不匹配')
        }

        // 转换为状态对象
        const fairCurveState: FairCurveState = {
          liquidityAdded: Boolean(decodedData.liquidityAdded),
          feeRate: decodedData.feeRate,
          tokenDecimal: decodedData.tokenDecimal,
          solDecimal: decodedData.solDecimal,
          mint: decodedData.mint,
          remaining: decodedData.remaining,
          supply: decodedData.supply,
          supplied: decodedData.supplied,
          solReceived: decodedData.solReceived,
          liquiditySol: decodedData.liquiditySol,
          liquidityToken: decodedData.liquidityToken,
          liquiditySolFee: decodedData.liquiditySolFee,
          liquidityTokenFee: decodedData.liquidityTokenFee,
          fee: decodedData.fee,
        }

        console.log('转换后的状态:', fairCurveState)

        // 格式化数据
        const formattedState = formatFairCurveState(fairCurveState)
        console.log('格式化后的状态:', formattedState)

        setData(formattedState)
        setError(null)
      } catch (decodeError) {
        console.error('解码错误:', decodeError)
        throw new Error(`解码失败: ${decodeError.message}`)
      }
    } catch (err) {
      console.error('获取 FairCurve 状态失败:', err)
      setError(err instanceof Error ? err.message : '未知错误')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFairCurveState()
  }, [connection, mintAddress, programId])

  return {
    loading,
    error,
    data,
    refetch: fetchFairCurveState,
  }
}
