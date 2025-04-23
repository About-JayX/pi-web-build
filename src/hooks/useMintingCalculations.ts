import { useMemo } from 'react'
import {
  parseValueWithUnit,
  getSimpleMintingRatio,
  calculateMintingPrice,
  parseMintingPrice,
  getFormattedMintRate as formatMintRate,
  calculateMintedAmount as calcMintedAmount,
  calculateTokensFromCurrency as calcTokensFromCurrency,
  calculateCurrencyFromTokens as calcCurrencyFromTokens,
} from '@/utils'

interface MintingCalculationParams {
  totalSupply?: string
  target?: string
  mintRate?: string
  currencyUnit?: string
  tokenDecimals?: number
}

/**
 * 自定义Hook，用于处理所有与铸造相关的计算
 * 通过useMemo缓存计算结果，并提供统一的接口访问铸造计算函数
 * @param params 铸造计算所需参数
 * @returns 铸造计算相关的值和函数
 */
export function useMintingCalculations({
  totalSupply,
  target,
  mintRate,
  currencyUnit = 'SOL',
  tokenDecimals = 6,
}: MintingCalculationParams) {
  // 从目标值(target)中提取铸造总额
  const mintAmount = useMemo(() => {
    if (!target) return 0
    const targetMatch = target.match(/[0-9.]+/)
    if (!targetMatch) return 0
    return parseFloat(targetMatch[0])
  }, [target])

  // 解析总供应量 - 仅用于内部参考，不传递给计算函数
  const parsedTotalSupply = useMemo(() => {
    if (!totalSupply) return 0
    return parseValueWithUnit(totalSupply)
  }, [totalSupply])

  // 计算和格式化铸造比率 (1:X 格式)
  const mintingRatio = useMemo(() => {
    // 如果有预设汇率，优先使用
    if (mintRate) return mintRate

    // 如果关键参数缺失，返回空字符串
    if (!totalSupply || mintAmount === 0) return ''

    // 直接调用utils中的函数
    return getSimpleMintingRatio(
      totalSupply,
      currencyUnit,
      tokenDecimals,
      mintAmount
    )
  }, [totalSupply, mintAmount, mintRate, currencyUnit, tokenDecimals])

  // 计算铸造比率
  const mintingPrice = useMemo(() => {
    // 如果有预设汇率，优先使用
    if (mintRate) return mintRate

    // 如果关键参数缺失，返回默认值
    if (!totalSupply || mintAmount === 0) {
      return `0 ${currencyUnit}`
    }

    // 直接调用utils中的函数
    return calculateMintingPrice(
      totalSupply,
      currencyUnit,
      tokenDecimals,
      mintAmount
    )
  }, [totalSupply, mintAmount, mintRate, currencyUnit, tokenDecimals])

  // 获取兑换比率
  const getFormattedMintRate = (overrideParams?: MintingCalculationParams) => {
    // 使用传入的参数覆盖默认参数
    const finalTotalSupply = overrideParams?.totalSupply || totalSupply || ''
    const finalMintAmount = overrideParams?.target
      ? (() => {
          const targetMatch = overrideParams.target.match(/[0-9.]+/)
          return targetMatch ? parseFloat(targetMatch[0]) : mintAmount
        })()
      : mintAmount
    const finalMintRate = overrideParams?.mintRate || mintRate
    const finalTokenDecimals = overrideParams?.tokenDecimals || tokenDecimals

    // 直接调用utils中的函数
    return formatMintRate(
      finalTotalSupply,
      finalMintAmount,
      finalMintRate,
      finalTokenDecimals
    )
  }

  // 计算已铸造代币数量
  const calculateMintedAmount = (raised?: string, symbol?: string) => {
    // 直接调用utils中的函数
    return calcMintedAmount(
      totalSupply || '',
      raised || '',
      mintAmount,
      mintRate,
      tokenDecimals,
      symbol
    )
  }

  /**
   * 根据输入的货币金额计算可获得的代币数量
   */
  const calculateTokensFromCurrency = (currencyAmount: number): number => {
    // 直接调用utils中的函数
    return calcTokensFromCurrency(
      totalSupply || '',
      currencyAmount,
      mintAmount,
      mintRate,
      tokenDecimals
    )
  }

  /**
   * 根据输入的代币数量计算需要的货币金额
   */
  const calculateCurrencyFromTokens = (tokenAmount: number): number => {
    // 直接调用utils中的函数
    return calcCurrencyFromTokens(
      totalSupply || '',
      tokenAmount,
      mintAmount,
      mintRate,
      tokenDecimals
    )
  }

  return {
    mintAmount,
    parsedTotalSupply,
    mintingRatio,
    mintingPrice,
    parseMintingPrice,
    calculateMintedAmount,
    getFormattedMintRate,
    calculateTokensFromCurrency,
    calculateCurrencyFromTokens,
    // 为保持向后兼容，仍然导出旧函数名，但引用新函数
    calculateTokensFromPi: calculateTokensFromCurrency,
    calculatePiFromTokens: calculateCurrencyFromTokens,
  }
}

export default useMintingCalculations
