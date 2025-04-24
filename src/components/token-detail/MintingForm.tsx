'use client'

import { useState, useEffect, memo } from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Circle,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Icon,
} from '@chakra-ui/react'
import { FaCoins, FaUndo, FaChevronRight, FaTimes } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useProgram } from '@/web3/fairMint/hooks/useProgram'
import { useSolana } from '@/contexts/solanaProvider'
import { PublicKey } from '@solana/web3.js'
import { useAppSelector } from '@/store/hooks'
import { useFairCurve } from '@/web3/fairMint/hooks/useFairCurve'
import { MintToken, TokenInfo } from '@/api/types'
import { CLMM_PROGRAM_ID } from '@/config'
import BigNumber from 'bignumber.js'
import useMintingCalculations from '@/hooks/useMintingCalculations'
import ErrorDisplay from '@/components/common/ErrorDisplay'

interface Token extends TokenInfo {
  logo: string
  description?: string
}

interface MintingFormProps {
  token: MintToken
  tokenAccount?: string | null
  tokenBalance?: number | null
  isOpen?: boolean
  onClose?: () => void
  isModal?: boolean
  onBalanceUpdate?: (v: any) => void
}

const MintingForm: React.FC<MintingFormProps> = memo(
  ({
    token,
    tokenAccount,
    tokenBalance,
    isOpen,
    onClose,
    isModal = false,
    onBalanceUpdate,
  }) => {
    const [walletBalance, setWalletBalance] = useState<number>(0) // 初始化为0
    const [amount, setAmount] = useState<string>('')
    const [submitting, setSubmitting] = useState(false)
    const [cancelling, setCancelling] = useState(false)
    const [mintedAmount, setMintedAmount] = useState<number>(0) // 已铸额度
    const [estimatedTokens, setEstimatedTokens] = useState<string>('0') // 获得代币数量
    const [activeTab, setActiveTab] = useState<number>(0)
    const [refundAmount, setRefundAmount] = useState<string>('') // 新增：退还金额输入
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [tokenRefundAmount, setTokenRefundAmount] = useState<string>('')
    const { t } = useTranslation()
    const { mintToken, returnToken } = useProgram()
    const { conn, publicKey } = useSolana()
    const isLoggedIn = useAppSelector(state => state.user.isLoggedIn)
    const { data: fairCurveData, refetch } = useFairCurve(
      conn,
      token.address
        ? token.address.trim() !== ''
          ? token.address
          : undefined
        : undefined
    )
    const {
      isOpen: disclosureIsOpen,
      onOpen,
      onClose: disclosureOnClose,
    } = useDisclosure()

    const currencyUnit = token.currencyUnit || 'SOL'
    const cardBg = useColorModeValue('white', 'gray.800')
    const inputBg = useColorModeValue('white', 'gray.700')
    const toast = useToast()

    // 使用自定义Hook处理铸造计算
    const {
      mintingPrice,
      mintingRatio,
      calculateTokensFromCurrency,
      calculateCurrencyFromTokens,
    } = useMintingCalculations({
      totalSupply: token.totalSupply,
      target: token.target,
      mintRate: fairCurveData?.feeRate,
      currencyUnit: token.currencyUnit || 'SOL',
      tokenDecimals: token.tokenDecimal || 0,
    })

    // 在组件顶部添加 inputFocus 状态
    const [inputFocus, setInputFocus] = useState<'payAmount' | 'tokenAmount'>(
      'payAmount'
    )
    const [payAmount, setPayAmount] = useState<number | null>(null)
    const [tokenAmount, setTokenAmount] = useState<number | null>(null)

    // 添加错误状态
    const [mintError, setMintError] = useState<string | null>(null)
    const [refundError, setRefundError] = useState<string | null>(null)

    // 获取钱包余额的显示值
    const getDisplayBalance = (balance: number) => {
      return new BigNumber(balance).div(1e9).toFixed(4)
    }

    // 获取钱包余额
    useEffect(() => {
      const fetchBalance = async () => {
        if (!publicKey) {
          setWalletBalance(0)
          return
        }

        try {
          // 更新 SOL 余额
          const pubKey = new PublicKey(publicKey)
          const balance = await conn.getBalance(pubKey)
          setWalletBalance(balance) // 保存原始值

          // 更新代币余额（如果有 tokenAccount）
          if (tokenAccount) {
            const tokenAccountPubkey = new PublicKey(tokenAccount)
            const tokenAccountInfo = await conn.getTokenAccountBalance(
              tokenAccountPubkey
            )
            const newBalance = tokenAccountInfo.value.uiAmount || 0

            if (onBalanceUpdate) {
              onBalanceUpdate(newBalance)
            }
          }
        } catch (error) {
          console.error('获取余额失败:', error)
          setWalletBalance(0)
        }
      }

      fetchBalance()
      const intervalId = setInterval(fetchBalance, 5000)
      return () => clearInterval(intervalId)
    }, [conn, publicKey, tokenAccount, onBalanceUpdate])

    // 设置初始移动端状态和监听窗口大小变化
    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 992) // lg breakpoint
      }

      // 设置初始状态
      checkIsMobile()

      // 添加监听器
      window.addEventListener('resize', checkIsMobile)

      // 移除监听器
      return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    // 如果是弹窗模式但不是移动端，需要触发一个关闭效果
    useEffect(() => {
      if (isModal && !isMobile && isOpen && onClose) {
        onClose()
      }
    }, [isModal, isMobile, isOpen, onClose])

    // 检查金额是否有效
    const isAmountValid = () => {
      if (
        !amount ||
        isNaN(parseFloat(amount)) ||
        safeParseFloat(amount) < 0.01
      ) {
        return false
      }
      // 检查余额是否足够
      return safeParseFloat(amount) <= walletBalance
    }

    // 检查退还金额是否有效
    const isRefundAmountValid = () => {
      if (
        !refundAmount ||
        isNaN(parseFloat(refundAmount)) ||
        safeParseFloat(refundAmount) <= 0
      ) {
        return false
      }
      // 检查退还金额是否小于等于已铸造金额
      return safeParseFloat(refundAmount) <= mintedAmount
    }

    // 获取最新余额的函数
    const updateBalances = async () => {
      if (!publicKey) {
        console.error('Public key not available')
        return
      }

      try {
        // 更新 SOL 余额
        const pubKey = new PublicKey(publicKey)
        const balance = await conn.getBalance(pubKey)
        setWalletBalance(balance)

        // 更新代币余额
        if (tokenAccount) {
          const tokenAccountPubkey = new PublicKey(tokenAccount)
          const tokenAccountInfo = await conn.getTokenAccountBalance(
            tokenAccountPubkey
          )
          const newBalance = tokenAccountInfo.value.uiAmount || 0

          // 通过 props 更新父组件的 tokenBalance
          if (onBalanceUpdate) {
            onBalanceUpdate(newBalance)
          }
        }
      } catch (error) {
        console.error('更新余额失败:', error)
      }
    }

    // 修改铸造提交
    const handleSubmit = async () => {
      if (!isAmountValid || !amount || !fairCurveData) {
        return
      }

      try {
        // 每次尝试提交前清空先前的错误
        setMintError(null)

        if (!publicKey) {
          toast({
            title: t('请先连接钱包'),
            status: 'error',
          })
          return
        }

        if (!isLoggedIn) {
          toast({
            title: t('请先登录'),
            status: 'error',
          })
          return
        }

        if (!isAmountValid()) return

        // 确保token.address存在
        if (!token.address) {
          toast({
            title: t('代币地址无效'),
            description: t('无法执行铸造操作'),
            status: 'error',
          })
          return
        }

        setSubmitting(true)
        const mintAmount = safeParseFloat(amount)

        // 调用真实的mintToken函数，传入货币金额（转换为最小单位）和token地址
        await mintToken(mintAmount * 1e9, token.address)

        // 等待交易确认后更新余额和代币信息
        setTimeout(async () => {
          // 更新 SOL 余额
          await updateBalances()
          // 更新 FairCurve 数据
          if (fairCurveData && token.address) {
            await refetch()
          }
          // 更新代币余额
        }, 2000)

        // 显示成功提示
        const amountFormatted = Math.floor(
          safeParseFloat(getEstimatedTokens(amount))
        ).toLocaleString()
        const descMessage = t('receivedTokens')
          .replace('{amount}', amountFormatted)
          .replace('{symbol}', token.symbol)

        toast({
          title: t('mintingSuccess'),
          description: descMessage,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })

        // 重置输入金额
        setAmount('')
      } catch (error) {
        console.error('铸造失败:', error)
        const errorMessage =
          error instanceof Error ? error.message : t('未知错误')

        // 设置错误状态而不是显示toast
        setMintError(errorMessage)

        // 仍然保留toast提示
        toast({
          title: t('铸造失败'),
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      } finally {
        setSubmitting(false)
      }
    }

    // 获取铸造比率 - 优先使用mintRate，否则计算
    const getMintingPrice = (displayMode: 'price' | 'ratio' = 'price') => {
      if (displayMode === 'ratio') {
        return mintingRatio
      } else {
        return mintingPrice
      }
    }

    // 检查代币退还数量是否有效
    const isTokenRefundAmountValid = () => {
      if (
        !refundAmount ||
        isNaN(parseFloat(refundAmount)) ||
        parseFloat(refundAmount) <= 0
      ) {
        return false
      }
      // 检查退还代币数量是否小于等于实际代币余额
      return parseFloat(refundAmount) <= (tokenBalance || 0)
    }

    // 快速选择退还代币百分比
    const quickSelectTokenRefundPercent = (percent: number) => {
      if (
        !tokenBalance ||
        !fairCurveData?.supplied ||
        !fairCurveData?.liquiditySol
      )
        return

      // 计算初始的token数量
      const initialTokenAmount = new BigNumber(tokenBalance).times(percent)

      // 计算对应的货币数量
      const tokenAmountInSmallestUnit = initialTokenAmount.times(1e6) // 转换为原始单位
      const supplied = new BigNumber(fairCurveData.supplied)
      const liquidityCurrency = new BigNumber(fairCurveData.liquiditySol)

      // 计算货币数量
      const rawCurrencyAmount = tokenAmountInSmallestUnit
        .times(liquidityCurrency)
        .div(supplied)
        .div(1e9)

      // 向下取整到最接近的0.001
      const roundedCurrencyAmount = new BigNumber(
        Math.floor(rawCurrencyAmount.times(1000).toNumber()) / 1000
      )

      // 反向计算实际可退还的代币数量
      const actualTokenAmount = roundedCurrencyAmount
        .times(1e9) // 转回最小单位
        .times(supplied)
        .div(liquidityCurrency)
        .div(1e6) // 转换为代币单位
        .integerValue(BigNumber.ROUND_FLOOR) // 向下取整到整数

      // 更新退还金额输入框
      setRefundAmount(actualTokenAmount.toString())
    }

    // 计算基于代币数量的货币金额（不含手续费）
    const calculateTotalCurrencyAmount = () => {
      if (
        !isTokenRefundAmountValid() ||
        !fairCurveData?.supplied ||
        !fairCurveData?.liquiditySol
      ) {
        return new BigNumber(0)
      }

      const tokenAmount = new BigNumber(refundAmount).times(1e6) // 转换为原始单位
      const supplied = new BigNumber(fairCurveData.supplied)
      const liquiditySol = new BigNumber(fairCurveData.liquiditySol)

      // 计算结果后转换为货币单位
      const rawAmount = tokenAmount.times(liquiditySol).div(supplied).div(1e9)

      // 向下取整到最接近的0.001
      return new BigNumber(Math.floor(rawAmount.times(1000).toNumber()) / 1000)
    }

    // 计算基于代币数量的实际货币退还金额
    const getActualCurrencyRefundAmount = () => {
      const totalCurrencyAmount = calculateTotalCurrencyAmount()
      if (totalCurrencyAmount.isZero()) return '0.000'

      // 计算手续费（2%）
      const feeAmount = totalCurrencyAmount.times(0.02)

      // 实际退还金额应该是总金额减去手续费
      const actualRefund = totalCurrencyAmount.minus(feeAmount)
      return actualRefund.toFixed(3) // 保持3位小数
    }

    // 计算基于代币数量的货币手续费
    const getCurrencyRefundFee = () => {
      const totalCurrencyAmount = calculateTotalCurrencyAmount()
      if (totalCurrencyAmount.isZero()) return '0.000'

      // 2% 手续费
      const feeAmount = totalCurrencyAmount.times(0.02)
      return feeAmount.toFixed(3) // 保持3位小数
    }

    // 修改取消铸造 - 基于代币数量
    const handleCancel = async () => {
      try {
        // 每次尝试提交前清空先前的错误
        setRefundError(null)

        if (!isTokenRefundAmountValid() || !publicKey || !tokenAccount) {
          return
        }

        // 确保token.address存在
        if (!token.address) {
          toast({
            title: t('代币地址无效'),
            description: t('无法执行退还操作'),
            status: 'error',
          })
          return
        }

        setCancelling(true)
        // 将代币数量乘以 1e6 以匹配代币精度
        const tokenRefundValue = safeParseFloat(refundAmount) * 1e6

        // 调用合约的退还函数，参数顺序：token地址，退还数量，手续费账户地址
        const feeAccountAddress = CLMM_PROGRAM_ID
        console.log(
          token.address,
          tokenRefundValue,
          feeAccountAddress,
          'token.address, tokenRefundValue, feeAccountAddress'
        )

        await returnToken(token.address, tokenRefundValue, feeAccountAddress)

        // 等待交易确认后更新余额
        setTimeout(async () => {
          await updateBalances()
        }, 2000)

        // 显示成功消息
        const refundAmountFormatted = Math.floor(
          safeParseFloat(refundAmount)
        ).toLocaleString()
        const refundMessage = t('refundedTokens')
          .replace('{amount}', refundAmountFormatted)
          .replace('{symbol}', token.symbol)

        toast({
          title: t('cancelMint'),
          description: refundMessage,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })

        // 重置输入
        setRefundAmount('')

        // 如果全部退还，切换回铸造页面
        if (safeParseFloat(refundAmount) >= (tokenBalance || 0)) {
          setActiveTab(0)
        }
      } catch (error) {
        console.error('退还失败:', error)
        const errorMessage =
          error instanceof Error ? error.message : t('未知错误')

        // 设置错误状态而不是显示toast
        setRefundError(errorMessage)

        // 仍然保留toast提示
        toast({
          title: t('退还失败'),
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      } finally {
        setCancelling(false)
      }
    }

    // 计算铸造进度
    const getMintProgress = () => {
      if (!fairCurveData) return 0

      try {
        const supplied = new BigNumber(fairCurveData.supplied)
        const remaining = new BigNumber(fairCurveData.remaining)

        if (supplied.isZero()) return 0

        // 使用公式: 1 - remaining/supplied
        const progress = new BigNumber(1)
          .minus(remaining.div(supplied))
          .times(100)

        // 确保进度在0-100范围内
        if (progress.isLessThan(0)) return '0'
        if (progress.isGreaterThan(100)) return '100'

        return progress.toFixed(2)
      } catch (error) {
        console.error('计算铸造进度时出错:', error)
        return 0
      }
    }

    // 安全地将字符串转换为数字，避免溢出
    const safeParseFloat = (str: string): number => {
      try {
        const num = parseFloat(str)
        if (Number.isNaN(num)) return 0

        // 确保在安全整数范围内
        if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
          // 对于非常大的数字，使用BigNumber处理
          const bn = new BigNumber(str)
          // 如果BigNumber转换后溢出，返回安全的最大值
          if (bn.isGreaterThan(Number.MAX_SAFE_INTEGER)) {
            return Number.MAX_SAFE_INTEGER
          }
          if (bn.isLessThan(-Number.MAX_SAFE_INTEGER)) {
            return -Number.MAX_SAFE_INTEGER
          }
        }

        return num
      } catch (error) {
        console.error('字符串转换为数字时出错:', error)
        return 0
      }
    }

    // 获取预估获取的代币数量
    const getEstimatedTokens = (amount: string): string => {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return '0'
      }

      try {
        // 使用安全解析
        const safeAmount = safeParseFloat(amount)
        // 使用 Hook 提供的计算函数
        const tokens = calculateTokensFromCurrency(safeAmount)
        return tokens.toString()
      } catch (error) {
        console.error('计算代币数量时出错:', error)
        return '0'
      }
    }

    // 计算手续费
    const getFee = () => {
      if (!isAmountValid()) return '0'
      return new BigNumber(amount).times(0.02).toFixed(4)
    }

    // 计算退还手续费
    const getRefundFee = () => {
      if (!isRefundAmountValid()) return '0'
      return new BigNumber(refundAmount).times(0.02).toFixed(2)
    }

    // 计算实际退还金额
    const getActualRefundAmount = () => {
      if (!isRefundAmountValid()) return '0'
      return new BigNumber(refundAmount).times(0.98).toFixed(2)
    }

    // 修改快速选择函数
    const quickSelect = (value: number) => {
      try {
        // 安全转换钱包余额
        const walletBalanceSol = new BigNumber(walletBalance).div(1e9)

        if (new BigNumber(value).isGreaterThan(walletBalanceSol)) {
          toast({
            title: t('insufficientBalance'),
            description: t('walletBalanceInsufficient', {
              balance: getDisplayBalance(walletBalance),
              currency: currencyUnit,
            }),
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          })
          return
        }
        setAmount(value.toString())
      } catch (error) {
        console.error('处理金额选择时出错:', error)
        toast({
          title: t('操作失败'),
          description: t('处理金额时出现错误'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }

    // 重置金额
    const resetAmount = () => {
      setAmount('')
    }

    // 重置退还金额
    const resetRefundAmount = () => {
      setRefundAmount('')
    }

    // 监听 amount 变化，更新估算代币数量
    useEffect(() => {
      if (amount) {
        const estimatedAmount = calculateTokensFromCurrency(parseFloat(amount))
        setEstimatedTokens(estimatedAmount.toString())
      } else {
        setEstimatedTokens('0')
      }
    }, [amount, calculateTokensFromCurrency])

    // 添加双向绑定处理
    // 监听payAmount变化，自动计算tokenAmount
    useEffect(() => {
      if (inputFocus === 'payAmount' && payAmount !== null) {
        // 使用Hook提供的计算函数
        const calculatedTokenAmount = calculateTokensFromCurrency(payAmount)
        setTokenAmount(calculatedTokenAmount)
        setEstimatedTokens(calculatedTokenAmount.toString())
      }
    }, [payAmount, inputFocus, calculateTokensFromCurrency])

    // 监听tokenAmount变化，自动计算payAmount
    useEffect(() => {
      if (inputFocus === 'tokenAmount' && tokenAmount !== null) {
        // 使用Hook提供的计算函数
        const calculatedPayAmount = calculateCurrencyFromTokens(tokenAmount)
        setPayAmount(calculatedPayAmount)
        setAmount(calculatedPayAmount.toString())
      }
    }, [tokenAmount, inputFocus, calculateCurrencyFromTokens])

    // 输入框处理函数
    const handlePayAmountChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value
      setInputFocus('payAmount')
      setAmount(value)
      setPayAmount(value ? parseFloat(value) : null)
    }

    const handleTokenAmountChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = event.target.value
      setInputFocus('tokenAmount')
      setTokenAmount(value ? parseFloat(value) : null)
    }

    // 渲染铸造标签页内容
    const renderMintingTab = () => {
      // 存在错误状态时显示错误界面
      if (mintError) {
        return (
          <Box my={4} textAlign="center">
            <ErrorDisplay
              message={mintError}
              onRetry={() => {
                setMintError(null)
                handleSubmit()
              }}
            />
          </Box>
        )
      }

      return (
        <VStack spacing={4} align="stretch">
          {/* 金额输入 */}
          <Box>
            <Text
              mb={{ base: 2, md: 3 }}
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="medium"
              color="gray.600"
            >
              {t('mintingAmount')}
            </Text>
            <Box
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              boxShadow="md"
            >
              <Flex
                position="relative"
                align="center"
                px={4}
                py={3}
                borderRadius="lg"
              >
                {/* 数字输入 */}
                <Box flexGrow={1} pr={{ base: 8, md: 12 }}>
                  <Input
                    type="number"
                    value={amount}
                    onChange={handlePayAmountChange}
                    variant="unstyled"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="bold"
                    placeholder="0"
                    min="0.01"
                    step="0.01"
                    max={walletBalance}
                    color="gray.800"
                    _placeholder={{ color: 'gray.300' }}
                    paddingInlineStart={0}
                  />
                </Box>

                {/* SOL 单位 */}
                <Box
                  flexShrink={0}
                  bg="purple.50"
                  px={{ base: 3, md: 4 }}
                  py={{ base: 1, md: 2 }}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="purple.100"
                >
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    color="brand.primary"
                  >
                    {currencyUnit}
                  </Text>
                </Box>

                {/* 清除按钮 - 仅在有值时显示，移到右侧 */}
                {amount && (
                  <IconButton
                    position="absolute"
                    right={{
                      base: currencyUnit === 'SOL' ? 24 : 16,
                      md: currencyUnit === 'SOL' ? 28 : 20,
                    }}
                    top="50%"
                    transform="translateY(-50%)"
                    aria-label="清除输入"
                    icon={<FaTimes />}
                    size="sm"
                    variant="ghost"
                    colorScheme="purple"
                    opacity={0.6}
                    onClick={resetAmount}
                    _hover={{ opacity: 1 }}
                    zIndex="1"
                  />
                )}
              </Flex>

              {/* 钱包余额提示 */}
              <Flex
                justify="flex-end"
                bg="gray.50"
                px={{ base: 4, md: 6 }}
                py={{ base: 1.5, md: 2 }}
                borderTop="1px solid"
                borderColor="gray.100"
              >
                {renderWalletBalance()}
              </Flex>
            </Box>
          </Box>

          {/* 快速选择按钮 */}
          <Flex
            justify="space-between"
            gap={{ base: 2, md: 3 }}
            mt={{ base: 3, md: 5 }}
          >
            <Button
              onClick={() => quickSelect(0.1)}
              flex="1"
              variant="outline"
              size="sm"
              borderRadius="md"
              fontWeight="bold"
              h={{ base: '40px', md: '48px' }}
              boxShadow="sm"
            >
              0.1 {currencyUnit}
            </Button>
            <Button
              onClick={() => quickSelect(0.2)}
              flex="1"
              variant="outline"
              size="sm"
              borderRadius="md"
              fontWeight="bold"
              h={{ base: '40px', md: '48px' }}
              boxShadow="sm"
            >
              0.2 {currencyUnit}
            </Button>
            <Button
              onClick={() => quickSelect(0.5)}
              flex="1"
              variant="outline"
              size="sm"
              borderRadius="md"
              fontWeight="bold"
              h={{ base: '40px', md: '48px' }}
              boxShadow="sm"
            >
              0.5 {currencyUnit}
            </Button>
            <Button
              onClick={() => quickSelect(1)}
              flex="1"
              variant="outline"
              size="sm"
              borderRadius="md"
              fontWeight="bold"
              h={{ base: '40px', md: '48px' }}
              boxShadow="sm"
            >
              1 {currencyUnit}
            </Button>
          </Flex>

          {/* 预估代币获取和历史铸造信息 */}
          <Box my={3}>
            <Flex
              justify="space-between"
              align="center"
              fontSize={{ base: 'xs', md: 'sm' }}
              color="gray.600"
              mb={2}
            >
              <Text>{t('estimatedTokens')}:</Text>
              <HStack>
                <Text fontWeight="semibold" color="brand.primary">
                  {getEstimatedTokens(amount)}
                </Text>
                <Text>{token.symbol}</Text>
              </HStack>
            </Flex>
          </Box>

          {/* 操作按钮 */}
          <Button
            onClick={handleSubmit}
            bg="brand.primary"
            _hover={{ bg: 'brand.light' }}
            color="white"
            size={{ base: 'md', md: 'lg' }}
            w="100%"
            h={{ base: '50px', md: '54px' }}
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="bold"
            isDisabled={!isAmountValid()}
            isLoading={submitting}
            loadingText={t('processing')}
            boxShadow="md"
            borderRadius="md"
            transition="all 0.3s"
            _active={{ transform: 'translateY(2px)', boxShadow: 'none' }}
            mt={0}
          >
            {t('mintToken')}
          </Button>
        </VStack>
      )
    }

    // 渲染退还标签页内容
    const renderRefundTab = () => {
      // 存在错误状态时显示错误界面
      if (refundError) {
        return (
          <Box my={4} textAlign="center">
            <ErrorDisplay
              message={refundError}
              onRetry={() => {
                setRefundError(null)
                handleCancel()
              }}
            />
          </Box>
        )
      }

      // 检查是否有代币余额
      if (!tokenAccount || !tokenBalance || tokenBalance <= 0) {
        return (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={{ base: 10, md: 14 }}
            px={{ base: 4, md: 6 }}
            bg="gray.50"
            borderRadius="md"
            boxShadow="sm"
            m={{ base: 1, md: 2 }}
          >
            <Circle
              size={{ base: '60px', md: '80px' }}
              bg="white"
              mb={{ base: 4, md: 6 }}
              boxShadow="sm"
            >
              <Icon
                as={FaCoins}
                boxSize={{ base: '24px', md: '32px' }}
                color="gray.400"
              />
            </Circle>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="semibold"
              color="gray.700"
              mb={2}
            >
              {t('noMintedTokens')}
            </Text>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              color="gray.500"
              mb={{ base: 6, md: 8 }}
              textAlign="center"
            >
              {t('refundAnytime')}
            </Text>
            <Button
              bg="brand.primary"
              color="white"
              variant="solid"
              onClick={() => setActiveTab(0)}
              borderRadius="md"
              px={{ base: 6, md: 8 }}
              py={{ base: 4, md: 6 }}
              leftIcon={<FaChevronRight />}
              _hover={{ bg: 'brand.light' }}
              boxShadow="md"
              size={{ base: 'md', md: 'lg' }}
            >
              {t('goToMint')}
            </Button>
          </Flex>
        )
      }

      // 使用实际的代币余额
      const totalTokens = tokenBalance

      return (
        <VStack
          spacing={{ base: 4, md: 6 }}
          align="stretch"
          py={{ base: 2, md: 3 }}
        >
          {/* 退还代币输入 */}
          <Box>
            <Text
              mb={{ base: 2, md: 3 }}
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="medium"
              color="gray.600"
            >
              {t('refundAmount')}
            </Text>
            <Box
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              boxShadow="md"
            >
              <Flex
                position="relative"
                align="center"
                px={{ base: 4, md: 6 }}
                py={{ base: 4, md: 5 }}
                borderRadius="lg"
              >
                {/* 数字输入 */}
                <Box flexGrow={1}>
                  <Input
                    type="number"
                    value={refundAmount}
                    onChange={e => setRefundAmount(e.target.value)}
                    variant="unstyled"
                    fontSize={{ base: '2xl', md: '4xl' }}
                    fontWeight="bold"
                    placeholder="0"
                    min="0"
                    step="1"
                    max={totalTokens}
                    color="gray.800"
                    _placeholder={{ color: 'gray.300' }}
                    paddingInlineStart={0}
                  />
                </Box>

                {/* 清除按钮 - 仅在有值时显示 */}
                {refundAmount && (
                  <IconButton
                    position="absolute"
                    right={{ base: 4, md: 6 }}
                    top="50%"
                    transform="translateY(-50%)"
                    aria-label="清除输入"
                    icon={<FaTimes />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    opacity={0.6}
                    onClick={resetRefundAmount}
                    _hover={{ opacity: 1 }}
                    zIndex="1"
                  />
                )}
              </Flex>

              {/* 最大可退还代币提示 */}
              <Flex
                justify="flex-end"
                bg="gray.50"
                px={{ base: 4, md: 6 }}
                py={{ base: 1.5, md: 2 }}
                borderTop="1px solid"
                borderColor="gray.100"
              >
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">
                  {t('availableBalance')}:{' '}
                  <Text as="span" fontWeight="bold" color="gray.700">
                    {tokenBalance} {token.symbol}
                  </Text>
                </Text>
              </Flex>
            </Box>
          </Box>

          {/* 快速选择百分比按钮 */}
          <Flex
            justify="space-between"
            gap={{ base: 2, md: 3 }}
            mt={{ base: 3, md: 5 }}
          >
            <Button
              onClick={() => quickSelectTokenRefundPercent(0.25)}
              flex="1"
              variant="outline"
              borderColor="red.200"
              color="red.500"
              size={{ base: 'md', md: 'lg' }}
              borderRadius="md"
              fontWeight="medium"
              _hover={{ bg: 'red.50', borderColor: 'red.300' }}
              h={{ base: '40px', md: '52px' }}
              boxShadow="sm"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              25%
            </Button>
            <Button
              onClick={() => quickSelectTokenRefundPercent(0.5)}
              flex="1"
              variant="outline"
              borderColor="red.200"
              color="red.500"
              size={{ base: 'md', md: 'lg' }}
              borderRadius="md"
              fontWeight="medium"
              _hover={{ bg: 'red.50', borderColor: 'red.300' }}
              h={{ base: '40px', md: '52px' }}
              boxShadow="sm"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              50%
            </Button>
            <Button
              onClick={() => quickSelectTokenRefundPercent(0.75)}
              flex="1"
              variant="outline"
              borderColor="red.200"
              color="red.500"
              size={{ base: 'md', md: 'lg' }}
              borderRadius="md"
              fontWeight="medium"
              _hover={{ bg: 'red.50', borderColor: 'red.300' }}
              h={{ base: '40px', md: '52px' }}
              boxShadow="sm"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              75%
            </Button>
            <Button
              onClick={() => quickSelectTokenRefundPercent(1)}
              flex="1"
              variant="outline"
              borderColor="red.200"
              color="red.500"
              size={{ base: 'md', md: 'lg' }}
              borderRadius="md"
              fontWeight="medium"
              _hover={{ bg: 'red.50', borderColor: 'red.300' }}
              h={{ base: '40px', md: '52px' }}
              boxShadow="sm"
              fontSize={{ base: 'sm', md: 'md' }}
            >
              100%
            </Button>
          </Flex>

          {/* 退还相关信息 - 根据输入代币计算 */}
          {isTokenRefundAmountValid() && (
            <Box
              bg="red.50"
              p={{ base: 3, md: 5 }}
              borderRadius="md"
              border="1px solid"
              borderColor="red.100"
              mt={{ base: 3, md: 5 }}
            >
              <HStack justify="space-between" mb={3}>
                <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
                  {t('feePercent')}:
                </Text>
                <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
                  {getCurrencyRefundFee()} {currencyUnit}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
                  {t('refundReceive')}:
                </Text>
                <Text
                  fontWeight="bold"
                  color="green.500"
                  fontSize={{ base: 'md', md: 'lg' }}
                >
                  {getActualCurrencyRefundAmount()} {currencyUnit}
                </Text>
              </HStack>
            </Box>
          )}

          {/* 退还按钮 */}
          <Button
            onClick={handleCancel}
            bg="white"
            color="red.500"
            border="1px solid"
            borderColor="red.300"
            _hover={{ bg: 'red.50' }}
            size={{ base: 'md', md: 'lg' }}
            w="100%"
            h={{ base: '50px', md: '64px' }}
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="bold"
            leftIcon={<Icon as={FaUndo} fontSize={{ base: 'md', md: 'lg' }} />}
            isLoading={cancelling}
            loadingText={t('processing')}
            isDisabled={!isTokenRefundAmountValid()}
            borderRadius="md"
            boxShadow="md"
            _active={{ transform: 'translateY(2px)', boxShadow: 'none' }}
            mt={{ base: 4, md: 6 }}
          >
            {t('cancelMint')}
          </Button>
        </VStack>
      )
    }

    // 修改钱包余额显示
    const renderWalletBalance = () => {
      return (
        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">
          {t('walletBalance')}:{' '}
          <Text as="span" fontWeight="bold" color="gray.700">
            {getDisplayBalance(walletBalance)} {currencyUnit}
          </Text>
        </Text>
      )
    }

    // 渲染主要内容
    const renderContent = () => (
      <Box
        borderRadius={isModal ? 'xl' : 'lg'}
        overflow="hidden"
        bg={cardBg}
        // boxShadow={isModal ? 'none' : 'md'}
        p={0}
        width="100%"
        maxW="100%"
      >
        {/* 标签页 */}
        <Tabs
          variant="soft-rounded"
          colorScheme="purple"
          index={activeTab}
          onChange={setActiveTab}
          pt={isModal ? 2 : 4}
          px={isModal ? { base: 2, md: 4 } : 4}
          pb={isModal ? 2 : 4}
          width="100%"
        >
          <TabList
            bg="gray.100"
            p={0}
            borderRadius="full"
            mb={isModal ? 4 : 6}
            boxShadow="sm"
            width="100%"
          >
            <Tab
              borderRadius="full"
              _selected={{
                bg: 'brand.primary',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: 'md',
              }}
              flex="1"
              py={isModal ? 2 : { base: 2.5, md: 3.5 }}
              fontSize={{ base: 'sm', md: 'md' }}
            >
              <Icon as={FaCoins} mr={{ base: 1.5, md: 2.5 }} />
              {t('mint')}
            </Tab>
            <Tab
              borderRadius="full"
              _selected={{
                bg: 'brand.primary',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: 'md',
              }}
              flex="1"
              py={isModal ? 2 : { base: 2.5, md: 3.5 }}
              fontSize={{ base: 'sm', md: 'md' }}
              position="relative"
            >
              <Icon as={FaUndo} mr={{ base: 1.5, md: 2.5 }} />
              {t('refund')}
            </Tab>
          </TabList>

          <TabPanels pb={isModal ? 2 : { base: 4, md: 6 }} width="100%">
            <TabPanel px={0} width="100%">
              {renderMintingTab()}
            </TabPanel>
            <TabPanel px={0} width="100%">
              {renderRefundTab()}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    )

    // 如果是弹窗模式，使用Modal组件包装内容
    if (isModal) {
      // 如果不是移动端，则跳过弹窗，返回空
      if (!isMobile) {
        return null
      }

      return (
        <Modal
          isOpen={!!isOpen}
          onClose={onClose || (() => {})}
          size={{ base: 'sm', md: 'md' }}
          isCentered
          motionPreset="slideInBottom"
        >
          <ModalOverlay backdropFilter="blur(2px)" />
          <ModalContent
            borderRadius="xl"
            mx={4}
            maxH={{ base: '90vh', md: 'auto' }}
            overflow="hidden"
          >
            <ModalHeader
              fontWeight="bold"
              fontSize={{ base: 'lg', md: 'xl' }}
              textAlign="center"
              pt={4}
              pb={2}
              bg="brand.primary"
              color="white"
            >
              {t('mintRefundTitle')}
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody pb={6} px={{ base: 2, md: 3 }} pt={4}>
              {renderContent()}
            </ModalBody>
          </ModalContent>
        </Modal>
      )
    }

    // 不是弹窗模式，直接返回内容
    return renderContent()
  }
)

MintingForm.displayName = 'MintingForm'
export default MintingForm
