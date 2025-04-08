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
  useColorMode,
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
} from '@chakra-ui/react'
import { FaUpload, FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa'
import { useState, useEffect, useMemo } from 'react'
import { useNetwork } from '@/contexts/NetworkContext'
import { useTranslation } from 'react-i18next'
import { useSolana } from '@/contexts/solanaProvider'
import { useProgram } from '@/web3/fairMint/hooks/createToken'

// 定义 TokenParametersSection 组件的属性接口
interface TokenParametersSectionProps {
  totalSupplyTabIndex: number
  setTotalSupplyTabIndex: (index: number) => void
  targetAmountTabIndex: number
  setTargetAmountTabIndex: (index: number) => void
  totalSupplyValues: any // 根据实际类型调整
  targetAmountOptions: any // 根据实际类型调整
  totalSupply: number | string
  labelColor: string
  getFormattedPrice: string | number
  getFormattedInversePrice: string | number
  currencyUnit: string
}

// 代币参数响应式组件
const TokenParametersSection = ({
  totalSupplyTabIndex,
  setTotalSupplyTabIndex,
  targetAmountTabIndex,
  setTargetAmountTabIndex,
  totalSupplyValues,
  targetAmountOptions,
  totalSupply,
  labelColor,
  getFormattedPrice,
  getFormattedInversePrice,
  currencyUnit,
}: TokenParametersSectionProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure()

  const { isOpen: isTokenParamsOpen, onToggle: onTokenParamsToggle } =
    useDisclosure()

  const handleParamsClick = () => {
    if (isMobile) {
      onTokenParamsToggle()
    } else {
      onModalOpen()
    }
  }

  const { t } = useTranslation() // 添加翻译函数

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
            {totalSupplyTabIndex === 0 ? '314,000,000' : '1,000,000,000'}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {t('mintingAmount')}
          </Text>
          <Text fontWeight="bold" color={labelColor}>
            {targetAmountOptions[totalSupply][targetAmountTabIndex]}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {t('exchangeRate')}
          </Text>
          <Text fontWeight="bold" color={labelColor}>
            1 : {getFormattedPrice}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            {t('tokenPrice')}
          </Text>
          <Text fontWeight="bold" color={labelColor}>
            {getFormattedInversePrice} {currencyUnit}
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
                  <Tab
                    _selected={{ color: 'white', bg: 'brand.primary' }}
                    fontWeight="semibold"
                  >
                    314,000,000
                  </Tab>
                  <Tab
                    _selected={{ color: 'white', bg: 'brand.primary' }}
                    fontWeight="semibold"
                  >
                    1,000,000,000
                  </Tab>
                </TabList>
              </Tabs>
            </FormControl>

            <Divider />

            <FormControl>
              <FormLabel color={labelColor} fontSize="sm" fontWeight="semibold">
                {t('mintingAmount')}
              </FormLabel>

              {totalSupplyTabIndex === 0 ? (
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
                    <Tab
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      mx={1}
                    >
                      314 {currencyUnit}
                    </Tab>
                    <Tab
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      mx={1}
                    >
                      157 {currencyUnit}
                    </Tab>
                    <Tab
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      mx={1}
                    >
                      78.5 {currencyUnit}
                    </Tab>
                  </TabList>
                </Tabs>
              ) : (
                <Tabs
                  variant="soft-rounded"
                  colorScheme="purple"
                  index={targetAmountTabIndex}
                  onChange={setTargetAmountTabIndex}
                  size="sm"
                >
                  <TabList bg="gray.50" p={1} borderRadius="md" flexWrap="wrap">
                    <Tab
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      m={1}
                    >
                      100 {currencyUnit}
                    </Tab>
                    <Tab
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      m={1}
                    >
                      200 {currencyUnit}
                    </Tab>
                    <Tab
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      m={1}
                    >
                      250 {currencyUnit}
                    </Tab>
                    <Tab
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      m={1}
                    >
                      400 {currencyUnit}
                    </Tab>
                    <Tab
                      _selected={{ color: 'white', bg: 'brand.primary' }}
                      m={1}
                    >
                      500 {currencyUnit}
                    </Tab>
                  </TabList>
                </Tabs>
              )}
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
                      <Tab
                        _selected={{ color: 'white', bg: 'brand.primary' }}
                        fontWeight="semibold"
                      >
                        314,000,000
                      </Tab>
                      <Tab
                        _selected={{ color: 'white', bg: 'brand.primary' }}
                        fontWeight="semibold"
                      >
                        1,000,000,000
                      </Tab>
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

                  {totalSupplyTabIndex === 0 ? (
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
                        <Tab
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          mx={1}
                        >
                          314 {currencyUnit}
                        </Tab>
                        <Tab
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          mx={1}
                        >
                          157 {currencyUnit}
                        </Tab>
                        <Tab
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          mx={1}
                        >
                          78.5 {currencyUnit}
                        </Tab>
                      </TabList>
                    </Tabs>
                  ) : (
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
                        flexWrap="wrap"
                      >
                        <Tab
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          m={1}
                        >
                          100 {currencyUnit}
                        </Tab>
                        <Tab
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          m={1}
                        >
                          200 {currencyUnit}
                        </Tab>
                        <Tab
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          m={1}
                        >
                          250 {currencyUnit}
                        </Tab>
                        <Tab
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          m={1}
                        >
                          400 {currencyUnit}
                        </Tab>
                        <Tab
                          _selected={{ color: 'white', bg: 'brand.primary' }}
                          m={1}
                        >
                          500 {currencyUnit}
                        </Tab>
                      </TabList>
                    </Tabs>
                  )}
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
}

// 社媒链接响应式组件
const SocialLinksSection = ({
  isSocialOpen,
  onSocialToggle,
  labelColor,
  inputBg,
  borderColor,
}: SocialLinksSectionProps) => {
  const { t } = useTranslation() // 添加翻译函数

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
  const { colorMode } = useColorMode()
  const { network } = useNetwork() // 获取当前网络上下文
  const { t } = useTranslation() // 初始化翻译函数
  const [tokenIcon, setTokenIcon] = useState<File | null>(null)
  const [totalSupplyTabIndex, setTotalSupplyTabIndex] = useState(0)
  const [targetAmountTabIndex, setTargetAmountTabIndex] = useState(0)
  const totalSupplyValues = ['314000000', '1000000000']
  const { createToken } = useProgram()
  // 设置当前网络
  // 的计价单位
  const currencyUnit = useMemo(() => {
    return network === 'Solana' ? 'SOL' : 'Pi'
  }, [network])

  const cardBg = useColorModeValue('white', 'gray.800')
  const highlightColor = useColorModeValue('brand.primary', 'brand.light')
  const boxBgGradient = useColorModeValue(
    'linear(to-r, brand.primary, brand.dark)',
    'linear(to-r, brand.primary, brand.dark)'
  )
  const inputBg = useColorModeValue('gray.50', 'whiteAlpha.100')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const labelColor = useColorModeValue('brand.primary', 'brand.light')

  // 社媒信息折叠状态
  const { isOpen: isSocialOpen, onToggle: onSocialToggle } = useDisclosure()
  // const initWallet = async () => {
  //   let publicKey = await window.solana.publicKey
  //   if (!publicKey) {
  //     const result = await window.solana.connect()
  //     publicKey = result.publicKey
  //   }
  // }
  // useEffect(() => {
  //   initWallet()
  // }, [])
  useEffect(() => {
    setTargetAmountTabIndex(0)
  }, [totalSupplyTabIndex])

  // 根据网络生成铸造总额选项数据，同时包含单位
  const targetAmountOptions = useMemo(() => {
    const unit = currencyUnit
    return {
      '314000000': [`314 ${unit}`, `157 ${unit}`, `78.5 ${unit}`],
      '1000000000': [
        `100 ${unit}`,
        `200 ${unit}`,
        `250 ${unit}`,
        `400 ${unit}`,
        `500 ${unit}`,
      ],
    }
  }, [currencyUnit])

  const totalSupply: string = totalSupplyValues[totalSupplyTabIndex]
  const targetAmount: string =
    targetAmountOptions[totalSupply][targetAmountTabIndex]

  const tokenPrice = useMemo(() => {
    const supply = parseFloat(totalSupply)
    const target = parseFloat(targetAmount)

    if (isNaN(supply) || isNaN(target) || target === 0) {
      return 0
    }

    return supply / 2 / target
  }, [totalSupply, targetAmount])

  const formatNumberNoExponent = (num: number): string => {
    const str = num.toString()
    if (str.includes('e')) {
      const exponent = parseInt(str.split('e-')[1], 10)
      const coefficient = parseFloat(str.split('e-')[0])

      if (!isNaN(exponent)) {
        let result = '0.'
        for (let i = 0; i < exponent - 1; i++) {
          result += '0'
        }
        result += coefficient.toString().replace('.', '')
        return result
      }
    }
    return str
  }

  const formattedPrice = useMemo(() => {
    if (tokenPrice > 1000000) {
      return parseFloat(tokenPrice.toFixed(0)).toLocaleString('zh-CN')
    } else if (tokenPrice > 1) {
      return parseFloat(tokenPrice.toFixed(2))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      return formatNumberNoExponent(parseFloat(tokenPrice.toFixed(8)))
    }
  }, [tokenPrice])

  const inversePrice = useMemo(() => {
    if (tokenPrice <= 0) return 0
    return 1 / tokenPrice
  }, [tokenPrice])

  const formattedInversePrice = useMemo(() => {
    if (inversePrice >= 1) {
      return parseFloat(inversePrice.toFixed(6)).toString()
    } else {
      return formatNumberNoExponent(parseFloat(inversePrice.toFixed(8)))
    }
  }, [inversePrice])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTokenIcon(e.target.files[0])
    }
  }

  const getTokenPrice = () => {
    let totalSupply: string = totalSupplyValues[totalSupplyTabIndex]
    let targetAmount: number

    const targetAmountStr: string =
      targetAmountOptions[totalSupply][targetAmountTabIndex]
    targetAmount = parseFloat(targetAmountStr.replace(` ${currencyUnit}`, ''))

    const price = parseFloat(totalSupply) / 2 / targetAmount

    let formattedPrice: string
    if (price > 1000000) {
      formattedPrice = parseFloat(price.toFixed(0)).toLocaleString('zh-CN')
    } else if (price > 1) {
      formattedPrice = parseFloat(price.toFixed(2))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      formattedPrice = formatNumberNoExponent(parseFloat(price.toFixed(8)))
    }

    const inversePrice = 1 / price
    let formattedInversePrice: string
    if (inversePrice >= 1) {
      formattedInversePrice = parseFloat(inversePrice.toFixed(6)).toString()
    } else {
      formattedInversePrice = formatNumberNoExponent(
        parseFloat(inversePrice.toFixed(8))
      )
    }

    return { formattedPrice, formattedInversePrice }
  }

  const {
    formattedPrice: getFormattedPrice,
    formattedInversePrice: getFormattedInversePrice,
  } = getTokenPrice()

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
          <CardBody p={{base:2,sm:6}}>
            <Box width="100%">
              <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color={labelColor} fontWeight="semibold">
                      {t('tokenSymbol')}
                    </FormLabel>
                    <Input
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
                  >
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
                  </Box>
                </FormControl>

                {/* 代币参数部分 - 使用专门的客户端组件 */}
                <TokenParametersSection
                  totalSupplyTabIndex={totalSupplyTabIndex}
                  setTotalSupplyTabIndex={setTotalSupplyTabIndex}
                  targetAmountTabIndex={targetAmountTabIndex}
                  setTargetAmountTabIndex={setTargetAmountTabIndex}
                  totalSupplyValues={totalSupplyValues}
                  targetAmountOptions={targetAmountOptions}
                  totalSupply={totalSupply}
                  labelColor={labelColor}
                  getFormattedPrice={getFormattedPrice}
                  getFormattedInversePrice={getFormattedInversePrice}
                  currencyUnit={currencyUnit}
                />

                {/* 社媒链接部分 - 使用专门的客户端组件 */}
                <SocialLinksSection
                  isSocialOpen={isSocialOpen}
                  onSocialToggle={onSocialToggle}
                  labelColor={labelColor}
                  inputBg={inputBg}
                  borderColor={borderColor}
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
              onClick={() => {
                createToken({
                  name: 'test',
                  symbol: 'test',
                  uri: 'https://test.com',
                  supply: '1000000000',
                })
              }}
              colorScheme="purple"
              bg="brand.primary"
              color="white"
              _hover={{ bg: 'brand.light' }}
              size={{ base: 'lg', md: 'lg' }}
              height={{ base: '54px', md: '48px' }}
              fontSize={{ base: 'md', md: 'md' }}
              width="full"
            >
              {publicKey ? '铸造' : t('connectWallet')}
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </Box>
  )
}
