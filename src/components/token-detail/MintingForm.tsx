'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Flex,
  Input,
  Icon,
  useColorModeValue,
  useToast,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Divider,
  Circle,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FaInfoCircle,
  FaWallet,
  FaCoins,
  FaUndo,
  FaChevronRight,
  FaTimes,
  FaPercent,
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface MintingFormProps {
  token: {
    symbol: string
    presaleRate?: string
    network?: string
    currencyUnit?: string
  }
  isOpen?: boolean
  onClose?: () => void
  isModal?: boolean
}

export default function MintingForm({
  token,
  isOpen,
  onClose,
  isModal = false,
}: MintingFormProps) {
  const [walletBalance, setWalletBalance] = useState<number>(314) // 钱包余额
  const [amount, setAmount] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [mintedAmount, setMintedAmount] = useState<number>(0) // 已铸额度
  const [estimatedTokens, setEstimatedTokens] = useState<string>('0') // 获得代币数量
  const [activeTab, setActiveTab] = useState<number>(0)
  const [refundAmount, setRefundAmount] = useState<string>('') // 新增：退还金额输入
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const { t } = useTranslation()

  const currencyUnit = token.currencyUnit || 'Pi'
  const cardBg = useColorModeValue('white', 'gray.800')
  const inputBg = useColorModeValue('white', 'gray.700')
  const toast = useToast()

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
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 0.01) {
      return false
    }
    // 检查余额是否足够
    return parseFloat(amount) <= walletBalance
  }

  // 检查退还金额是否有效
  const isRefundAmountValid = () => {
    if (
      !refundAmount ||
      isNaN(parseFloat(refundAmount)) ||
      parseFloat(refundAmount) <= 0
    ) {
      return false
    }
    // 检查退还金额是否小于等于已铸造金额
    return parseFloat(refundAmount) <= mintedAmount
  }

  // 处理铸造提交
  const handleSubmit = () => {
    if (!isAmountValid()) return

    setSubmitting(true)
    const mintAmount = parseFloat(amount)

    console.log(amount, '..._____amount_')

    // 模拟铸造过程
    setTimeout(() => {
      // 更新钱包余额和已铸造金额
      setWalletBalance(prev => parseFloat((prev - mintAmount).toFixed(2)))
      setMintedAmount(prev => parseFloat((prev + mintAmount).toFixed(2)))

      // 计算获得的代币并累加到现有的代币数量
      const rate = parseFloat(token.presaleRate?.replace(/[^0-9.]/g, '') || '0')
      const newTokens = mintAmount / rate
      const currentTokens = parseFloat(estimatedTokens.replace(/,/g, '')) || 0
      const totalTokens = currentTokens + newTokens

      setEstimatedTokens(totalTokens.toLocaleString())

      const amountFormatted = Math.floor(newTokens).toLocaleString()
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

      setAmount('')
      setSubmitting(false)
    }, 1500)
  }

  // 退还部分修改 - 根据代币数量计算Pi数量
  const calculatePiFromTokens = (tokenAmount: number) => {
    if (!token.presaleRate) return 0
    // 从presaleRate提取数值部分
    const rate = parseFloat(token.presaleRate.replace(/[^0-9.]/g, '') || '0')
    if (rate <= 0) return 0
    // presaleRate是每个代币的Pi价格（如0.000001 Pi），所以直接相乘
    return tokenAmount * rate
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
    // 检查退还代币数量是否小于等于已铸造的代币数量
    const maxTokens = parseFloat(estimatedTokens.replace(/,/g, ''))
    return parseFloat(refundAmount) <= maxTokens
  }

  // 快速选择退还代币百分比
  const quickSelectTokenRefundPercent = (percent: number) => {
    const maxTokens = parseFloat(estimatedTokens.replace(/,/g, ''))
    const calculatedAmount = (maxTokens * percent).toFixed(0)
    setRefundAmount(calculatedAmount)
  }

  // 计算基于代币数量的Pi金额（不含手续费）
  const calculateTotalPiAmount = () => {
    if (!isTokenRefundAmountValid()) return 0
    const tokenAmount = parseFloat(refundAmount)
    return calculatePiFromTokens(tokenAmount)
  }

  // 计算基于代币数量的实际Pi退还金额
  const getActualPiRefundAmount = () => {
    const totalPiAmount = calculateTotalPiAmount()
    if (totalPiAmount === 0) return '0.00'

    // 计算手续费
    let feeAmount = totalPiAmount * 0.02
    if (feeAmount < 0.01 && totalPiAmount > 0) {
      feeAmount = 0.01
    }

    // 实际退还金额应该是总金额减去手续费
    const actualRefund = totalPiAmount - feeAmount
    return Math.max(0, actualRefund).toFixed(2)
  }

  // 计算基于代币数量的Pi手续费
  const getPiRefundFee = () => {
    const totalPiAmount = calculateTotalPiAmount()
    if (totalPiAmount === 0) return '0.00'

    // 使用四舍五入并保留2位小数
    const feeAmount = totalPiAmount * 0.02 // 2%手续费

    // 如果手续费太小（小于0.01），仍然显示最小值0.01，避免显示为0
    if (feeAmount < 0.01 && feeAmount > 0) {
      return '0.01'
    }

    return feeAmount.toFixed(2)
  }

  // 修改取消铸造 - 基于代币数量
  const handleCancel = () => {
    if (!isTokenRefundAmountValid()) return

    setCancelling(true)
    const tokenRefundValue = parseFloat(refundAmount)
    const maxTokens = parseFloat(estimatedTokens.replace(/,/g, ''))

    // 根据代币计算Pi数量
    const piRefundValue = calculatePiFromTokens(tokenRefundValue)

    // 计算退还金额（98%）和手续费（2%）
    // 如果金额太小，确保至少收取0.01的手续费
    let feeAmount = piRefundValue * 0.02
    if (feeAmount < 0.01 && piRefundValue > 0) {
      feeAmount = 0.01
    }

    const actualRefundAmount = piRefundValue - feeAmount

    // 模拟取消过程
    setTimeout(() => {
      // 更新钱包余额
      setWalletBalance(prev =>
        parseFloat((prev + actualRefundAmount).toFixed(2))
      )

      // 计算剩余铸造金额和代币数量
      const percentRefunded = tokenRefundValue / maxTokens
      const piRefunded = mintedAmount * percentRefunded
      const remainingMinted = parseFloat((mintedAmount - piRefunded).toFixed(2))
      setMintedAmount(remainingMinted)

      // 更新代币数量
      const remainingTokens = maxTokens - tokenRefundValue
      setEstimatedTokens(Math.max(0, remainingTokens).toLocaleString())

      // 如果全部退还，切换回铸造页面
      if (remainingTokens <= 0 || Math.abs(remainingTokens - 0) < 0.01) {
        setEstimatedTokens('0')
        setActiveTab(0)
      }

      const refundAmountFormatted =
        Math.floor(tokenRefundValue).toLocaleString()
      const refundMessage = t('refundedTokens')
        .replace('{amount}', refundAmountFormatted)
        .replace('{symbol}', token.symbol)

      toast({
        title: t('cancelMint'),
        description: refundMessage,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })

      setCancelling(false)
      setRefundAmount('')
    }, 1500)
  }

  // 计算预估获取的代币数量（针对当前输入值）
  const getEstimatedTokens = () => {
    if (!isAmountValid()) return '0'
    const rate = parseFloat(token.presaleRate?.replace(/[^0-9.]/g, '') || '0')
    return (parseFloat(amount) / rate).toLocaleString()
  }

  // 计算手续费
  const getFee = () => {
    if (!isAmountValid()) return '0'
    return (parseFloat(amount) * 0.02).toFixed(4)
  }

  // 计算退还手续费
  const getRefundFee = () => {
    if (!isRefundAmountValid()) return '0'
    return (parseFloat(refundAmount) * 0.02).toFixed(2)
  }

  // 计算实际退还金额
  const getActualRefundAmount = () => {
    if (!isRefundAmountValid()) return '0'
    return (parseFloat(refundAmount) * 0.98).toFixed(2)
  }

  // 快速选择金额
  const quickSelect = (value: number) => {
    // 检查选择金额是否超过余额
    if (value > walletBalance) {
      toast({
        title: t('insufficientBalance'),
        description: t('walletBalanceInsufficient', {
          balance: walletBalance,
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
  }

  // 重置金额
  const resetAmount = () => {
    setAmount('')
  }

  // 重置退还金额
  const resetRefundAmount = () => {
    setRefundAmount('')
  }

  // 渲染铸造标签页内容
  const renderMintingTab = () => {
    return (
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
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
              px={{ base: 4, md: 6 }}
              py={{ base: 4, md: 5 }}
              borderRadius="lg"
            >
              {/* 数字输入 */}
              <Box flexGrow={1} pr={{ base: 8, md: 12 }}>
                <Input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  variant="unstyled"
                  fontSize={{ base: '2xl', md: '4xl' }}
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

              {/* Pi 单位 */}
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
                  fontSize={{ base: 'md', md: 'lg' }}
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
              <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">
                {t('walletBalance')}:{' '}
                <Text as="span" fontWeight="bold" color="gray.700">
                  {walletBalance} {currencyUnit}
                </Text>
              </Text>
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
            borderColor="purple.200"
            color="brand.primary"
            size={{ base: 'md', md: 'lg' }}
            borderRadius="md"
            fontWeight="medium"
            _hover={{ bg: 'purple.50', borderColor: 'purple.300' }}
            h={{ base: '40px', md: '52px' }}
            boxShadow="sm"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            0.1 {currencyUnit}
          </Button>
          <Button
            onClick={() => quickSelect(0.2)}
            flex="1"
            variant="outline"
            borderColor="purple.200"
            color="brand.primary"
            size={{ base: 'md', md: 'lg' }}
            borderRadius="md"
            fontWeight="medium"
            _hover={{ bg: 'purple.50', borderColor: 'purple.300' }}
            h={{ base: '40px', md: '52px' }}
            boxShadow="sm"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            0.2 {currencyUnit}
          </Button>
          <Button
            onClick={() => quickSelect(0.5)}
            flex="1"
            variant="outline"
            borderColor="purple.200"
            color="brand.primary"
            size={{ base: 'md', md: 'lg' }}
            borderRadius="md"
            fontWeight="medium"
            _hover={{ bg: 'purple.50', borderColor: 'purple.300' }}
            h={{ base: '40px', md: '52px' }}
            boxShadow="sm"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            0.5 {currencyUnit}
          </Button>
          <Button
            onClick={() => quickSelect(1)}
            flex="1"
            variant="outline"
            borderColor="purple.200"
            color="brand.primary"
            size={{ base: 'md', md: 'lg' }}
            borderRadius="md"
            fontWeight="medium"
            _hover={{ bg: 'purple.50', borderColor: 'purple.300' }}
            h={{ base: '40px', md: '52px' }}
            boxShadow="sm"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            1 {currencyUnit}
          </Button>
        </Flex>

        {/* 预估代币获取和历史铸造信息 */}
        <Box my={{ base: 2, md: 4 }}>
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
                {getEstimatedTokens()}
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
          h={{ base: '50px', md: '64px' }}
          fontSize={{ base: 'lg', md: 'xl' }}
          fontWeight="bold"
          isDisabled={!isAmountValid()}
          isLoading={submitting}
          loadingText={t('processing')}
          boxShadow="md"
          borderRadius="md"
          transition="all 0.3s"
          _active={{ transform: 'translateY(2px)', boxShadow: 'none' }}
          mt={{ base: 4, md: 6 }}
        >
          {t('mintToken')}
        </Button>
      </VStack>
    )
  }

  // 渲染退还标签页内容
  const renderRefundTab = () => {
    if (mintedAmount <= 0) {
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

    // 计算当前代币总数
    const totalTokens = parseFloat(estimatedTokens.replace(/,/g, ''))

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
                  {estimatedTokens} {token.symbol}
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
                {getPiRefundFee()} {currencyUnit}
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
                {getActualPiRefundAmount()} {currencyUnit}
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

  // 渲染主要内容
  const renderContent = () => (
    <Box
      borderRadius={isModal ? 'xl' : 'lg'}
      overflow="hidden"
      bg={cardBg}
      boxShadow={isModal ? 'none' : 'md'}
      width="100%"
      maxW="100%"
    >
      {/* 标签页 */}
      <Tabs
        variant="soft-rounded"
        colorScheme="purple"
        index={activeTab}
        onChange={setActiveTab}
        pt={isModal ? 2 : { base: 4, md: 6 }}
        px={isModal ? { base: 2, md: 4 } : { base: 4, md: 8 }}
        pb={isModal ? 2 : { base: 4, md: 6 }}
        width="100%"
      >
        <TabList
          bg="gray.100"
          p={1}
          borderRadius="full"
          mb={isModal ? 4 : { base: 6, md: 8 }}
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
