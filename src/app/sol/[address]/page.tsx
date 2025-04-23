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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  Center,
  Spinner,
  Button,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectTokenByAddress, fetchTokenList } from '@/store/slices/tokenSlice'
import { useTranslation } from 'react-i18next'
import {
  FaCoins,
  FaUsers,
  FaChartPie,
  FaSync,
  FaArrowLeft,
} from 'react-icons/fa'
import MintingForm from '@/components/token-detail/MintingForm'
import { useSolana } from '@/contexts/solanaProvider'
import { useFairCurve } from '@/web3/fairMint/hooks/useFairCurve'
import { formatFairCurveState } from '@/web3/fairMint/utils/format'
import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { LoadingSpinner } from '@/components'
import { MintingInstructions } from '@/components/token-detail'

export default function TokenMintPage() {
  const { address } = useParams()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { conn, wallet } = useSolana()

  const {
    token: selectedToken,
    loading: tokenLoading,
    error: tokenError,
  } = useAppSelector(selectTokenByAddress(address as string))

  const {
    data: fairCurveData,
    loading: fairCurveLoading,
    error: fairCurveError,
  } = useFairCurve(
    conn,
    selectedToken?.address
      ? selectedToken.address.trim() !== ''
        ? selectedToken.address
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
  const network = 'SOL'

  // 添加状态
  const [tokenAccount, setTokenAccount] = useState<string | null>(null)
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)

  // 添加代币账户查询逻辑
  useEffect(() => {
    const checkTokenAccount = async () => {
      if (!wallet?.publicKey || !selectedToken?.address) return

      try {
        const tokenMint = new PublicKey(selectedToken.address)
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
  }, [conn, wallet?.publicKey, selectedToken?.address])

  // 格式化代币数量（除以1e6）
  const formatTokenAmount = (amount: string) => {
    // 获取代币的小数位，默认为6
    const decimal = selectedToken?.tokenDecimal || 6
    return new BigNumber(amount).div(10 ** decimal).toFormat(2)
  }

  // 格式化SOL数量（除以1e9）
  const formatSolAmount = (amount: string) => {
    return new BigNumber(amount).div(1e9).toFixed(4)
  }

  // 格式化费率为百分比 (除以10000)
  const formatFeeRate = (rate: number | string) => {
    return `${new BigNumber(rate).div(10000).toFixed(2)}%`
  }

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

  if (tokenLoading || fairCurveLoading) {
    return (
      <Center minH="60vh">
        <LoadingSpinner />
      </Center>
    )
  }

  if (tokenError || fairCurveError) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Text color="red.500">{tokenError || fairCurveError}</Text>
          <BackButton />
        </VStack>
      </Center>
    )
  }

  if (!selectedToken || !formattedData) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Text>{t('tokenNotFound')}</Text>
          <BackButton />
        </VStack>
      </Center>
    )
  }

  return (
    <Box bg={softBg} minH="100vh" w="100%" pb={10} overflowX="hidden">
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
                <CardBody p={{ base: 3, md: 5 }}>
                  <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                    {/* 代币标题部分 */}
                    <Box>
                      <Heading as="h1" size="lg" mb={2} color="brand.primary">
                        {selectedToken.name} ({selectedToken.symbol})
                      </Heading>
                      <Text color="gray.500">
                        {t('tokenAddress')}: {selectedToken.address}
                      </Text>
                      {tokenAccount && tokenBalance !== null && (
                        <Text color="gray.500" mt={2}>
                          {t('yourBalance')}: {tokenBalance}{' '}
                          {selectedToken.symbol}
                        </Text>
                      )}
                    </Box>

                    <Divider />

                    {/* 进度部分 */}
                    <Box>
                      <Flex
                        justify="space-between"
                        mb={1}
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        <HStack>
                          <Text color="gray.600">{t('progress')}:</Text>
                          <Text fontWeight="bold" color="brand.primary">
                            {selectedToken.progress}%
                          </Text>
                        </HStack>
                      </Flex>
                      <Progress
                        value={selectedToken.progress}
                        size="sm"
                        colorScheme="purple"
                        borderRadius="full"
                        mb={3}
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
                          {t('totalSupply')}
                        </Text>
                        <Text fontWeight="bold" fontSize="xl" color="green.500">
                          {selectedToken.totalSupply}
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
                          {t('participants')}
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
                          {t('supplied')}
                        </Text>
                        <Text
                          fontWeight="bold"
                          fontSize="xl"
                          color="purple.500"
                        >
                          {formatTokenAmount(formattedData.supplied)}{' '}
                          {selectedToken.symbol}
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
                            {formatFeeRate(formattedData.feeRate)}
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
                            {formatTokenAmount(formattedData.remaining)}{' '}
                            {selectedToken.symbol}
                          </Text>
                        </HStack>

                        <HStack
                          justify="space-between"
                          p={3}
                          bg={statBg}
                          borderRadius="md"
                        >
                          <Text color="gray.600" fontSize="sm">
                            {t('supplied')}:
                          </Text>
                          <Text fontWeight="bold">
                            {formatTokenAmount(formattedData.supplied)}{' '}
                            {selectedToken.symbol}
                          </Text>
                        </HStack>

                        <HStack
                          justify="space-between"
                          p={3}
                          bg={statBg}
                          borderRadius="md"
                        >
                          <Text color="gray.600" fontSize="sm">
                            {t('solReceived')}:
                          </Text>
                          <Text fontWeight="bold">
                            {formatSolAmount(formattedData.solReceived)} SOL
                          </Text>
                        </HStack>
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
                  <CardBody>
                    <Stack spacing={4}>
                      <Heading size="md">{t('mintToken')}</Heading>
                      <MintingForm
                        token={selectedToken}
                        tokenAccount={tokenAccount}
                        tokenBalance={tokenBalance}
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
    </Box>
  )
}
