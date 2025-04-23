export function formatNumberWithUnit(num: number, decimals = 2): string {
  // 处理零值和负值
  if (num === 0) return '0'

  const absNum = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  // 第一性原理：根据数值大小自动选择合适的单位
  // 格式化大数字 - 优化单位选择逻辑
  if (absNum >= 1e12) {
    // 万亿 (T)
    return sign + (absNum / 1e12).toFixed(decimals).replace(/\.0+$/, '') + 'T'
  } else if (absNum >= 1e9) {
    // 十亿 (B)
    return sign + (absNum / 1e9).toFixed(decimals).replace(/\.0+$/, '') + 'B'
  } else if (absNum >= 1e6) {
    // 百万 (M)
    return sign + (absNum / 1e6).toFixed(decimals).replace(/\.0+$/, '') + 'M'
  } else if (absNum >= 1e3) {
    // 千 (K)
    return sign + (absNum / 1e3).toFixed(decimals).replace(/\.0+$/, '') + 'K'
  }

  // 普通数字格式化，避免不必要的小数位
  if (Number.isInteger(absNum)) {
    return sign + absNum.toString()
  }

  // 去除多余的0
  return sign + absNum.toFixed(decimals).replace(/\.0+$/, '')
}

export function getRelativeTime(pastDate: number): string {
  const now = Date.now()
  const past = new Date(pastDate).getTime()
  const diffMs = now - past

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  return `${days}d ${hours}h ago`
}

/**
 * 解析带单位的数字字符串为数值
 * @param value 输入值，例如 "3.14M"
 * @returns 解析后的数值
 */
export function parseValueWithUnit(value: string | number): number {
  if (typeof value === 'number') return value

  // 清理字符串，移除千位分隔符
  const cleanValue = value.trim().replace(/,/g, '')

  // 匹配数字和单位（更健壮的正则表达式，可处理不同格式）
  // 例如：314M、314.5M、314,000M 等
  const unitMatch = cleanValue.match(/^([0-9.]+)([KMBT])?$/i)

  if (!unitMatch) {
    // 如果没有匹配到符合模式的值，尝试直接解析为数字
    const parsedValue = parseFloat(cleanValue)
    return isNaN(parsedValue) ? 0 : parsedValue
  }

  const numValue = parseFloat(unitMatch[1])
  const unit = unitMatch[2]?.toUpperCase()

  if (isNaN(numValue)) return 0

  // 根据单位进行转换 (第一性原理: 1K = 1,000; 1M = 1,000,000 等)
  switch (unit) {
    case 'K':
      return numValue * 1e3
    case 'M':
      return numValue * 1e6
    case 'B':
      return numValue * 1e9
    case 'T':
      return numValue * 1e12
    default:
      return numValue
  }
}

/**
 * 格式化代币数量，适用于显示大数量
 * @param amount 代币数量
 * @param options 格式化选项
 * @returns 格式化后的字符串
 */
export function formatTokenAmount(
  amount: string | number,
  options: {
    abbreviate?: boolean
    decimals?: number
    withCommas?: boolean
  } = {}
): string {
  if (amount === null || amount === undefined) return '0'

  const { abbreviate = true, decimals = 2, withCommas = true } = options

  // 转换为数字
  let numValue =
    typeof amount === 'string' ? parseValueWithUnit(amount) : amount

  if (isNaN(numValue) || numValue === 0) return '0'

  // 大数字缩写
  if (abbreviate) {
    return formatNumberWithUnit(numValue, decimals)
  }

  // 使用千位分隔符
  if (withCommas) {
    return numValue.toLocaleString('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })
  }

  // 基本格式化
  return numValue.toFixed(decimals)
}

/**
 * 根据代币小数位格式化原始代币数量
 * @param amount 原始代币数量
 * @param tokenDecimal 代币小数位数（默认6位）
 * @param displayOptions 显示选项
 * @returns 格式化后的代币数量
 */
export function formatTokenAmountByDecimals(
  amount: string | number,
  tokenDecimal: number = 6,
  displayOptions: {
    abbreviate?: boolean
    decimals?: number
    withCommas?: boolean
  } = {}
): string {
  if (!amount) return '0'

  // 1. 第一性原理：从原始值转换为实际值
  const numValue =
    typeof amount === 'number'
      ? amount / Math.pow(10, tokenDecimal)
      : parseFloat(amount.replace(/,/g, '')) / Math.pow(10, tokenDecimal)

  if (isNaN(numValue) || numValue === 0) return '0'

  // 2. 格式化显示
  return formatTokenAmount(numValue, displayOptions)
}

/**
 * 计算代币铸造比率
 * @param totalSupply 总供应量 (可以是原始值或已格式化的字符串如"10M")
 * @param currencyUnit 货币单位
 * @param tokenDecimals 代币小数位数 - 如果totalSupply是原始值则需要此参数
 * @param mintAmount 铸造总额
 * @returns 格式化的铸造比率字符串
 */
export function calculateMintingPrice(
  totalSupply: string | number,
  currencyUnit: string,
  tokenDecimals: number,
  mintAmount: number
): string {
  // 使用parseTotalSupply解析总供应量
  const totalTokens = parseTotalSupply(totalSupply, tokenDecimals, true)

  if (totalTokens <= 0) return `0 ${currencyUnit}`

  // 计算价格（每个代币值多少SOL）
  // 使用原始值计算，所以需要除以10^tokenDecimals
  const price = mintAmount / (totalTokens / Math.pow(10, tokenDecimals)) / 2

  // SOL和Pi之间的精度差异处理
  const adjustedPrice =
    currencyUnit.toUpperCase() === 'SOL'
      ? price * 0.001 // SOL精度调整（SOL为9位小数，代币为6位小数）
      : price

  // 格式化科学计数法
  return adjustedPrice.toExponential(6) + ` ${currencyUnit}`
}

/**
 * 计算代币铸造比率的比例形式
 * @param totalSupply 总供应量 (可以是原始值或已格式化的字符串如"10M")
 * @param currencyUnit 货币单位 (当前实现中不再影响计算结果，仅保留参数以维持兼容性)
 * @param symbol 代币符号 (未使用)
 * @param tokenDecimals 代币小数位数 - 如果totalSupply是原始值则需要此参数
 * @param mintAmount 铸造总额 (实际调用时通常从token.target中提取)
 * @returns 格式化的铸造比率比例字符串
 */
export function calculateMintingRatio(
  totalSupply: string | number,
  currencyUnit: string,
  symbol: string,
  tokenDecimals: number,
  mintAmount: number
): string {
  // 使用parseTotalSupply解析总供应量
  const totalTokens = parseTotalSupply(totalSupply, tokenDecimals, true)

  if (totalTokens <= 0) return '1:0'

  // 计算交换比例（每单位SOL能兑换多少代币）
  // 现在totalTokens是原始值，需要除以10^tokenDecimals
  const ratio = totalTokens / Math.pow(10, tokenDecimals) / mintAmount / 2

  // 格式化为"1:X"格式
  // 不使用科学计数法或单位缩写，总是使用千位分隔符显示完整数字
  return `1:${Math.round(ratio).toLocaleString()}`
}

/**
 * 获取简单的铸造比率（不带单位）
 * @param totalSupply 总供应量 (可以是原始值或已格式化的字符串如"10M")
 * @param currencyUnit 货币单位 (当前实现中不再影响计算结果)
 * @param tokenDecimals 代币小数位数 - 如果totalSupply是原始值则需要此参数
 * @param mintAmount 铸造总额 (实际调用时通常从token.target中提取)
 * @returns 简单的铸造比率，格式为"1:X"
 */
export function getSimpleMintingRatio(
  totalSupply: string | number,
  currencyUnit: string,
  tokenDecimals: number,
  mintAmount: number
): string {
  // 使用parseTotalSupply解析总供应量，但不应用小数位数倍数
  // 因为这个函数处理的是显示值而非原始值
  const totalTokens = parseTotalSupply(totalSupply, tokenDecimals, false)

  if (totalTokens <= 0) return '1:0'

  // 计算每单位货币可兑换的代币数量的"/2"逻辑
  const ratio = totalTokens / mintAmount / 2

  // 对所有比例值使用千位分隔符显示完整数字，不使用单位缩写
  return `1:${Math.round(ratio).toLocaleString()}`
}

/**
 * 解析铸造比率值（适用于科学计数法和普通格式）
 * @param priceStr 价格字符串
 * @returns 解析后的数值
 */
export function parseMintingPrice(priceStr: string): number {
  // 使用正则表达式匹配科学计数法格式的数字
  const scientificNotationRegex = /([+-]?\d+(\.\d+)?)[eE]([+-]?\d+)/
  const matches = priceStr.match(scientificNotationRegex)

  if (matches) {
    // 完整的科学计数法解析
    const mantissa = parseFloat(matches[1])
    const exponent = parseInt(matches[3])
    return mantissa * Math.pow(10, exponent)
  } else {
    // 尝试直接解析普通数字格式
    return parseFloat(priceStr.replace(/[^0-9.e+-]/g, '') || '0')
  }
}

/**
 * 获取格式化的兑换比率 (X代币:1货币单位)
 * @param totalSupply 总供应量
 * @param mintAmount 铸造总额
 * @param mintRate 预设汇率
 * @param tokenDecimals 代币小数位
 * @returns 格式化的兑换比率
 */
export function getFormattedMintRate(
  totalSupply: string | number,
  mintAmount: number,
  mintRate?: string,
  tokenDecimals: number = 6
): string {
  // 如果有mintRate，将其转换为兑换比率
  if (mintRate) {
    // 使用parsemintRate获取铸造比率
    const ratio = parsemintRate(mintRate)
    if (ratio > 0) {
      if (ratio >= 1000000) {
        // 对于特别大的数值，使用千分位分隔符显示完整数字，不使用科学计数法或单位缩写
        return `1:${Math.round(ratio).toLocaleString()}`
      } else if (ratio >= 1000) {
        // 对于较大数值，使用千分位分隔符
        return `1:${Math.round(ratio).toLocaleString()}`
      } else if (ratio >= 1) {
        // 对于适中数值，保留整数
        return `1:${Math.round(ratio)}`
      } else {
        // 小数保留2位
        return `1:${ratio.toFixed(2)}`
      }
    }
  }

  // 如果没有mintRate或解析失败，则使用总供应量和铸造总额计算
  if (!totalSupply || mintAmount === 0) return '1:0'

  // 使用getSimpleMintingRatio计算
  return getSimpleMintingRatio(totalSupply, 'SOL', tokenDecimals, mintAmount)
}

/**
 * 计算已铸造代币数量
 * @param totalSupply 总供应量
 * @param raised 已融资金额
 * @param mintAmount 铸造总额
 * @param mintRate 预设汇率
 * @param tokenDecimals 代币小数位
 * @param symbol 代币符号
 * @returns 格式化的已铸造代币数量
 */
export function calculateMintedAmount(
  totalSupply: string | number,
  raised: string,
  mintAmount: number,
  mintRate?: string,
  tokenDecimals: number = 6,
  symbol?: string
): string {
  if (!raised || !totalSupply || mintAmount === 0) {
    return `0 ${symbol || ''}`
  }

  // 使用parseTotalSupply解析总供应量
  const parsedTotalSupply = parseTotalSupply(totalSupply, tokenDecimals, true)

  // 从raised提取数值部分
  const raisedAmount = parseFloat(raised.replace(/[^0-9.]/g, ''))
  if (isNaN(raisedAmount) || raisedAmount <= 0) {
    return `0 ${symbol || ''}`
  }

  // 铸造比例: 1单位货币可兑换的代币数量
  // 使用parsemintRate获取铸造比率(非价格)
  let exchangeRate = parsemintRate(mintRate)

  // 如果没有mintRate或解析失败，使用总供应量和铸造总额直接计算
  if (exchangeRate <= 0) {
    // 注意：parsedTotalSupply是原始值，需要除以10^tokenDecimals
    exchangeRate =
      parsedTotalSupply / Math.pow(10, tokenDecimals) / mintAmount / 2
  }

  // 计算已铸造代币数量 = 已铸额度 * 铸造比率
  const mintedAmount = Math.round(raisedAmount * exchangeRate)

  // 格式化显示(添加千位分隔符)
  return `${mintedAmount.toLocaleString()} ${symbol || ''}`
}

/**
 * 根据输入的货币金额计算可获得的代币数量
 * @param totalSupply 总供应量
 * @param currencyAmount 货币金额
 * @param mintAmount 铸造总额
 * @param mintRate 预设汇率
 * @param tokenDecimals 代币小数位
 * @returns 可获得的代币数量
 */
export function calculateTokensFromCurrency(
  totalSupply: string | number,
  currencyAmount: number,
  mintAmount: number,
  mintRate?: string,
  tokenDecimals: number = 6
): number {
  if (
    !currencyAmount ||
    currencyAmount <= 0 ||
    !totalSupply ||
    mintAmount === 0
  ) {
    return 0
  }

  // 使用parseTotalSupply解析总供应量
  const parsedTotalSupply = parseTotalSupply(totalSupply, tokenDecimals, true)

  // 获取铸造比率 (使用parsemintRate获取铸造比率，非价格)
  let exchangeRate = parsemintRate(mintRate)

  // 如果没有mintRate或解析失败，使用总供应量和铸造总额计算
  if (exchangeRate <= 0) {
    // parsedTotalSupply是原始值，需要除以10^tokenDecimals
    exchangeRate =
      parsedTotalSupply / Math.pow(10, tokenDecimals) / mintAmount / 2
  }

  // 计算代币数量 = 输入金额 * 铸造比率
  return Math.floor(parsedTotalSupply * currencyAmount * exchangeRate)
}

/**
 * 根据输入的代币数量计算需要的货币金额
 * @param totalSupply 总供应量
 * @param tokenAmount 代币数量
 * @param mintAmount 铸造总额
 * @param mintRate 预设汇率
 * @param tokenDecimals 代币小数位
 * @returns 需要的货币金额
 */
export function calculateCurrencyFromTokens(
  totalSupply: string | number,
  tokenAmount: number,
  mintAmount: number,
  mintRate?: string,
  tokenDecimals: number = 6
): number {
  if (!tokenAmount || tokenAmount <= 0 || !totalSupply || mintAmount === 0) {
    return 0
  }

  // 使用parseTotalSupply解析总供应量
  const parsedTotalSupply = parseTotalSupply(totalSupply, tokenDecimals, true)

  // 获取铸造比率率 (使用parsemintRate获取价格，非铸造比率)
  let exchangeRate = parsemintRate(mintRate, true)

  // 如果没有mintRate或解析失败，使用总供应量和铸造总额计算
  if (exchangeRate <= 0) {
    // parsedTotalSupply是原始值，需要除以10^tokenDecimals
    exchangeRate =
      (2 * mintAmount) / (parsedTotalSupply / Math.pow(10, tokenDecimals))
  }

  // 计算货币金额 = 代币数量 * 价格
  // 向上取整到3位小数，确保有足够的货币支付
  return Math.ceil(tokenAmount * exchangeRate * 1000) / 1000
}

/**
 * 解析总供应量，统一处理不同格式的输入
 * @param totalSupply 总供应量 (可以是原始值或已格式化的字符串如"10M")
 * @param tokenDecimals 代币小数位数
 * @param applyDecimals 是否需要应用小数位数倍数 (默认true)
 * @returns 解析后的数值
 */
export function parseTotalSupply(
  totalSupply: string | number,
  tokenDecimals: number = 6,
  applyDecimals: boolean = true
): number {
  let parsedValue: number

  if (typeof totalSupply === 'string' && /[KMBT]$/i.test(totalSupply)) {
    // 如果字符串包含单位后缀(K,M,B,T)，使用parseValueWithUnit解析
    parsedValue = parseValueWithUnit(totalSupply)
    // 对于带单位的字符串，如果需要，再乘以10^tokenDecimals来得到完整的原始值
    if (applyDecimals) {
      parsedValue *= Math.pow(10, tokenDecimals)
    }
  } else if (typeof totalSupply === 'number') {
    // 如果是数字，不需要处理
    parsedValue = totalSupply
  } else {
    // 其他情况尝试解析数字
    parsedValue = parseFloat(String(totalSupply).replace(/,/g, ''))
  }

  return parsedValue > 0 ? parsedValue : 0
}

/**
 * 解析预设汇率，返回有效的汇率值
 * @param mintRate 预设汇率字符串
 * @param asPrice 是否将结果作为价格而非铸造比率返回 (默认false)
 * @returns 解析后的汇率数值，无效时返回0
 */
export function parsemintRate(
  mintRate?: string,
  asPrice: boolean = false
): number {
  if (!mintRate) return 0

  const rate = parseFloat(mintRate.replace(/[^0-9.e+-]/g, ''))
  if (rate <= 0) return 0

  // 根据需要返回价格或铸造比率
  return asPrice ? rate : 1 / rate
}

/**
 * 根据输入的任意货币金额计算可获得的代币数量
 * @deprecated 请使用更通用的calculateTokensFromCurrency函数
 * @param totalSupply 总供应量
 * @param currencyAmount 任意货币金额(Pi/SOL等)
 * @param mintAmount 铸造总额
 * @param mintRate 预设汇率
 * @param tokenDecimals 代币小数位
 * @returns 可获得的代币数量
 */
export function calculateTokensFromPi(
  totalSupply: string | number,
  currencyAmount: number,
  mintAmount: number,
  mintRate?: string,
  tokenDecimals: number = 6
): number {
  return calculateTokensFromCurrency(
    totalSupply,
    currencyAmount,
    mintAmount,
    mintRate,
    tokenDecimals
  )
}

/**
 * 根据输入的代币数量计算需要的任意货币金额
 * @deprecated 请使用更通用的calculateCurrencyFromTokens函数
 * @param totalSupply 总供应量
 * @param tokenAmount 代币数量
 * @param mintAmount 铸造总额
 * @param mintRate 预设汇率
 * @param tokenDecimals 代币小数位
 * @returns 需要的任意货币金额(Pi/SOL等)
 */
export function calculatePiFromTokens(
  totalSupply: string | number,
  tokenAmount: number,
  mintAmount: number,
  mintRate?: string,
  tokenDecimals: number = 6
): number {
  return calculateCurrencyFromTokens(
    totalSupply,
    tokenAmount,
    mintAmount,
    mintRate,
    tokenDecimals
  )
}
