import { BN } from '@project-serum/anchor'
import { FairCurveState } from '../hooks/useFairCurve'

export interface FormattedFairCurveState {
  liquidityAdded: boolean
  feeRate: string // 百分比格式，例如 "10%"
  tokenDecimal: number
  solDecimal: number
  mint: string
  remaining: string // 格式化后的数字
  supply: string
  supplied: string
  solReceived: string
  liquiditySol: string
  liquidityToken: string
  liquiditySolFee: string
  liquidityTokenFee: string
  fee: string
  progress: number // 铸造进度百分比
}

export interface FormattedFairCurveData {
  supply: string
  remaining: string
  supplied: string
  solReceived: string
  progress: number
  feeRate: string
}

export function formatBN(value: BN, decimals: number): string {
  if (!value) return '0.0'
  
  const str = value.toString()
  if (str === '0') return '0.0'
  
  const paddedStr = str.padStart(decimals + 1, '0')
  const integerPart = paddedStr.slice(0, -decimals) || '0'
  const decimalPart = paddedStr.slice(-decimals).padEnd(1, '0')
  return `${integerPart}.${decimalPart}`
}

export function formatFairCurveState(state: FairCurveState | null): FormattedFairCurveData {
  console.log('state', state)
  if (!state) {
    return {
      supply: '0',
      remaining: '0',
      supplied: '0',
      solReceived: '0',
      progress: 0,
      feeRate: '0',
    }
  }

  const { supply, remaining, supplied, solReceived, feeRate } = state

  // 调试日志
  console.log('原始数据:', {
    supply,
    remaining,
    supplied,
    solReceived,
    supplyType: supply ? typeof supply : 'undefined',
    supplyIsBN: BN.isBN(supply),
  })

  // 安全地创建BN实例的辅助函数
  const safeBN = (value: BN | string | number | null | undefined): BN => {
    if (BN.isBN(value)) return value
    if (!value) return new BN(0)
    
    try {
      // 如果是对象且有toString方法
      if (typeof value === 'object' && value.toString) {
        return new BN(value.toString())
      }
      // 如果是字符串或数字
      if (typeof value === 'string' || typeof value === 'number') {
        return new BN(value)
      }
    } catch (err) {
      console.error('转换BN失败:', err)
    }
    return new BN(0)
  }

  // 使用安全转换函数
  const supplyBN = safeBN(supply)
  const suppliedBN = safeBN(supplied)
  const remainingBN = safeBN(remaining)
  const solReceivedBN = safeBN(solReceived)

  // 计算铸造进度
  let progress = 0
  if (!suppliedBN.isZero()) {
    try {
      const remainingNum = remainingBN.toNumber()
      const suppliedNum = suppliedBN.toNumber()
      // 使用公式: 1 - remaining/supplied
      progress = (1 - remainingNum/suppliedNum) * 100
    } catch (err) {
      console.error('计算进度时出错:', err)
      progress = 0
    }
  }

  // 调试日志
  console.log('转换后的数据:', {
    supplyBN: supplyBN.toString(),
    suppliedBN: suppliedBN.toString(),
    remainingBN: remainingBN.toString(),
    progress: progress
  })

  return {
    supply: supplyBN.toString(10),
    remaining: remainingBN.toString(10),
    supplied: suppliedBN.toString(10),
    solReceived: solReceivedBN.toString(10),
    progress: Number(progress.toFixed(2)),
    feeRate: ((feeRate || 0) / 100).toFixed(2),
  }
} 