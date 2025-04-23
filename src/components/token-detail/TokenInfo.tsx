'use client'

import { useState, useRef } from 'react'
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Icon,
  Button,
  Divider,
  Progress,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  useToast,
  Flex,
  Image,
  Badge,
  Grid,
  GridItem,
  Link,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FaChartPie,
  FaFileContract,
  FaCopy,
  FaClock,
  FaWallet,
  FaUsers,
  FaInfoCircle,
  FaGlobe,
  FaTwitter,
  FaTelegram,
  FaShareAlt,
  FaExchangeAlt,
  FaCoins,
  FaTag,
  FaLayerGroup,
  FaSync,
} from 'react-icons/fa'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
// import { formatAddress } from '@/lib/utils'
import MintingForm from './MintingForm'
import MintingInstructions from './MintingInstructions'
import { useTranslation } from 'react-i18next'
import { formatTokenAmount } from '@/utils'
import { useMintingCalculations } from '@/hooks/useMintingCalculations'

// 添加本地formatAddress函数
const formatAddress = (address: string): string => {
  if (!address) return ''
  const start = address.substring(0, 6)
  const end = address.substring(address.length - 4)
  return `${start}...${end}`
}

interface TokenInfoProps {
  token: {
    name: string
    symbol: string
    image: string
    totalSupply: string
    target: string
    raised: string
    progress: number
    mintRate?: string
    contractAddress?: string
    deployedAt?: number
    lastUpdatedAt?: number
    website?: string
    twitter?: string
    telegram?: string
    exchangeRate?: string
    mintedAmount?: string
  }
  mintRef?: React.RefObject<HTMLButtonElement>
  currencyUnit?: string
}

export default function TokenInfo({
  token,
  mintRef,
  currencyUnit = 'SOL',
}: TokenInfoProps) {
  const [isMintingOpen, setIsMintingOpen] = useState(false)
  const {
    isOpen: isInstructionsOpen,
    onOpen: onInstructionsOpen,
    onClose: onInstructionsClose,
  } = useDisclosure()
  const cardBg = useColorModeValue('white', 'gray.800')
  const softBg = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const secondaryText = useColorModeValue('gray.600', 'gray.400')
  const tertiaryText = useColorModeValue('gray.500', 'gray.500')
  const toast = useToast()
  const { t } = useTranslation()

  // 使用自定义Hook处理铸造计算
  const {
    mintingPrice,
    mintingRatio,
    getFormattedMintRate,
    calculateMintedAmount,
  } = useMintingCalculations({
    totalSupply: token.totalSupply,
    target: token.target,
    mintRate: token.mintRate,
    currencyUnit,
    tokenDecimals: 6,
  })

  // 打开铸造弹窗
  const openMinting = () => {
    setIsMintingOpen(true)
  }

  // 关闭铸造弹窗
  const closeMinting = () => {
    setIsMintingOpen(false)
  }

  // 复制合约地址
  const copyContractAddress = () => {
    if (token?.contractAddress) {
      navigator.clipboard
        .writeText(token.contractAddress)
        .then(() =>
          toast({
            title: t('copySuccess'),
            description: t('addressCopied'),
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
          })
        )
        .catch(err => console.error(`${t('copyFailed')}:`, err))
    }
  }

  // 格式化日期时间，精确到分钟
  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // 计算剩余金额
  const getRemainingAmount = () => {
    // 从target和raised中提取数值部分
    const targetNum = parseFloat(token.target.replace(/[^0-9.]/g, ''))
    const raisedNum = parseFloat(token.raised.replace(/[^0-9.]/g, ''))
    // 返回格式化的剩余金额，使用动态的货币单位
    return (targetNum - raisedNum).toFixed(2) + ` ${currencyUnit}`
  }

  // 获取兑换比率 (X代币:1货币单位)
  const getExchangeRate = () => {
    // 优先使用token.exchangeRate
    if (token.exchangeRate) return token.exchangeRate

    // 否则使用Hook提供的格式化方法
    return getFormattedMintRate()
  }

  // 计算已铸造代币数量
  const getMintedAmount = () => {
    // 优先使用token.mintedAmount
    if (token.mintedAmount) return token.mintedAmount

    // 否则使用Hook提供的计算方法
    return calculateMintedAmount(token.raised, token.symbol)
  }

  // 分享功能处理
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${token.name} (${token.symbol})`,
          text: `${t('share')} ${token.name} ${t('token')}`,
          url: window.location.href,
        })
        .catch(error => console.log(`${t('share')} ${t('failed')}:`, error))
    } else {
      // 如果浏览器不支持，可以复制链接到剪贴板
      navigator.clipboard
        .writeText(window.location.href)
        .then(() =>
          toast({
            title: t('copySuccess'),
            description: t('linkCopied'),
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
          })
        )
        .catch(error => console.log(`${t('copyFailed')}:`, error))
    }
  }

  return (
    <>
      <Card
        bg={cardBg}
        boxShadow="md"
        borderRadius="lg"
        overflow="hidden"
        width="100%"
        maxW="100%"
      >
        <CardBody p={{ base: 3, md: 5 }} width="100%">
          <VStack spacing={{ base: 4, md: 6 }} align="stretch" width="100%">
            {/* 代币标题和图标部分 */}
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              gap={{ base: 3, md: 6 }}
              width="100%"
            >
              {/* 移动端布局 - 更紧凑的排列 */}
              <Box display={{ base: 'block', md: 'none' }} w="full" maxW="100%">
                {/* 水平排列代币图标和名称 */}
                <Flex align="center" gap={3} mb={2} width="100%">
                  <Image
                    src={token.image}
                    alt={token.name}
                    boxSize="60px"
                    borderRadius="full"
                    border="3px solid"
                    borderColor="brand.light"
                    bg={softBg}
                  />

                  <VStack
                    align="flex-start"
                    spacing={0}
                    flex="1"
                    maxW="calc(100% - 80px)"
                  >
                    <Heading
                      as="h1"
                      size="md"
                      color="brand.primary"
                      isTruncated
                      maxW="100%"
                    >
                      {token.symbol}
                    </Heading>
                    <Text
                      color={secondaryText}
                      fontSize="sm"
                      isTruncated
                      maxW="100%"
                    >
                      {token.name}
                    </Text>
                  </VStack>
                </Flex>

                {/* 社交媒体链接和更新时间在一行 */}
                <Flex
                  justify="space-between"
                  align="center"
                  mt={1}
                  width="100%"
                >
                  <HStack spacing={2}>
                    {token.website && (
                      <Box
                        as="a"
                        href={token.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        p={1.5}
                        borderRadius="full"
                        bg={softBg}
                        color="brand.primary"
                        _hover={{ bg: 'brand.light', color: 'white' }}
                        transition="all 0.2s"
                      >
                        <Icon as={FaGlobe} boxSize="14px" />
                      </Box>
                    )}
                    {token.twitter && (
                      <Box
                        as="a"
                        href={token.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        p={1.5}
                        borderRadius="full"
                        bg={softBg}
                        color="brand.primary"
                        _hover={{ bg: 'brand.light', color: 'white' }}
                        transition="all 0.2s"
                      >
                        <Icon as={FaTwitter} boxSize="14px" />
                      </Box>
                    )}
                    {token.telegram && (
                      <Box
                        as="a"
                        href={token.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        p={1.5}
                        borderRadius="full"
                        bg={softBg}
                        color="brand.primary"
                        _hover={{ bg: 'brand.light', color: 'white' }}
                        transition="all 0.2s"
                      >
                        <Icon as={FaTelegram} boxSize="14px" />
                      </Box>
                    )}
                    <Box
                      as="button"
                      onClick={handleShare}
                      p={1.5}
                      borderRadius="full"
                      bg={softBg}
                      color="brand.primary"
                      _hover={{ bg: 'brand.light', color: 'white' }}
                      transition="all 0.2s"
                    >
                      <Icon as={FaShareAlt} boxSize="14px" />
                    </Box>
                  </HStack>

                  <Badge colorScheme="blue" p={1} fontSize="2xs">
                    <HStack spacing={1}>
                      <Icon as={FaSync} color="blue.500" boxSize="8px" />
                      <Text>
                        {t('mintingLastUpdated')}{' '}
                        {token.lastUpdatedAt
                          ? formatDateTime(token.lastUpdatedAt)
                          : formatDateTime(Date.now())}
                      </Text>
                    </HStack>
                  </Badge>
                </Flex>

                {/* 部署时间 */}
                {token.deployedAt && (
                  <Text fontSize="xs" color={tertiaryText} mt={1}>
                    <Icon as={FaClock} boxSize="10px" mr={1} />
                    {t('deployed')}: {formatDateTime(token.deployedAt)}
                  </Text>
                )}
              </Box>

              {/* 桌面端布局 - 保持不变 */}
              <Image
                src={token.image}
                alt={token.name}
                boxSize={{ base: '80px', md: '105px' }}
                borderRadius="full"
                border="4px solid"
                borderColor="brand.light"
                bg={softBg}
                display={{ base: 'none', md: 'block' }}
              />

              {/* 中间：代币名称和社交媒体链接 */}
              <VStack
                align={{ base: 'center', md: 'flex-start' }}
                spacing={{ base: 2, md: 4 }}
                flex="1"
                display={{ base: 'none', md: 'flex' }}
              >
                <VStack
                  align={{ base: 'center', md: 'flex-start' }}
                  spacing={1}
                >
                  <Heading
                    as="h1"
                    size={{ base: 'lg', md: 'xl' }}
                    color="brand.primary"
                  >
                    {token.symbol}
                  </Heading>
                  <Text
                    color={secondaryText}
                    fontSize={{ base: 'md', md: 'lg' }}
                  >
                    {token.name}
                  </Text>
                </VStack>

                {/* 社交媒体链接和分享按钮 */}
                <HStack
                  spacing={{ base: 3, md: 4 }}
                  justify={{ base: 'center', md: 'flex-start' }}
                >
                  {token.website && (
                    <Box
                      as="a"
                      href={token.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      p={{ base: 1.5, md: 2 }}
                      borderRadius="full"
                      bg={softBg}
                      color="brand.primary"
                      _hover={{ bg: 'brand.light', color: 'white' }}
                      transition="all 0.2s"
                    >
                      <Icon
                        as={FaGlobe}
                        boxSize={{ base: '16px', md: '18px' }}
                      />
                    </Box>
                  )}
                  {token.twitter && (
                    <Box
                      as="a"
                      href={token.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      p={{ base: 1.5, md: 2 }}
                      borderRadius="full"
                      bg={softBg}
                      color="brand.primary"
                      _hover={{ bg: 'brand.light', color: 'white' }}
                      transition="all 0.2s"
                    >
                      <Icon
                        as={FaTwitter}
                        boxSize={{ base: '16px', md: '18px' }}
                      />
                    </Box>
                  )}
                  {token.telegram && (
                    <Box
                      as="a"
                      href={token.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      p={{ base: 1.5, md: 2 }}
                      borderRadius="full"
                      bg={softBg}
                      color="brand.primary"
                      _hover={{ bg: 'brand.light', color: 'white' }}
                      transition="all 0.2s"
                    >
                      <Icon
                        as={FaTelegram}
                        boxSize={{ base: '16px', md: '18px' }}
                      />
                    </Box>
                  )}
                  <Box
                    as="button"
                    onClick={handleShare}
                    p={{ base: 1.5, md: 2 }}
                    borderRadius="full"
                    bg={softBg}
                    color="brand.primary"
                    _hover={{ bg: 'brand.light', color: 'white' }}
                    transition="all 0.2s"
                  >
                    <Icon
                      as={FaShareAlt}
                      boxSize={{ base: '16px', md: '18px' }}
                    />
                  </Box>
                </HStack>
              </VStack>

              {/* 右侧：时间信息 */}
              <VStack
                spacing={1}
                align="flex-end"
                display={{ base: 'none', md: 'flex' }}
              >
                {/* 最后更新时间 */}
                <HStack
                  bg="blue.50"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                >
                  <Icon as={FaSync} color="blue.500" boxSize="10px" />
                  <Text fontWeight="medium">{t('mintingLastUpdated')}</Text>
                  <Badge colorScheme="blue" fontSize="2xs">
                    {token.lastUpdatedAt
                      ? formatDateTime(token.lastUpdatedAt)
                      : formatDateTime(Date.now())}
                  </Badge>
                </HStack>

                {/* 部署时间 (弱化显示) */}
                {token.deployedAt && (
                  <Text fontSize="xs" color={tertiaryText}>
                    <Icon as={FaClock} boxSize="10px" mr={1} />
                    {t('deployed')}: {formatDateTime(token.deployedAt)}
                  </Text>
                )}
              </VStack>
            </Flex>

            {/* 铸造按钮 - 仅在移动端显示，从顶部移到合约地址上方 */}
            {/* 原来的铸造按钮在此处移除，将放置在合约地址上方 */}

            <Divider />

            {/* 合约地址 - 移动端优化 */}
            {token.contractAddress && (
              <Box width="100%">
                {/* 移动端铸造按钮 - 现在放在合约地址上方 */}
                <Button
                  onClick={openMinting}
                  colorScheme="purple"
                  size={{ base: 'md', md: 'lg' }}
                  width="100%"
                  leftIcon={<FaCoins />}
                  fontWeight="bold"
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  _active={{ transform: 'translateY(0)', boxShadow: 'md' }}
                  transition="all 0.2s"
                  display={{ base: 'flex', lg: 'none' }}
                  ref={mintRef}
                  mb={4}
                >
                  {t('mintToken')}
                </Button>

                <Text
                  fontWeight="medium"
                  mb={2}
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  {t('contractAddressColumn')}
                </Text>
                {/* 桌面端布局 */}
                <HStack
                  bg={softBg}
                  p={3}
                  borderRadius="md"
                  fontSize="sm"
                  fontFamily="mono"
                  display={{ base: 'none', md: 'flex' }}
                  width="100%"
                  overflow="hidden"
                >
                  <Icon
                    as={FaFileContract}
                    color="brand.primary"
                    flexShrink={0}
                  />
                  <Text
                    flex={1}
                    noOfLines={1}
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {token.contractAddress}
                  </Text>
                  <Button
                    size="sm"
                    leftIcon={<FaCopy />}
                    onClick={copyContractAddress}
                    variant="outline"
                    colorScheme="purple"
                    flexShrink={0}
                  >
                    {t('copy')}
                  </Button>
                </HStack>

                {/* 移动端布局 */}
                <Box display={{ base: 'block', md: 'none' }} width="100%">
                  <Flex
                    bg={softBg}
                    p={2}
                    borderRadius="md"
                    fontSize="xs"
                    fontFamily="mono"
                    align="center"
                    onClick={copyContractAddress}
                    cursor="pointer"
                    role="button"
                    _hover={{ bg: 'gray.100' }}
                    transition="all 0.2s"
                    width="100%"
                    overflow="hidden"
                  >
                    <Icon
                      as={FaFileContract}
                      color="brand.primary"
                      minW="14px"
                      flexShrink={0}
                    />
                    <Text
                      ml={1}
                      flex={1}
                      noOfLines={1}
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {token.contractAddress &&
                      token.contractAddress.length > 40
                        ? `${token.contractAddress.substring(
                            0,
                            14
                          )}...${token.contractAddress.substring(
                            token.contractAddress.length - 14
                          )}`
                        : token.contractAddress}
                    </Text>
                    <Icon
                      as={FaCopy}
                      color="brand.primary"
                      boxSize="12px"
                      ml={2}
                      flexShrink={0}
                    />
                  </Flex>
                </Box>
              </Box>
            )}

            {/* 铸造进度 */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>
                  {t('progressColumn')}
                </Text>
                <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                  {token.progress}%
                </Text>
              </HStack>
              <Progress
                value={token.progress}
                colorScheme="purple"
                borderRadius="full"
                size="md"
                mb={3}
              />

              {/* 移动端: 更紧凑的统计信息 */}
              <Box display={{ base: 'block', md: 'none' }}>
                <Flex
                  justify="space-between"
                  bg={softBg}
                  p={3}
                  borderRadius="lg"
                  mb={2}
                >
                  <HStack>
                    <Icon as={FaChartPie} color="green.500" boxSize="16px" />
                    <Text fontSize="xs" color={secondaryText}>
                      {t('target')}:
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" fontSize="sm" color="green.500">
                    {token.target}
                  </Text>
                </Flex>

                <Flex
                  justify="space-between"
                  bg={softBg}
                  p={3}
                  borderRadius="lg"
                  mb={2}
                >
                  <HStack>
                    <Icon as={FaWallet} color="purple.500" boxSize="16px" />
                    <Text fontSize="xs" color={secondaryText}>
                      {t('raised')}:
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" fontSize="sm" color="purple.500">
                    {token.raised}
                  </Text>
                </Flex>

                <Flex
                  justify="space-between"
                  bg={softBg}
                  p={3}
                  borderRadius="lg"
                >
                  <HStack>
                    <Icon as={FaUsers} color="blue.500" boxSize="16px" />
                    <Text fontSize="xs" color={secondaryText}>
                      {t('participantsColumn')}:
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" fontSize="sm" color="blue.500">
                    {token.participants}
                  </Text>
                </Flex>
              </Box>

              {/* 桌面端: 保持原有的网格布局 */}
              <SimpleGrid
                columns={3}
                spacing={4}
                display={{ base: 'none', md: 'grid' }}
              >
                <Box
                  bg={softBg}
                  p={4}
                  borderRadius="lg"
                  boxShadow="sm"
                  textAlign="center"
                >
                  <Icon
                    as={FaChartPie}
                    color="green.500"
                    boxSize="24px"
                    mb={2}
                  />
                  <Text color={secondaryText} fontSize="sm">
                    {t('targetSort')}
                  </Text>
                  <Text fontWeight="bold" fontSize="xl" color="green.500">
                    {token.target}
                  </Text>
                </Box>

                <Box
                  bg={softBg}
                  p={4}
                  borderRadius="lg"
                  boxShadow="sm"
                  textAlign="center"
                >
                  <Icon
                    as={FaWallet}
                    color="purple.500"
                    boxSize="24px"
                    mb={2}
                  />
                  <Text color={secondaryText} fontSize="sm">
                    {t('raisedSort')}
                  </Text>
                  <Text fontWeight="bold" fontSize="xl" color="purple.500">
                    {token.raised}
                  </Text>
                </Box>

                <Box
                  bg={softBg}
                  p={4}
                  borderRadius="lg"
                  boxShadow="sm"
                  textAlign="center"
                >
                  <Icon as={FaUsers} color="blue.500" boxSize="24px" mb={2} />
                  <Text color={secondaryText} fontSize="sm">
                    {t('participantsColumn')}
                  </Text>
                  <Text fontWeight="bold" fontSize="xl" color="blue.500">
                    {token.participants}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* 代币信息 - 移动端优化 */}
            <Box>
              <Text
                fontWeight="medium"
                mb={2}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                {t('tokenDetails')}
              </Text>

              {/* 移动端: 紧凑的表格式布局 */}
              <Box display={{ base: 'block', md: 'none' }}>
                <Grid templateColumns="auto 1fr" gap={2} fontSize="xs">
                  <GridItem>
                    <HStack bg={softBg} p={2} borderRadius="md" h="full">
                      <Icon
                        as={FaLayerGroup}
                        color="brand.primary"
                        boxSize="12px"
                      />
                      <Text color={secondaryText}>
                        {t('totalSupplyColumn')}
                      </Text>
                    </HStack>
                  </GridItem>
                  <GridItem>
                    <Flex
                      bg={softBg}
                      p={2}
                      borderRadius="md"
                      h="full"
                      align="center"
                      justify="flex-end"
                    >
                      <Text fontWeight="bold">
                        {formatTokenAmount(token.totalSupply, {
                          abbreviate: true,
                        })}
                      </Text>
                    </Flex>
                  </GridItem>

                  {/* 价格栏显示，无论有没有mintRate都显示 */}
                  <GridItem>
                    <HStack bg={softBg} p={2} borderRadius="md" h="full">
                      <Icon
                        as={FaWallet}
                        color="brand.primary"
                        boxSize="12px"
                      />
                      <Text color={secondaryText}>{t('priceColumn')}</Text>
                    </HStack>
                  </GridItem>
                  <GridItem>
                    <Flex
                      bg={softBg}
                      p={2}
                      borderRadius="md"
                      h="full"
                      align="center"
                      justify="flex-end"
                    >
                      <Text fontWeight="bold" fontSize="sm">
                        {token.mintRate || mintingPrice}
                      </Text>
                    </Flex>
                  </GridItem>

                  {/* 兑换比例栏，无论有没有mintRate都显示 */}
                  <GridItem>
                    <HStack bg={softBg} p={2} borderRadius="md" h="full">
                      <Icon
                        as={FaExchangeAlt}
                        color="brand.primary"
                        boxSize="12px"
                      />
                      <Text color={secondaryText}>{t('mintRate')}</Text>
                    </HStack>
                  </GridItem>
                  <GridItem>
                    <Flex
                      bg={softBg}
                      p={2}
                      borderRadius="md"
                      h="full"
                      align="center"
                      justify="flex-end"
                    >
                      <Text fontWeight="bold">{getExchangeRate()}</Text>
                    </Flex>
                  </GridItem>

                  {/* 已铸造代币数量栏，只要有raised数据就显示 */}
                  {token.raised && (
                    <>
                      <GridItem>
                        <HStack bg={softBg} p={2} borderRadius="md" h="full">
                          <Icon
                            as={FaCoins}
                            color="brand.primary"
                            boxSize="12px"
                          />
                          <Text color={secondaryText}>{t('mintedTokens')}</Text>
                        </HStack>
                      </GridItem>
                      <GridItem>
                        <Flex
                          bg={softBg}
                          p={2}
                          borderRadius="md"
                          h="full"
                          align="center"
                          justify="flex-end"
                        >
                          <Text fontWeight="bold">{getMintedAmount()}</Text>
                        </Flex>
                      </GridItem>
                    </>
                  )}
                </Grid>
              </Box>

              {/* 桌面端: 保持原有的网格布局 */}
              <SimpleGrid
                columns={2}
                spacing={4}
                display={{ base: 'none', md: 'grid' }}
              >
                <HStack
                  justify="space-between"
                  p={3}
                  bg={softBg}
                  borderRadius="md"
                >
                  <HStack spacing={1}>
                    <Icon
                      as={FaLayerGroup}
                      color="brand.primary"
                      boxSize="14px"
                    />
                    <Text color={secondaryText} fontSize="sm">
                      {t('totalSupplyColumn')}
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" fontSize="sm">
                    {formatTokenAmount(token.totalSupply, { abbreviate: true })}
                  </Text>
                </HStack>

                {/* 价格栏显示，无论有没有mintRate都显示 */}
                <HStack
                  justify="space-between"
                  p={3}
                  bg={softBg}
                  borderRadius="md"
                >
                  <HStack spacing={1}>
                    <Icon as={FaWallet} color="brand.primary" boxSize="14px" />
                    <Text color={secondaryText} fontSize="sm">
                      {t('priceColumn')}
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" fontSize="sm">
                    {token.mintRate || mintingPrice}
                  </Text>
                </HStack>

                {/* 兑换比例栏，无论有没有mintRate都显示 */}
                <HStack
                  justify="space-between"
                  p={3}
                  bg={softBg}
                  borderRadius="md"
                >
                  <HStack spacing={1}>
                    <Icon
                      as={FaExchangeAlt}
                      color="brand.primary"
                      boxSize="14px"
                    />
                    <Text color={secondaryText} fontSize="sm">
                      {t('mintRate')}
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" fontSize="sm">
                    {getExchangeRate()}
                  </Text>
                </HStack>

                {/* 已铸造代币数量栏，只要有raised数据就显示 */}
                {token.raised && (
                  <HStack
                    justify="space-between"
                    p={3}
                    bg={softBg}
                    borderRadius="md"
                  >
                    <HStack spacing={1}>
                      <Icon as={FaCoins} color="brand.primary" boxSize="14px" />
                      <Text color={secondaryText} fontSize="sm">
                        {t('mintedTokens')}
                      </Text>
                    </HStack>
                    <Text fontWeight="bold" fontSize="sm">
                      {getMintedAmount()}
                    </Text>
                  </HStack>
                )}
              </SimpleGrid>
            </Box>

            {/* 添加铸造说明 - PC端直接显示 */}
            <Box width="100%" display={{ base: 'none', lg: 'block' }}>
              <MintingInstructions
                token={{
                  symbol: token.symbol,
                  mintRate: token.mintRate,
                  currencyUnit: currencyUnit,
                  totalSupply: token.totalSupply,
                }}
              />
            </Box>

            {/* 仅在移动端显示的铸造说明按钮 */}
            <Box width="100%" display={{ base: 'block', lg: 'none' }}>
              <Button
                leftIcon={<Icon as={FaInfoCircle} />}
                onClick={onInstructionsOpen}
                variant="outline"
                colorScheme="purple"
                size="md"
                width="100%"
                mt={2}
              >
                {t('mintingInstructions')}
              </Button>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* 铸造弹窗 */}
      <MintingForm
        token={{
          symbol: token.symbol,
          mintRate: token.mintRate || '0.000001', // 提供默认值避免类型错误
          currencyUnit: currencyUnit,
          totalSupply: token.totalSupply,
        }}
        isModal={true}
        isOpen={isMintingOpen}
        onClose={closeMinting}
      />

      {/* 铸造说明弹窗 - 移动端 */}
      <MintingInstructions
        token={{
          symbol: token.symbol,
          mintRate: token.mintRate,
          currencyUnit: currencyUnit,
          totalSupply: token.totalSupply,
        }}
        isModal={true}
        isOpen={isInstructionsOpen}
        onClose={onInstructionsClose}
      />
    </>
  )
}
