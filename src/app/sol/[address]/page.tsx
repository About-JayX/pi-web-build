'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stack,
  Divider,
  HStack,
  Progress,
  Icon,
  useColorModeValue,
  Center,
  Button,
  Flex,
  SimpleGrid,
  useToast,
  Link as ChakraLink,
  Image,
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { FaCoins, FaUsers, FaChartPie, FaArrowLeft, FaExclamationTriangle, FaFileContract, FaGlobe, FaTwitter, FaTelegram, FaShareAlt } from 'react-icons/fa'
import MintingForm from '@/components/token-detail/MintingForm'
import { useSolana } from '@/contexts/solanaProvider'
import { useFairCurve } from '@/web3/fairMint/hooks/useFairCurve'
import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { LoadingSpinner } from '@/components'
import { MintingInstructions } from '@/components/token-detail'
import { TokenAPI } from '@/api/token'
import { TokenInfo } from '@/api/types'
import { useMintingCalculations } from '@/hooks/useMintingCalculations'
import { IconType } from 'react-icons'
import { ShareModal } from '@/components'
import { useNetwork } from '@/contexts/NetworkContext'

// 扩展TokenInfo接口以包含社交媒体链接
interface ExtendedTokenInfo extends TokenInfo {
  website?: string;
  twitter?: string;
  telegram?: string;
  socials?: {
    id: number;
    link: string;
    platform: string;
  }[];
}

interface SocialLinkDisplay {
  platform: string;
  link: string;
  icon: IconType;
}

export default function TokenMintPage() {
  const { address } = useParams()
  const { t } = useTranslation()
  const { conn, wallet } = useSolana()
  const [tokenInfo, setTokenInfo] = useState<ExtendedTokenInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()
  const { network } = useNetwork()

  // 获取token详情
  useEffect(() => {
    const fetchTokenDetail = async () => {
      if (!address) return
      try {
        setLoading(true)
        const data = await TokenAPI.getTokenDetail(address as string)
        setTokenInfo(data)
      } catch (err) {
        console.error('Failed to fetch token detail:', err)
        setError(t('tokenNotFound'))
      } finally {
        setLoading(false)
      }
    }

    fetchTokenDetail()
  }, [address, t])

  const {
    data: fairCurveData,
    loading: fairCurveLoading,
    error: fairCurveError,
  } = useFairCurve(
    conn,
    tokenInfo?.token_address
      ? tokenInfo.token_address.trim() !== ''
        ? tokenInfo.token_address
        : undefined
      : undefined
  )

  const formattedData = fairCurveData

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const statBg = useColorModeValue('gray.50', 'gray.700')
  const softBg = useColorModeValue('gray.50', 'gray.700')

  // 使用SOL作为货币单位
  const currencyUnit = 'SOL'
  // 使用Solana网络

  // 添加状态
  const [tokenAccount, setTokenAccount] = useState<string | null>(null)
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)

  // 添加代币账户查询逻辑
  useEffect(() => {
    const checkTokenAccount = async () => {
      if (!wallet?.publicKey || !tokenInfo?.token_address) return

      try {
        const tokenMint = new PublicKey(tokenInfo.token_address)
        const tokenAccountAddress = await getAssociatedTokenAddress(
          tokenMint,
          wallet.publicKey
        )

        const account = await conn.getAccountInfo(tokenAccountAddress)

        if (account) {
          setTokenAccount(tokenAccountAddress.toString())
          const balance = await conn.getTokenAccountBalance(tokenAccountAddress)
          setTokenBalance(Number(balance.value.uiAmount))
        } else {
          setTokenAccount(null)
          setTokenBalance(null)
        }
      } catch (error) {
        console.error('查询代币账户失败:', error)
        setTokenAccount(null)
        setTokenBalance(null)
      }
    }

    checkTokenAccount()
  }, [conn, wallet?.publicKey, tokenInfo?.token_address])

  // 使用useMintingCalculations钩子处理铸造比率计算
  const { getFormattedMintRate } = useMintingCalculations({
    totalSupply: tokenInfo?.total_supply 
      ? new BigNumber(tokenInfo.total_supply)
        .div(10 ** (tokenInfo?.token_decimal || 6))
        .toFixed() 
      : '0',
    target: tokenInfo?.liquidity_amount 
      ? `${new BigNumber(tokenInfo.liquidity_amount).div(1e9).toFixed(2)} SOL` 
      : '0 SOL',
    tokenDecimals: tokenInfo?.token_decimal || 6,
    currencyUnit: currencyUnit
  })

  // 格式化铸造比率，移除千分号，与MintingTokenCard中保持一致
  const formatMintRate = () => {
    const rate = getFormattedMintRate();
    // 移除数字中的千分号（逗号）
    return rate ? rate.replace(/,/g, "") : rate;
  }

  // 格式化代币数量（除以1e6）
  const formatTokenAmount = (amount: string) => {
    // 获取代币的小数位，默认为6
    const decimal = tokenInfo?.token_decimal || 6
    return new BigNumber(amount).div(10 ** decimal).toFormat(0)
  }

  // 格式化SOL数量（除以1e9）
  const formatSolAmount = (amount: string) => {
    return new BigNumber(amount).div(1e9).toFixed(4)
  }

  // 格式化费率为百分比 (除以10000)
  const formatFeeRate = (rate: number | string) => {
    // 使用toFixed生成数字，然后转成字符串，不使用千分位分隔符
    const rateValue = new BigNumber(rate).div(10000).toFixed(2)
    return `${rateValue}%`
  }

  // 格式化合约地址（显示前12位和后16位）
  const formatContractAddress = (address: string) => {
    return address.slice(0, 12) + '...' + address.slice(-16);
  };

  // 复制合约地址到剪贴板
  const copyContractAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: t('contractCopied') || t('addressCopied'),
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  // 返回按钮组件
  const BackButton = () => (
    <Button
      as={Link}
      href="/"
      leftIcon={<FaArrowLeft />}
      variant="ghost"
      mb={{ base: 3, md: 6 }}
      size={{ base: 'sm', md: 'md' }}
      color="brand.primary"
      _hover={{ bg: 'purple.50' }}
      px={{ base: 2, md: 4 }}
      fontSize={{ base: 'sm', md: 'md' }}
    >
      {t('backToMintingHome')}
    </Button>
  )

  // 获取社交媒体链接
  const getSocials = (token: any) => {
    const links: SocialLinkDisplay[] = [];
    
    // 定义平台到图标的映射
    const platformIconMap: Record<string, IconType> = {
      website: FaGlobe,
      twitter: FaTwitter,
      telegram: FaTelegram
    };
    
    // 处理社交媒体链接
    if (token.socials && token.socials.length > 0) {
      token.socials.forEach((social: any) => {
        // 确保平台名称和链接存在
        if (!social.platform || !social.link) return;
        
        const platformName = social.platform.toLowerCase();
        
        // 只添加已知平台的链接
        if (platformIconMap[platformName]) {
          links.push({
            platform: platformName,
            link: social.link,
            icon: platformIconMap[platformName]
          });
        }
      });
    }
    
    return links;
  };

  // 添加分享状态
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // 处理分享功能
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // 构建分享URL
  const getShareUrl = () => {
    const address = tokenInfo?.token_address;
    return typeof window !== 'undefined' 
      ? `${window.location.origin}/sol/${address}` 
      : `/sol/${address}`;
  };

  // 修改SocialLinks组件中的ChakraLink为ChakraLink
  const SocialLinks = ({ token }: { token: any }) => {
    const links = getSocials(token);
    const iconColor = useColorModeValue("gray.600", "gray.400");
    const iconHoverColor = useColorModeValue("brand.primary", "brand.light");
    const bgColor = useColorModeValue("gray.50", "gray.700");
    
    console.log('Token socials:', token.socials);
    console.log('Processed social links:', links);
    
    if (links.length === 0) return null;
    
    return (
      <HStack spacing={1} mt={2} justify="center">
        {links.map((social, index) => (
          <ChakraLink 
            key={`${social.platform}-${index}`}
            href={social.link}
            isExternal
            p={1.5}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            bg={bgColor}
            color="brand.primary"
            _hover={{ bg: 'brand.light', color: 'white' }}
            transition="all 0.2s"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon as={social.icon} boxSize="14px" />
          </ChakraLink>
        ))}
        <Box
          as="button"
          p={1.5}
          borderRadius="full"
          bg={bgColor}
          color="brand.primary"
          _hover={{ bg: 'brand.light', color: 'white' }}
          transition="all 0.2s"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleShare}
        >
          <Icon as={FaShareAlt} boxSize="14px" />
        </Box>
      </HStack>
    );
  };

  if (loading || fairCurveLoading) {
    return (
      <Box
        minH="70vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={4}
      >
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          borderWidth="1px"
          borderColor={useColorModeValue('purple.100', 'purple.900')}
          maxW="md"
          w="100%"
        >
          <Text
            color="brand.primary"
            fontSize={{base: "2xl", md: "3xl"}}
            fontWeight="bold"
            mb={6}
          >
            {t('loading')}
          </Text>
          
          <LoadingSpinner 
            spinnerSize="xl" 
            spinnerColor="brand.primary"
            thickness="4px"
            speed="0.7s"
            py={6}
            textSize="md"
            textKey="loadingTokenData"
          />
        </Box>
      </Box>
    )
  }

  if (error || fairCurveError) {
    return (
      <Box
        minH="70vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={4}
      >
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          borderWidth="1px"
          borderColor={useColorModeValue('red.100', 'red.900')}
          maxW="md"
          w="100%"
        >
          <Text
            color="red.500"
            fontSize={{base: "2xl", md: "3xl"}}
            fontWeight="bold"
            mb={4}
          >
            {t('loadingError')}
          </Text>
          
          <Box mb={6}>
            <Icon
              as={FaExclamationTriangle}
              color="red.500"
              boxSize={{base: "50px", md: "70px"}}
              mb={4}
            />
            <Text color="gray.500" mb={4}>
              {error || fairCurveError}
            </Text>
          </Box>
          
          <Button
            as={Link}
            href="/"
            leftIcon={<FaArrowLeft />}
            colorScheme="purple"
            size="lg"
            width="full"
            fontWeight="bold"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            {t('backToMintingHome')}
          </Button>
        </Box>
      </Box>
    )
  }

  if (!tokenInfo || !formattedData) {
    return (
      <Box
        minH="70vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={4}
      >
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          borderWidth="1px"
          borderColor={useColorModeValue('red.100', 'red.900')}
          maxW="md"
          w="100%"
        >
          <Text
            color="red.500"
            fontSize={{base: "2xl", md: "3xl"}}
            fontWeight="bold"
            mb={4}
          >
            {t('tokenNotFound')}
          </Text>
          
          <Box mb={6}>
            <Icon
              as={FaExclamationTriangle}
              color="red.500"
              boxSize={{base: "50px", md: "70px"}}
              mb={4}
            />
            <Text color="gray.500" mb={4}>
              {t('tokenErrorHint')}
            </Text>
          </Box>
          
          <Button
            as={Link}
            href="/"
            leftIcon={<FaArrowLeft />}
            colorScheme="purple"
            size="lg"
            width="full"
            fontWeight="bold"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            {t('backToMintingHome')}
          </Button>
        </Box>
      </Box>
    )
  }

  // 在此处添加selectedToken定义，确保tokenInfo不为null
  // 转换TokenInfo为组件所需的格式
  const selectedToken = {
    id: tokenInfo.token_id,
    name: tokenInfo.token_name,
    symbol: tokenInfo.token_symbol,
    address: tokenInfo.token_address,
    tokenDecimal: tokenInfo.token_decimal || 6,
    totalSupply: new BigNumber(tokenInfo.total_supply)
      .div(10 ** (tokenInfo.token_decimal || 6))
      .toFixed(),
    progress: Number(tokenInfo.progress.toFixed(2)),
    net_volume: new BigNumber(tokenInfo.net_volume)
      .div(10 ** (tokenInfo.token_decimal || 6))
      .toNumber(),
    logo: tokenInfo.logo,
    image: tokenInfo.logo,
    target: `${new BigNumber(tokenInfo.liquidity_amount)
      .div(1e9)
      .toFixed(2)} SOL`,
    raised: `${new BigNumber(tokenInfo.net_quote_amount)
      .div(1e9)
      .toFixed(2)} SOL`,
    created_at: tokenInfo.created_at,
    minterCounts: tokenInfo.minter_counts,
    buyTransactions: tokenInfo.buy_transactions,
    sellTransactions: tokenInfo.sell_transactions,
    totalBuyAmount: new BigNumber(tokenInfo.total_buy_amount)
      .div(10 ** (tokenInfo.token_decimal || 6))
      .toNumber(),
    totalSellAmount: new BigNumber(tokenInfo.total_sell_amount)
      .div(10 ** (tokenInfo.token_decimal || 6))
      .toNumber(),
    firstTradeTime: tokenInfo.first_trade_time,
    lastTradeTime: tokenInfo.last_trade_time,
    currencyUnit: 'SOL',
    total_transactions: tokenInfo.total_transactions,
    liquidity_amount: tokenInfo.liquidity_amount,
    net_quote_amount: tokenInfo.net_quote_amount,
    // 添加社交媒体链接
    website: tokenInfo.website,
    twitter: tokenInfo.twitter,
    telegram: tokenInfo.telegram,
    socials: tokenInfo.socials || [],
  }

  // 定义分享用的哈希标签和内容
  const shareHashtags = ["PIS", "PI", "Web3", selectedToken.symbol];
  const shareContent = "";

  return (
    <Box w="100%" pb={10} overflowX="hidden">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={10} align="stretch">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
          >
            <Box>
              <Heading as="h2" size="lg" mb={2}>
                {t('tokenInfoNetwork').replace('{network}', 'Solana')}
              </Heading>
              <Text color="gray.500">{t('mintTokenCancel')}</Text>
            </Box>
            <BackButton />
          </Stack>

          <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={8}>
            <GridItem width="100%" overflow="hidden">
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody p={{ base: 3, md: 4 }}>
                  <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                    {/* 代币标题部分 - 添加logo和社交媒体链接 */}
                    <Flex direction={{ base: 'column', sm: 'row' }} align={{ base: 'center', sm: 'flex-start' }} gap={4}>
                      {/* 代币logo */}
                      <Flex direction="column" alignItems="center">
                        <Image
                          src={selectedToken.logo || '/default-token.png'}
                          alt={selectedToken.name}
                          boxSize={{ base: "80px", md: "100px" }}
                          borderRadius="2xl"
                          objectFit="cover"
                          border="2px solid"
                          borderColor="brand.light"
                          fallbackSrc="/default-token.png"
                        />
                        
                        {/* 社交媒体链接 */}
                        <SocialLinks token={selectedToken} />
                      </Flex>
                      
                      {/* 代币信息 */}
                      <VStack align={{ base: 'center', sm: 'flex-start' }} spacing={2} flex={1}>
                        <Heading as="h1" size="lg" color="brand.primary">
                          {selectedToken.symbol}
                        </Heading>
                        <Text color="gray.500" fontSize="md">
                          {selectedToken.name}
                        </Text>
                        {/* 合约地址 */}
                        <Box
                          as="button"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontFamily="mono"
                          fontWeight="bold"
                          color="brand.primary"
                          border="1px solid"
                          borderColor="brand.light"
                          title={selectedToken.address}
                          cursor="pointer"
                          width="fit-content"
                          onClick={() => copyContractAddress(selectedToken.address)}
                          bg="#F7F6FE"
                          _hover={{ bg: 'brand.light' }}
                          _active={{ bg: '#F7F6FE' }}
                          transition="all 0.2s"
                        >
                          <Icon as={FaFileContract} mr={1} fontSize="10px" />
                          {formatContractAddress(selectedToken.address)}
                        </Box>
                      </VStack>
                    </Flex>

                    <Divider />

                    {/* 进度部分 */}
                    <Box>
                      <Flex justifyContent="space-between" alignItems="center" mb={1}>
                        <Text
                          as="span"
                          fontSize="xs"
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          gap={1}
                          transition="color 0.2s"
                        >
                          {selectedToken.progress.toFixed(2)}%
                          <Text
                            as="span"
                            color="brand.primary"
                            fontSize="xs"
                            transition="color 0.2s"
                          >
                            ({selectedToken.raised})
                          </Text>
                        </Text>
                        <Text
                          as="span"
                          color="gray.500"
                          fontSize="xs"
                          transition="color 0.2s"
                        >
                          {selectedToken.target}
                        </Text>
                      </Flex>
                      <Progress
                        value={selectedToken.progress}
                        size="sm"
                        borderRadius="full"
                        mb={3}
                        bg="#E7E3FC"
                        sx={{
                          // 进度条颜色
                          '& > div:last-of-type': {
                            bg: 'brand.primary !important',
                            transition: 'width 0.5s ease-in-out',
                          },
                        }}
                      />
                    </Box>

                    {/* 统计数据部分 */}
                    <SimpleGrid columns={3} spacing={4}>
                      <Box
                        bg={statBg}
                        p={4}
                        borderRadius="lg"
                        boxShadow="sm"
                        textAlign="center"
                      >
                        <Icon
                          as={FaCoins}
                          color="green.500"
                          boxSize="24px"
                          mb={2}
                        />
                        <Text color="gray.600" fontSize="sm">
                          {t('totalSupplyColumn')}
                        </Text>
                        <Text fontWeight="bold" fontSize="xl" color="green.500">
                          {formatTokenAmount(tokenInfo.total_supply.toString())}
                        </Text>
                      </Box>

                      <Box
                        bg={statBg}
                        p={4}
                        borderRadius="lg"
                        boxShadow="sm"
                        textAlign="center"
                      >
                        <Icon
                          as={FaUsers}
                          color="blue.500"
                          boxSize="24px"
                          mb={2}
                        />
                        <Text color="gray.600" fontSize="sm">
                          {t('participantsColumn')}
                        </Text>
                        <Text fontWeight="bold" fontSize="xl" color="blue.500">
                          {selectedToken.minterCounts}
                        </Text>
                      </Box>

                      <Box
                        bg={statBg}
                        p={4}
                        borderRadius="lg"
                        boxShadow="sm"
                        textAlign="center"
                      >
                        <Icon
                          as={FaChartPie}
                          color="purple.500"
                          boxSize="24px"
                          mb={2}
                        />
                        <Text color="gray.600" fontSize="sm">
                          {t('mintableTokens')}
                        </Text>
                        <Text
                          fontWeight="bold"
                          fontSize="xl"
                          color="purple.500"
                        >
                          {formatTokenAmount(formattedData.supplied)}
                        </Text>
                      </Box>
                    </SimpleGrid>

                    <Divider />

                    {/* 代币详情部分 */}
                    <Box>
                      <Text
                        fontWeight="medium"
                        mb={3}
                        fontSize={{ base: 'sm', md: 'md' }}
                      >
                        {t('tokenInfo')}
                      </Text>
                      <SimpleGrid columns={2} spacing={4}>
                        <HStack
                          justify="space-between"
                          p={3}
                          bg={statBg}
                          borderRadius="md"
                        >
                          <Text color="gray.600" fontSize="sm">
                            {t('mintRate')}:
                          </Text>
                          <Text fontWeight="bold">
                            {formatMintRate()}
                          </Text>
                        </HStack>

                        <HStack
                          justify="space-between"
                          p={3}
                          bg={statBg}
                          borderRadius="md"
                        >
                          <Text color="gray.600" fontSize="sm">
                            {t('remaining')}:
                          </Text>
                          <Text fontWeight="bold">
                            {formatTokenAmount(formattedData.remaining)}
                          </Text>
                        </HStack>
                        
                        {/* 添加我的代币到代币信息栏 */}
                        {tokenAccount && tokenBalance !== null && (
                          <HStack
                            justify="space-between"
                            p={3}
                            bg={statBg}
                            borderRadius="md"
                          >
                            <Text color="gray.600" fontSize="sm">
                              {t('myTokenBalance')}:
                            </Text>
                            <Text fontWeight="bold">
                              {tokenBalance?.toLocaleString()}
                            </Text>
                          </HStack>
                        )}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            {/* PC端右侧区域 - 显示铸造表单和铸造说明 */}
            <GridItem
              width="100%"
              overflow="hidden"
              display={{ base: 'none', lg: 'block' }}
            >
              <VStack spacing={5} align="stretch">
                {/* 先显示铸造表单 */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody p={0} py={4} pb={0}>
                    <Stack spacing={6}>
                      <Heading size="md" textAlign="center">
                        {t('mintToken')}
                      </Heading>
                      <MintingForm
                        token={selectedToken}
                        tokenAccount={tokenAccount}
                        tokenBalance={tokenBalance}
                        onBalanceUpdate={v => {
                          setTokenBalance(v)
                        }}
                      />
                    </Stack>
                  </CardBody>
                </Card>

                {/* 然后显示铸造说明 */}
                <MintingInstructions
                  token={{
                    symbol: selectedToken.symbol,
                    mintRate: formattedData.feeRate,
                    currencyUnit: currencyUnit,
                    totalSupply: selectedToken.totalSupply,
                  }}
                />
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
      
      {/* 添加分享弹窗 */}
      {selectedToken && (
        <ShareModal 
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title={`分享 ${selectedToken.name} (${selectedToken.symbol})`}
          content={shareContent}
          url={getShareUrl()}
          tokenTicker={selectedToken.symbol}
          tokenName={selectedToken.name}
          contractAddress={selectedToken.address}
          hashtags={shareHashtags}
        />
      )}
    </Box>
  )
}

