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
} from '@chakra-ui/react'
import { FaUpload, FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNetwork } from '@/contexts/NetworkContext'
import { useTranslation } from 'react-i18next'
import { useSolana } from '@/contexts/solanaProvider'
import { TokenAPI, CreateTokenParams } from '@/api/token'

// 定义代币参数组件的属性接口
interface TokenParametersSectionProps {
  totalSupplyTabIndex: number
  setTotalSupplyTabIndex: (index: number) => void
  targetAmountTabIndex: number
  setTargetAmountTabIndex: (index: number) => void
  totalSupplyOptions: string[]
  targetAmountOptionsMap: Record<string, string[]>
  labelColor: string
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

  // 计算代币单价
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
        bg="gray.50"
        p={4}
        borderRadius="md"
        mt={2}
      >
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {t('totalSupply')}
          </Text>
          <Text fontWeight="bold" color={labelColor}>
            {totalSupplyOptions[totalSupplyTabIndex]}
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
            {
              targetAmountOptionsMap[totalSupplyOptions[totalSupplyTabIndex]][
                targetAmountTabIndex
              ]
            }
          </Text>
        </Box>
      </SimpleGrid>

      {/* 移动端折叠区域参数设置 */}
      {isMobile && (
        <Box
          display={isTokenParamsOpen ? 'block' : 'none'}
          mt={4}
          pl={0}
          bg="gray.50"
          p={4}
          borderRadius="md"
        >
          <VStack spacing={5} align="stretch">
            <FormControl>
              <FormLabel color={labelColor} fontSize="sm" fontWeight="semibold">
                {t('totalSupply')}
              </FormLabel>
              <Tabs
                variant="soft-rounded"
                colorScheme="purple"
                index={totalSupplyTabIndex}
                onChange={setTotalSupplyTabIndex}
                isFitted
              >
                <TabList bg="gray.50" p={1} borderRadius="md">
                  {totalSupplyOptions.map((option, index) => (
                    <Tab
                      key={index}
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
              <FormLabel color={labelColor} fontSize="sm" fontWeight="semibold">
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
                  p={1}
                  borderRadius="md"
                  justifyContent="start"
                >
                  {targetAmountOptionsMap[
                    totalSupplyOptions[totalSupplyTabIndex]
                  ].map((option, index) => (
                    <Tab
                      key={index}
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      mx={1}
                    >
                      {option}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
            </FormControl>
            <Button
              colorScheme="purple"
              mt={2}
              bg="brand.primary"
              size="md"
              width="100%"
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
        >
          <ModalOverlay />
          <ModalContent borderRadius={{ base: 0, md: 'md' }}>
            <ModalHeader color="brand.primary">{t('settings')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
              <VStack spacing={5} align="stretch">
                <FormControl>
                  <FormLabel
                    color={labelColor}
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
                    <TabList bg="gray.50" p={1} borderRadius="md">
                      {totalSupplyOptions.map((option, index) => (
                        <Tab
                          key={index}
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
                    color={labelColor}
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
                      p={1}
                      borderRadius="md"
                      justifyContent="start"
                    >
                      {targetAmountOptionsMap[
                        totalSupplyOptions[totalSupplyTabIndex]
                      ].map((option, index) => (
                        <Tab
                          key={index}
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          mx={1}
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
                colorScheme="purple"
                mr={3}
                onClick={onModalClose}
                bg="brand.primary"
                size={{ base: 'lg', md: 'md' }}
                width={{ base: 'full', md: 'auto' }}
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
  website?: string
  twitter?: string
  telegram?: string
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
  website = '',
  twitter = '',
  telegram = '',
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
  const { publicKey } = useSolana()
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

  // 折叠面板状态
  const { isOpen: isSocialOpen, onToggle: onSocialToggle } = useDisclosure()

  // 定义当前网络的计价单位
  const currencyUnit = useMemo(() => {
    return network === 'Solana' ? 'SOL' : 'Pi'
  }, [network])

  // 定义代币发行总量选项
  const totalSupplyOptions = ['314000000', '1000000000']

  // 定义目标铸造金额选项映射（带单位的值）
  const targetAmountOptionsMap = useMemo(
    () => ({
      '314000000': [
        `314 ${currencyUnit}`,
        `157 ${currencyUnit}`,
        `78.5 ${currencyUnit}`,
      ],
      '1000000000': [
        `100 ${currencyUnit}`,
        `200 ${currencyUnit}`,
        `250 ${currencyUnit}`,
        `400 ${currencyUnit}`,
        `500 ${currencyUnit}`,
      ],
    }),
    [currencyUnit]
  )

  // 当前选中的值
  const [selectedValues, setSelectedValues] = useState<{
    totalSupply: string
    targetAmount: string
  }>({
    totalSupply: totalSupplyOptions[0],
    targetAmount: '314', // 初始值不带单位
  })

  const handleValuesChange = useCallback(
    (values: { totalSupply: string; targetAmount: string }) => {
      setSelectedValues(values)
    },
    []
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTokenIcon(e.target.files[0])
    }
  }

  const handleCreateToken = async () => {
    if (!tokenIcon || !tokenName || !tokenSymbol) {
      toast({
        title: t('error'),
        description: t('pleaseCompleteForm'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setIsSubmitting(true)

      const params: CreateTokenParams = {
        name: tokenName,
        symbol: tokenSymbol,
        logo: tokenIcon,
        init_liquidity: selectedValues.targetAmount,
        total_supply: selectedValues.totalSupply,
        description: '测试',
      }

      const result = await TokenAPI.createToken(params)
      console.log('创建成功：', result)

      toast({
        title: t('success'),
        description: t('tokenCreated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('创建失败：', error)
      toast({
        title: t('error'),
        description: t('createTokenFailed'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 社交媒体链接状态
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [telegram, setTelegram] = useState('')

  // 监听创建代币所需的所有参数
  useEffect(() => {
    const params = {
      // 基本信息
      name: tokenName,
      symbol: tokenSymbol,
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

    console.log('代币创建参数:', params)

    // 验证必填参数
    const requiredFields = {
      name: '代币名称',
      symbol: '代币符号',
      file: '代币图标',
      total_supply: '发行总量',
      init_liquidity: '目标铸造金额',
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([fieldName]) => !params[fieldName])
      .map(([, label]) => label)

    if (missingFields.length > 0) {
      console.warn('缺少必填参数:', missingFields.join(', '))
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
    <Box bg="brand.background" minH="100vh" color={textColor}>
      <Box bg={useColorModeValue('brand.50', 'gray.800')} py={8} mb={6}>
        <Container maxW={'container.xl'} textAlign="center">
          <Heading as="h1" size="xl" mb={4} color="brand.primary">
            {t('deployTitle')}
          </Heading>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
            {t('deployDescription')}
          </Text>
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
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color={labelColor} fontWeight="semibold">
                      {t('tokenSymbol')}
                    </FormLabel>
                    <Input
                      value={tokenSymbol}
                      onChange={e => setTokenSymbol(e.target.value)}
                      placeholder=""
                      bg={inputBg}
                      borderColor={borderColor}
                      _placeholder={{ color: 'gray.400' }}
                      size="md"
                    />
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
                </SimpleGrid>

                <FormControl isRequired mb={4}>
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
                        </Text>
                      </>
                    )}
                  </Box>
                </FormControl>

                {/* 代币参数部分 - 使用专门的客户端组件 */}
                <TokenParametersSection
                  totalSupplyTabIndex={totalSupplyTabIndex}
                  setTotalSupplyTabIndex={setTotalSupplyTabIndex}
                  targetAmountTabIndex={targetAmountTabIndex}
                  setTargetAmountTabIndex={setTargetAmountTabIndex}
                  totalSupplyOptions={totalSupplyOptions}
                  targetAmountOptionsMap={targetAmountOptionsMap}
                  labelColor={labelColor}
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
                  onWebsiteChange={setWebsite}
                  onTwitterChange={setTwitter}
                  onTelegramChange={setTelegram}
                />
              </VStack>
            </Box>
          </CardBody>

          <CardFooter
            borderTop="1px"
            borderColor={borderColor}
            py={{ base: 5, md: 4 }}
            px={{ base: 4, md: 6 }}
            bg="gray.50"
          >
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
              isLoading={isSubmitting}
              loadingText={t('creating')}
            >
              {publicKey ? t('createToken') : t('connectWallet')}
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </Box>
  )
}
