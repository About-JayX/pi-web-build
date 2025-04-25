'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Button,
  Icon,
  Flex,
  useColorModeValue,
  Card,
  CardBody,
  CardFooter,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  Divider,
  Tabs,
  TabList,
  Tab,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useBreakpointValue,
  useToast,
  Image,
  Grid
} from '@chakra-ui/react'
import { FaUpload, FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNetwork } from '@/contexts/NetworkContext'
import { useTranslation } from 'react-i18next'
import { useSolana } from '@/contexts/solanaProvider'
import { TokenAPI } from '@/api/token'
import type { CreateTokenParams } from '@/api/types'
import WalletConnectModal from '@/components/WalletConnectModal'
import ErrorModal from '@/components/ErrorModal'
import DeploySuccessModal from '@/components/DeploySuccessModal'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/navigation'
// 定义代币参数组件的属性接口
interface TokenParametersSectionProps {
  totalSupplyTabIndex: number
  setTotalSupplyTabIndex: (index: number) => void
  targetAmountTabIndex: number
  setTargetAmountTabIndex: (index: number) => void
  totalSupplyOptions: string[]
  targetAmountOptionsMap: Record<string, string[]>
  labelColor: string
  isTestEnv: boolean
  onValuesChange?: (values: {
    totalSupply: string
    targetAmount: string
  }) => void
}

// 代币参数响应式组件
const TokenParametersSection = ({
  totalSupplyTabIndex,
  setTotalSupplyTabIndex,
  targetAmountTabIndex,
  setTargetAmountTabIndex,
  totalSupplyOptions,
  targetAmountOptionsMap,
  labelColor,
  isTestEnv,
  onValuesChange,
}: TokenParametersSectionProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure()

  const { isOpen: isTokenParamsOpen, onToggle: onTokenParamsToggle } =
    useDisclosure()

  const { t } = useTranslation()

  // 当选项改变时通知父组件
  const currentTotalSupply =
    totalSupplyOptions[totalSupplyTabIndex] || totalSupplyOptions[0]
  const currentTargetAmountWithUnit =
    targetAmountOptionsMap[currentTotalSupply]?.[targetAmountTabIndex] ||
    targetAmountOptionsMap[currentTotalSupply]?.[0]

  // 安全地提取数字部分
  const currentTargetAmount = currentTargetAmountWithUnit
    ? currentTargetAmountWithUnit.split(' ')[0]
    : '0'

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange({
        totalSupply: currentTotalSupply,
        targetAmount: currentTargetAmount,
      })
    }
  }, [currentTotalSupply, currentTargetAmount, onValuesChange])

  const handleParamsClick = () => {
    if (isMobile) {
      onTokenParamsToggle()
    } else {
      onModalOpen()
    }
  }

  // 计算代币价格
  const getTokenPrice = (totalSupply: string, targetAmount: string) => {
    if (!totalSupply || !targetAmount) return '0'

    const supply = parseFloat(totalSupply)
    const amountParts = targetAmount.split(' ')
    const amount = parseFloat(amountParts[0])

    if (isNaN(supply) || isNaN(amount) || amount === 0) {
      return '0'
    }

    return (supply / 2 / amount).toLocaleString('en-US', {
      maximumFractionDigits: 8,
    })
  }

  // 添加函数计算单个代币的价格
  const getSingleTokenPrice = (totalSupply: string, targetAmount: string) => {
    if (!totalSupply || !targetAmount) return '0'

    const supply = parseFloat(totalSupply)
    const amountParts = targetAmount.split(' ')
    const amount = parseFloat(amountParts[0])
    const unit = amountParts[1] || ''

    if (isNaN(supply) || isNaN(amount) || amount === 0) {
      return '0'
    }

    // 单个代币价格 = 铸造金额 / (总量/2)
    const singlePrice = amount / (supply / 2)
    return `${singlePrice.toLocaleString('en-US', {
      maximumFractionDigits: 8,
    })} ${unit}`
  }

  return (
    <Box>
      {/* PC版用弹窗，移动版用折叠面板 */}
      <Flex
        align="center"
        justify="space-between"
        onClick={handleParamsClick}
        cursor="pointer"
        p={2}
        pl={0}
        _hover={{ bg: 'transparent' }}
        borderRadius="md"
      >
        <Heading size="sm" color={labelColor} fontWeight="semibold">
          {t('tokenParameters')}
        </Heading>
        <Box display="flex">
          {/* PC版显示编辑按钮 */}
          {!isMobile ? (
            <IconButton
              aria-label={t('settings')}
              icon={<FaEdit />}
              size="sm"
              variant="ghost"
              colorScheme="purple"
              onClick={e => {
                e.stopPropagation()
                onModalOpen()
              }}
            />
          ) : (
            <Icon
              as={isTokenParamsOpen ? FaChevronUp : FaChevronDown}
              color="gray.500"
            />
          )}
        </Box>
      </Flex>

      {/* 当前参数显示 */}
      <SimpleGrid
        columns={2}
        spacing={4}
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        borderRadius="md"
        mt={2}
        boxShadow="sm"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {t('totalSupply')}
          </Text>
          <Text fontWeight="bold" color={labelColor}>
            {totalSupplyOptions[totalSupplyTabIndex]}
            {isTestEnv && totalSupplyOptions[totalSupplyTabIndex] === '1000000' && (
              <Text as="span" ml={2} fontSize="xs" color="orange.500" bg="orange.100" px={1} py={0.5} borderRadius="sm">
                测试
              </Text>
            )}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {t('mintingAmount')}
          </Text>
          <Text fontWeight="bold" color={labelColor}>
            {
              targetAmountOptionsMap[totalSupplyOptions[totalSupplyTabIndex]][
                targetAmountTabIndex
              ]
            }
            {isTestEnv && totalSupplyOptions[totalSupplyTabIndex] === '1000000' && (
              <Text as="span" ml={2} fontSize="xs" color="orange.500" bg="orange.100" px={1} py={0.5} borderRadius="sm">
                测试
              </Text>
            )}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {t('exchangeRate')}
          </Text>
          <Text fontWeight="bold" color={labelColor}>
            1 :{' '}
            {getTokenPrice(
              totalSupplyOptions[totalSupplyTabIndex],
              targetAmountOptionsMap[totalSupplyOptions[totalSupplyTabIndex]][
                targetAmountTabIndex
              ]
            )}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {t('tokenPrice')}
          </Text>
          <Text fontWeight="bold" color={labelColor}>
            {getSingleTokenPrice(
              totalSupplyOptions[totalSupplyTabIndex],
              targetAmountOptionsMap[totalSupplyOptions[totalSupplyTabIndex]][
                targetAmountTabIndex
              ]
            )}
          </Text>
        </Box>
      </SimpleGrid>

      {/* 移动端折叠区域参数设置 */}
      {isMobile && (
        <Box
          display={isTokenParamsOpen ? 'block' : 'none'}
          mt={4}
          pl={0}
          bg={useColorModeValue('white', 'gray.800')}
          p={5}
          borderRadius="md"
          boxShadow="sm"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <VStack spacing={5} align="stretch">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold">
                {t('totalSupply')}
              </FormLabel>
              <Tabs
                variant="soft-rounded"
                colorScheme="purple"
                index={totalSupplyTabIndex}
                onChange={setTotalSupplyTabIndex}
                isFitted
              >
                <TabList bg="gray.50" p={2} borderRadius="lg">
                  {totalSupplyOptions.map((option, index) => (
                    <Tab
                      key={index}
                      rounded="md"
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      fontWeight="semibold"
                    >
                      {option}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </FormControl>

            <Divider />

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold">
                {t('mintingAmount')}
              </FormLabel>

              <Tabs
                variant="soft-rounded"
                colorScheme="purple"
                index={targetAmountTabIndex}
                onChange={setTargetAmountTabIndex}
                size="sm"
              >
                <TabList
                  bg="gray.50"
                  p={2}
                  borderRadius="lg"
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  gap={2}
                  width="100%"
                >
                  {targetAmountOptionsMap[
                    totalSupplyOptions[totalSupplyTabIndex]
                  ].map((option, index) => (
                    <Tab
                      key={index}
                      rounded="md"
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      fontSize="xs"
                      py={2}
                      px={0}
                    >
                      {option}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </FormControl>
            <Button
              mt={3}
              bg="brand.primary"
              color="white"
              size="md"
              width="100%"
              _hover={{ bg: 'brand.primary' }}
              _active={{ bg: 'brand.primary' }}
              onClick={onTokenParamsToggle}
            >
              {t('confirm')}
            </Button>
          </VStack>
        </Box>
      )}

      {/* PC端Modal */}
      {!isMobile && (
        <Modal
          isOpen={isModalOpen}
          onClose={onModalClose}
          size={{ base: 'full', md: 'lg' }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent borderRadius={{ base: 0, md: 'md' }}>
            <ModalHeader>{t('settings')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
              <VStack spacing={5} align="stretch">
                <FormControl>
                  <FormLabel
                    // color={labelColor}
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    {t('totalSupply')}
                  </FormLabel>
                  <Tabs
                    variant="soft-rounded"
                    colorScheme="purple"
                    index={totalSupplyTabIndex}
                    onChange={setTotalSupplyTabIndex}
                    isFitted
                  >
                    <TabList bg="gray.50" p={1} borderRadius="lg">
                      {totalSupplyOptions.map((option, index) => (
                        <Tab
                          key={index}
                          rounded="md"
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          fontWeight="semibold"
                        >
                          {option}
                        </Tab>
                      ))}
                    </TabList>
                  </Tabs>
                </FormControl>

                <Divider />

                <FormControl>
                  <FormLabel
                    // color={labelColor}
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    {t('mintingAmount')}
                  </FormLabel>

                  <Tabs
                    variant="soft-rounded"
                    colorScheme="purple"
                    index={targetAmountTabIndex}
                    onChange={setTargetAmountTabIndex}
                    size="sm"
                  >
                    <TabList
                      bg="gray.50"
                      p={2}
                      borderRadius="lg"
                      flexWrap="wrap"
                    >
                      {targetAmountOptionsMap[
                        totalSupplyOptions[totalSupplyTabIndex]
                      ].map((option, index) => (
                        <Tab
                          key={index}
                          rounded="md"
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          mx={1}
                          mb={1}
                        >
                          {option}
                        </Tab>
                      ))}
                    </TabList>
                  </Tabs>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                // colorScheme="purple"
                onClick={onModalClose}
                bg="brand.primary"
                color="white"
                size={{ base: 'lg', md: 'md' }}
                width={{ base: 'full', md: 'auto' }}
                _hover={{ bg: 'brand.primary' }}
                _active={{ bg: 'brand.primary' }}
              >
                {t('confirm')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  )
}

// 社媒链接组件属性接口
interface SocialLinksSectionProps {
  isSocialOpen: boolean
  onSocialToggle: () => void
  labelColor: string
  inputBg: string
  borderColor: string
  onWebsiteChange?: (value: string) => void
  onTwitterChange?: (value: string) => void
  onTelegramChange?: (value: string) => void
  onDescriptionChange?: (value: string) => void
  website?: string
  twitter?: string
  telegram?: string
  description?: string
}

// 社媒链接响应式组件
const SocialLinksSection = ({
  isSocialOpen,
  onSocialToggle,
  labelColor,
  inputBg,
  borderColor,
  onWebsiteChange,
  onTwitterChange,
  onTelegramChange,
  onDescriptionChange,
  website = '',
  twitter = '',
  telegram = '',
  description = '',
}: SocialLinksSectionProps) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Flex
        align="center"
        justify="space-between"
        onClick={onSocialToggle}
        cursor="pointer"
        p={2}
        pl={0}
        _hover={{ bg: 'transparent' }}
        borderRadius="md"
      >
        <Heading size="sm" color={labelColor} fontWeight="semibold">
          {t('socialLinks')}
        </Heading>
        <Icon
          as={isSocialOpen ? FaChevronUp : FaChevronDown}
          color="gray.500"
        />
      </Flex>

      <Box
        display={isSocialOpen ? 'block' : 'none'}
        mt={4}
        pl={{ base: 0, md: 2 }}
      >
        <FormControl mb={4}>
          <FormLabel color="gray.600" fontSize="sm">
            {t('description')}
          </FormLabel>
          <Input
            value={description}
            onChange={e => onDescriptionChange?.(e.target.value)}
            placeholder=""
            bg={inputBg}
            borderColor={borderColor}
            _placeholder={{ color: 'gray.400' }}
            size="md"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel color="gray.600" fontSize="sm">
            {t('website')}
          </FormLabel>
          <Input
            value={website}
            onChange={e => onWebsiteChange?.(e.target.value)}
            placeholder=""
            bg={inputBg}
            borderColor={borderColor}
            _placeholder={{ color: 'gray.400' }}
            size="md"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel color="gray.600" fontSize="sm">
            {t('twitter')}
          </FormLabel>
          <Input
            value={twitter}
            onChange={e => onTwitterChange?.(e.target.value)}
            placeholder=""
            bg={inputBg}
            borderColor={borderColor}
            _placeholder={{ color: 'gray.400' }}
            size="md"
          />
        </FormControl>

        <FormControl>
          <FormLabel color="gray.600" fontSize="sm">
            {t('telegram')}
          </FormLabel>
          <Input
            value={telegram}
            onChange={e => onTelegramChange?.(e.target.value)}
            placeholder=""
            bg={inputBg}
            borderColor={borderColor}
            _placeholder={{ color: 'gray.400' }}
            size="md"
          />
        </FormControl>
      </Box>
    </Box>
  )
}

export default function DeployPage() {
  const router = useRouter()
  const { publicKey, setPublicKey, isConnecting } = useSolana()
  const { network } = useNetwork()
  const { t } = useTranslation()
  const toast = useToast()

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800')
  const inputBg = useColorModeValue('gray.50', 'whiteAlpha.100')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const labelColor = useColorModeValue('brand.primary', 'brand.light')

  // 组件状态
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenIcon, setTokenIcon] = useState<File | null>(null)
  const [totalSupplyTabIndex, setTotalSupplyTabIndex] = useState(0)
  const [targetAmountTabIndex, setTargetAmountTabIndex] = useState(0)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [isCheckingSymbol, setIsCheckingSymbol] = useState(false)
  const [isSymbolValid, setIsSymbolValid] = useState<boolean | null>(null)
  const [errorType, setErrorType] = useState<'exists' | 'invalid' | null>(null)

  // 折叠面板状态
  const { isOpen: isSocialOpen, onToggle: onSocialToggle } = useDisclosure()

  // 添加钱包连接弹窗状态
  const {
    isOpen: isWalletModalOpen,
    onOpen: onWalletModalOpen,
    onClose: onWalletModalClose,
  } = useDisclosure()

  // 定义当前网络的计价单位
  const currencyUnit = useMemo(() => {
    return network === 'SOL' ? 'SOL' : 'PI'
  }, [network])

  // 判断是否为测试环境
  const isTestEnv = process.env.NODE_ENV === 'development'

  // 在开发环境下输出测试模式提示
  useEffect(() => {
    if (isTestEnv) {
      console.info('🧪 测试模式已启用 - 额外测试选项可用: 10000000代币 / 0.1 SOL');
    }
  }, [isTestEnv]);

  // 定义代币发行总量选项
  const totalSupplyOptions = useMemo(() => {
    // 测试环境下额外添加一个小型供应量选项
    if (isTestEnv) {
      return ['1000000', '314000000', '1000000000']
    }
    return ['314000000', '1000000000']
  }, [isTestEnv])

  // 定义目标铸造金额选项映射（带单位的值）
  const targetAmountOptionsMap = useMemo(
    () => {
      const baseOptions = {
        '314000000': [
          `314 ${currencyUnit}`,
          `157 ${currencyUnit}`,
          `78.5 ${currencyUnit}`,
        ],
        '1000000000': [
          `100 ${currencyUnit}`,
          `200 ${currencyUnit}`,
          `250 ${currencyUnit}`,
          // `400 ${currencyUnit}`,
          `500 ${currencyUnit}`,
        ],
      }
      
      // 测试环境下添加小金额测试选项
      if (isTestEnv) {
        return {
          '1000000': [`0.1 ${currencyUnit}`],
          ...baseOptions
        }
      }
      
      return baseOptions
    },
    [currencyUnit, isTestEnv]
  )

  // 当前选中的值
  const [selectedValues, setSelectedValues] = useState<{
    totalSupply: string
    targetAmount: string
  }>({
    totalSupply: totalSupplyOptions[0],
    targetAmount: isTestEnv ? '0.1' : '314', // 根据环境选择默认值
  })

  // 设置默认选项
  useEffect(() => {
    // 如果环境变化导致选项变化，需要更新初始选择
    setSelectedValues({
      totalSupply: totalSupplyOptions[0],
      targetAmount: isTestEnv ? '0.1' : '314',
    });
  }, [isTestEnv, totalSupplyOptions]);

  const handleValuesChange = useCallback(
    (values: { totalSupply: string; targetAmount: string }) => {
      setSelectedValues(values)
    },
    []
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // 检查文件大小，限制为 2MB
      const maxSizeInBytes = 2 * 1024 * 1024 // 2MB

      if (file.size > maxSizeInBytes) {
        toast({
          title: t('error'),
          description: t('imageTooLarge'),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
        return
      }

      setTokenIcon(file)
    }
  }

  // 使用 useRef 来存储定时器
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 检查代币符号
  const checkTokenSymbol = useCallback(
    async (symbol: string) => {
      if (!symbol) {
        return
      }

      console.log("checkTokenSymbol被调用:", symbol); // 调试日志

      // 再次检查非法代币符号列表 - 应该在handleSymbolChange中完成，这里是双重保险
      const invalidSymbols = ["XPI", "PIS", "PiSale", "SpacePi", "Xijinpin"];
      if (invalidSymbols.some(invalid => symbol.toUpperCase() === invalid.toUpperCase())) {
        // 非法符号直接设置错误状态并返回，不需要进行网络请求
        setIsSymbolValid(false)
        setErrorType('invalid')
        setIsCheckingSymbol(false) // 确保检查状态被关闭
        return
      }

      try {
        // 开始检查符号可用性
        setIsCheckingSymbol(true)
        console.log("开始API请求检查符号:", symbol); // 调试日志
        
        const response = await TokenAPI.checkSymbol(symbol)
        console.log("API响应:", response); // 调试日志
        
        // 如果 exists 为 true 表示已注册，则不可用
        if (response.exists) {
          setIsSymbolValid(false)
          setErrorType('exists')
          toast({
            title: t('error'),
            description: t('symbolAlreadyExists'),
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          })
        } else {
          // 符号可用，设置为有效状态
          setIsSymbolValid(true)
          setErrorType(null)
        }
      } catch (error) {
        console.error('Failed to check token symbol:', error)
        // 发生错误时保持之前的验证状态不变
      } finally {
        // 完成检查，无论结果如何
        setIsCheckingSymbol(false)
      }
    },
    [toast, t]
  )

  // 处理代币符号输入
  const handleSymbolChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // 清除之前的定时器，避免任何情况下的竞态条件
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null;
      }

      // 1. 移除空格
      // 2. 过滤掉中文字符，只保留英文字母、数字和特殊符号
      // 使用正则表达式匹配非中文字符
      const value = e.target.value
        .replace(/\s/g, '')
        .replace(/[\u4e00-\u9fa5]/g, '')

      // 限制最大长度为10个字符
      const truncatedValue = value.slice(0, 10)
      
      // 更新符号值
      setTokenSymbol(truncatedValue)
      
      // 如果输入为空，不进行验证
      if (!truncatedValue) {
        setIsSymbolValid(null)
        setErrorType(null)
        return
      }
        
      // 步骤1: 快速检查非法代币符号
      const invalidSymbols = ["XPI", "PIS", "PiSale", "SpacePi", "Xijinpin"];
      if (invalidSymbols.some(invalid => truncatedValue.toUpperCase() === invalid.toUpperCase())) {
        // 设置错误状态
        setIsSymbolValid(false)
        setErrorType('invalid')
        // 确保isCheckingSymbol为false，防止显示"正在检查符号可用性"
        setIsCheckingSymbol(false)
        // 非法符号直接返回，不进行后续符号可用性检查
        return
      }

      // 步骤2: 如果不是非法符号，继续处理
      
      // 如果之前是任何错误，都重置状态，准备进行新的检查
      setIsSymbolValid(null)
      setErrorType(null)

      // 步骤3: 为非非法符号设置定时器，延迟检查可用性
      console.log("准备检查符号可用性:", truncatedValue); // 调试日志
      // 设置新的定时器，1500ms 后检查
      timerRef.current = setTimeout(() => {
        console.log("正在执行符号可用性检查:", truncatedValue); // 调试日志
        // 调用API检查符号是否已被注册
        checkTokenSymbol(truncatedValue)
      }, 1500)
    },
    [checkTokenSymbol, setIsCheckingSymbol]
  )

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // 处理连接按钮点击事件
  const handleConnectButtonClick = () => {
    // 打开钱包选择弹窗
    onWalletModalOpen()
  }

  // 处理钱包连接成功
  const handleWalletConnected = (newPublicKey: string) => {
    // 设置公钥
    setPublicKey(newPublicKey)
  }

  const [error, setError] = useState<{ message: string; details: any } | null>(
    null
  )
  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onErrorModalClose,
  } = useDisclosure()

  // 添加部署成功弹窗状态
  const [deployedTokenMint, setDeployedTokenMint] = useState<string>('');
  const {
    isOpen: isSuccessModalOpen,
    onOpen: onSuccessModalOpen,
    onClose: onSuccessModalClose,
  } = useDisclosure();

  // 清空表单内容
  const resetForm = () => {
    setTokenName('');
    setTokenSymbol('');
    setTokenIcon(null);
    setWebsite('');
    setTwitter('');
    setTelegram('');
    setDescription('');
    // 重置到默认选项
    setTotalSupplyTabIndex(0);
    setTargetAmountTabIndex(0);
  };

  const handleCreateToken = async () => {
    // 如果未连接钱包，则打开钱包连接弹窗
    if (!publicKey) {
      handleConnectButtonClick()
      return
    }

    // 检查表单填写完整性
    if (!tokenIcon || !tokenName || !tokenSymbol) {
      toast({
        title: t('error'),
        description: t('pleaseCompleteForm'),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
      return
    }

    // 最终检查非法代币符号
    const invalidSymbols = ["XPI", "PIS", "PiSale", "SpacePi", "Xijinpin"];
    if (invalidSymbols.some(invalid => tokenSymbol.toUpperCase() === invalid.toUpperCase())) {
      // 更新状态，确保错误信息在页面上显示
      if (!(isSymbolValid === false && errorType === 'invalid')) {
        setIsSymbolValid(false)
        setErrorType('invalid')
      }
      
      toast({
        title: t('error'),
        description: t('invalidSymbol'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
      
      // 滚动到符号输入框
      const symbolInput = document.querySelector('[name="tokenSymbol"]');
      if (symbolInput) {
        symbolInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return
    }

    // 检查代币符号是否可用
    if (!isSymbolValid) {
      // 根据错误类型显示不同的错误消息
      toast({
        title: t('error'),
        description: errorType === 'invalid' ? t('invalidSymbol') : t('symbolAlreadyExists'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
      
      // 滚动到符号输入框
      const symbolInput = document.querySelector('[name="tokenSymbol"]');
      if (symbolInput) {
        symbolInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return
    }

    try {
      setIsSubmitting(true)

      const params: CreateTokenParams = {
        file: tokenIcon,
        Metadata: {
          name: tokenName,
          symbol: tokenSymbol,
          description,
          init_liquidity: new BigNumber(selectedValues.targetAmount)
            .times(1e9)
            .toNumber(),
          total_supply: new BigNumber(selectedValues.totalSupply)
            .times(1e6)
            .toNumber(),
          socials: [
            ...(telegram ? [{ platform: 'telegram', url: telegram }] : []),
            ...(twitter ? [{ platform: 'twitter', url: twitter }] : []),
            ...(website ? [{ platform: 'website', url: website }] : []),
          ],
        },
      }

      console.log(params, 'params_')

      const { mint } = (await TokenAPI.createToken(params)) as any

      // 保存部署成功的代币地址
      setDeployedTokenMint(mint);
      
      // 清空表单
      resetForm();
      
      // 打开成功弹窗
      onSuccessModalOpen();

      toast({
        title: t('success'),
        description: t('tokenCreated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
      
      // 注释掉自动跳转，因为现在用户可以通过弹窗中的按钮跳转
      // setTimeout(() => {
      //   router.push(`/sol/${mint}`)
      // }, 1000)
    } catch (error: any) {
      console.error('Token creation failed:', error)

      // 存储错误信息并打开错误弹窗
      let errorMessage = t('createTokenFailed')

      // 处理特定类型的错误
      if (error.response && error.response.status === 413) {
        errorMessage = t('imageTooLarge')
      } else if (error.response && error.response.status === 500) {
        errorMessage = t('serverError')
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      // 设置错误详情
      setError({
        message: errorMessage,
        details: error,
      })

      // 显示标准的toast提示
      toast({
        title: t('error'),
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })

      // 在开发环境中打开详细错误弹窗
      if (process.env.NODE_ENV === 'development') {
        onErrorModalOpen()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // 社交媒体链接状态
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [telegram, setTelegram] = useState('')
  const [description, setDescription] = useState('')

  // 监听部署代币所需的所有参数
  useEffect(() => {
    const params = {
      // 基本信息
      name: tokenName,
      symbol: tokenSymbol,
      description,
      file: tokenIcon
        ? {
            name: tokenIcon.name,
            size: tokenIcon.size,
            type: tokenIcon.type,
          }
        : null,

      // 代币参数
      total_supply: selectedValues.totalSupply,
      init_liquidity: selectedValues.targetAmount,

      // 社交媒体链接
      website: website || null,
      twitter: twitter || null,
      telegram: telegram || null,

      // 其他信息
      network,
      currencyUnit,
      publicKey: publicKey?.toString() || null,
    }

    console.log('Token creation parameters:', params)

    // 验证必填参数
    const requiredFields = {
      name: 'Token Name',
      symbol: 'Token Symbol',
      file: 'Token Icon',
      total_supply: 'Total Supply',
      init_liquidity: 'Minting Amount',
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([fieldName]) => !params[fieldName])
      .map(([, label]) => label)

    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields.join(', '))
    }
  }, [
    tokenName,
    tokenSymbol,
    tokenIcon,
    selectedValues,
    website,
    twitter,
    telegram,
    network,
    currencyUnit,
    publicKey,
  ])

  return (
    <Box color={textColor}>
      <Box bg={useColorModeValue('brand.50', 'gray.800')} py={8} mb={6}>
        <Container maxW={'container.xl'} textAlign="center">
          <Heading as="h1" size="xl" mb={4} color="brand.primary">
            {t('deployTitle')}
          </Heading>
        </Container>
      </Box>

      <Container
        maxW="container.md"
        px={{ base: 3, md: 6 }}
        pb={{ base: 12, md: 10 }}
      >
        <Card
          bg={cardBg}
          boxShadow="md"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
          mx="auto"
          width="100%"
        >
          <CardBody p={{ base: 2, sm: 6 }}>
            <Box width="100%">
              <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                <SimpleGrid
                  columns={{ base: 1, md: 2 }}
                  spacing={4}
                ></SimpleGrid>
                <Flex
                  gap={{ base: 4, md: 6 }}
                  flexDirection={{ base: 'column-reverse', md: 'row' }}
                >
                  <FormControl flex={0} isRequired>
                    <FormLabel color={labelColor} fontWeight="semibold">
                      {t('tokenIcon')}
                    </FormLabel>
                    <Box
                      as="label"
                      htmlFor="token-icon-upload"
                      borderWidth="1px"
                      borderStyle="dashed"
                      borderColor={borderColor}
                      borderRadius="md"
                      p={4}
                      textAlign="center"
                      bg={inputBg}
                      width={{ base: '200px', sm: '200px' }}
                      height={{ base: '200px', sm: '200px' }}
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ bg: 'gray.100', borderColor: 'brand.primary' }}
                      mx="0"
                      position="relative"
                    >
                      <Input
                        id="token-icon-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                      />
                      {tokenIcon ? (
                        <Image
                          src={URL.createObjectURL(tokenIcon)}
                          alt="Token Icon"
                          boxSize="150px"
                          objectFit="contain"
                        />
                      ) : (
                        <>
                          <Icon
                            as={FaUpload}
                            fontSize="2xl"
                            mb={3}
                            color="brand.primary"
                          />
                          <Text fontSize="sm" color="gray.500">
                            {t('uploadIcon')}
                            <br />
                            <span
                              dangerouslySetInnerHTML={{
                                __html: t('iconRequirements'),
                              }}
                            />
                            <br />
                            <span style={{ color: 'red.400' }}>
                              {t('fileSizeLimit')}
                            </span>
                          </Text>
                        </>
                      )}
                    </Box>
                  </FormControl>
                  <Grid flex={1} h="fit-content" gap={{ base: 4, md: 6 }}>
                    <FormControl isRequired>
                      <FormLabel color={labelColor} fontWeight="semibold">
                        {t('tokenSymbol')}
                      </FormLabel>
                      <Input
                        value={tokenSymbol}
                        onChange={handleSymbolChange}
                        placeholder={t('enterSymbol')}
                        bg={inputBg}
                        name="tokenSymbol"
                        borderColor={
                          isSymbolValid === false
                            ? 'red.500'
                            : isSymbolValid === true
                            ? 'green.500'
                            : borderColor
                        }
                        _placeholder={{ color: 'gray.400' }}
                        _focus={{
                          borderColor: isSymbolValid === false ? 'red.500' : 'brand.primary',
                          boxShadow: isSymbolValid === false 
                            ? '0 0 0 1px #E53E3E'
                            : '0 0 0 1px var(--chakra-colors-brand-primary)'
                        }}
                        size="md"
                        isInvalid={isSymbolValid === false}
                        disabled={isCheckingSymbol}
                        maxLength={10} // 添加最大长度限制为10
                        type="text"
                        inputMode="text"
                      />
                      {tokenSymbol && tokenSymbol.length >= 10 && (
                        <Text fontSize="sm" color="orange.500" mt={1}>
                          {t('symbolMaxLength')}
                        </Text>
                      )}
                      {/* 只有当不是错误状态时，才显示"正在检查符号可用性" */}
                      {isCheckingSymbol && isSymbolValid !== false && (
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          {t('checkingSymbol')}...
                        </Text>
                      )}
                      {/* 无论是否在检查中，只要是错误状态就显示错误提示 */}
                      {isSymbolValid === false && (
                        <Box 
                          mt={1} 
                          p={2} 
                          bg="red.50" 
                          borderRadius="md" 
                          borderWidth="1px" 
                          borderColor="red.200"
                        >
                          <Text fontSize="sm" color="red.500" fontWeight="medium">
                            {errorType === 'invalid' ? t('invalidSymbol') : t('symbolAlreadyExists')}
                          </Text>
                        </Box>
                      )}
                      {/* 添加成功验证提示 */}
                      {isSymbolValid === true && !isCheckingSymbol && tokenSymbol && (
                        <Box 
                          mt={1} 
                          p={2} 
                          bg="green.50" 
                          borderRadius="md" 
                          borderWidth="1px" 
                          borderColor="green.200"
                        >
                          <Text fontSize="sm" color="green.500" fontWeight="medium">
                            {t('symbolValidSuccess')}
                          </Text>
                        </Box>
                      )}
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color={labelColor} fontWeight="semibold">
                        {t('tokenName')}
                      </FormLabel>
                      <Input
                        value={tokenName}
                        onChange={e => setTokenName(e.target.value)}
                        placeholder=""
                        bg={inputBg}
                        borderColor={borderColor}
                        _placeholder={{ color: 'gray.400' }}
                        size="md"
                      />
                    </FormControl>
                  </Grid>
                </Flex>

                {/* 代币参数部分 - 使用专门的客户端组件 */}
                <TokenParametersSection
                  totalSupplyTabIndex={totalSupplyTabIndex}
                  setTotalSupplyTabIndex={setTotalSupplyTabIndex}
                  targetAmountTabIndex={targetAmountTabIndex}
                  setTargetAmountTabIndex={setTargetAmountTabIndex}
                  totalSupplyOptions={totalSupplyOptions}
                  targetAmountOptionsMap={targetAmountOptionsMap}
                  labelColor={labelColor}
                  isTestEnv={isTestEnv}
                  onValuesChange={handleValuesChange}
                />

                {/* 社媒链接部分 - 使用专门的客户端组件 */}
                <SocialLinksSection
                  isSocialOpen={isSocialOpen}
                  onSocialToggle={onSocialToggle}
                  labelColor={labelColor}
                  inputBg={inputBg}
                  borderColor={borderColor}
                  website={website}
                  twitter={twitter}
                  telegram={telegram}
                  description={description}
                  onWebsiteChange={setWebsite}
                  onTwitterChange={setTwitter}
                  onTelegramChange={setTelegram}
                  onDescriptionChange={setDescription}
                />
              </VStack>
            </Box>
          </CardBody>

          <CardFooter pt={0} p={4} px={5}>
            <Button
              onClick={handleCreateToken}
              colorScheme="purple"
              bg="brand.primary"
              color="white"
              _hover={{ bg: 'brand.light' }}
              size={{ base: 'lg', md: 'lg' }}
              height={{ base: '54px', md: '48px' }}
              fontSize={{ base: 'md', md: 'md' }}
              width="full"
              isLoading={isSubmitting || isConnecting}
              loadingText={publicKey ? t('creating') : t('connecting')}
              isDisabled={publicKey ? (isSubmitting || !tokenIcon || !tokenName || !tokenSymbol || isSymbolValid !== true) : false}
              _disabled={{
                bg: 'gray.400',
                cursor: 'not-allowed',
                opacity: 0.6,
                _hover: { bg: 'gray.400' }
              }}
            >
              {publicKey ? t('createToken') : t('connectWallet')}
            </Button>
          </CardFooter>
        </Card>
      </Container>

      {/* 添加成功弹窗 */}
      <DeploySuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={onSuccessModalClose} 
        tokenMint={deployedTokenMint}
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
      />
      
      {/* 钱包连接弹窗 */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={onWalletModalClose}
        onConnect={handleWalletConnected}
      />
      
      {/* 错误弹窗 */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={onErrorModalClose}
        errorMessage={error?.message || t('createTokenFailed')}
        errorDetails={error?.details}
      />
    </Box>
  )
}
