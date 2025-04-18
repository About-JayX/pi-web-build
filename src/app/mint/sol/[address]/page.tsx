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
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { selectTokenByAddress, fetchTokenList } from '@/store/slices/tokenSlice'
import { useTranslation } from 'react-i18next'
import { FaCoins, FaUsers, FaChartPie } from 'react-icons/fa'
import MintingForm from '@/components/token-detail/MintingForm'
import { useSolana } from '@/contexts/solanaProvider'
import { useFairCurve } from '@/web3/fairMint/hooks/useFairCurve'
import { formatFairCurveState } from '@/web3/fairMint/utils/format'
import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'

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
  } = useFairCurve(conn, selectedToken?.address || '')

  const formattedData = fairCurveData
    ? formatFairCurveState(fairCurveData)
    : null

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const statBg = useColorModeValue('gray.50', 'gray.700')

  // 使用SOL作为货币单位
  const currencyUnit = 'SOL'
  // 使用Solana网络
  const network = 'Solana'

  // 添加状态
  const [tokenAccount, setTokenAccount] = useState<string | null>(null)
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)

  useEffect(() => {
    // 如果 tokenList 为空，则获取列表
    dispatch(fetchTokenList())
  }, [dispatch])

  // 添加数据监听和日志输出
  useEffect(() => {
    if (address) {
      console.log('当前地址:', address)
    }
  }, [address])

  useEffect(() => {
    console.log('Solana 连接状态:', {
      hasConnection: !!conn,
      connectionUrl: conn?.rpcEndpoint,
      selectedToken: selectedToken?.address,
    })
  }, [conn, selectedToken])

  useEffect(() => {
    if (selectedToken) {
      console.log('Token 数据:', {
        name: selectedToken.name,
        symbol: selectedToken.symbol,
        address: selectedToken.address,
        totalSupply: selectedToken.totalSupply,
        participants: selectedToken.participants,
      })
    }
  }, [selectedToken])

  useEffect(() => {
    if (fairCurveData) {
      console.log('合约状态:', {
        liquidityAdded: fairCurveData.liquidityAdded,
        feeRate: fairCurveData.feeRate,
        tokenDecimal: fairCurveData.tokenDecimal,
        solDecimal: fairCurveData.solDecimal,
        mint: fairCurveData.mint,
        remaining: fairCurveData.remaining.toString(),
        supply: fairCurveData.supply.toString(),
        supplied: fairCurveData.supplied.toString(),
        solReceived: fairCurveData.solReceived.toString(),
        liquiditySol: fairCurveData.liquiditySol.toString(),
        liquidityToken: fairCurveData.liquidityToken.toString(),
        liquiditySolFee: fairCurveData.liquiditySolFee.toString(),
        liquidityTokenFee: fairCurveData.liquidityTokenFee.toString(),
        fee: fairCurveData.fee.toString(),
      })
    }
  }, [fairCurveData])

  useEffect(() => {
    if (formattedData) {
      console.log('格式化数据:', {
        supply: formattedData.supply,
        remaining: formattedData.remaining,
        supplied: formattedData.supplied,
        solReceived: formattedData.solReceived,
        progress: formattedData.progress,
        feeRate: formattedData.feeRate,
      })
    }
  }, [formattedData])

  // 添加代币账户查询逻辑
  useEffect(() => {
    const checkTokenAccount = async () => {
      if (!conn || !wallet?.publicKey || !selectedToken?.address) return

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

  if (!conn) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Text color="red.500">{t('noConnection')}</Text>
        </VStack>
      </Center>
    )
  }

  if (tokenLoading || fairCurveLoading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="brand.primary" />
      </Center>
    )
  }

  if (tokenError || fairCurveError) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Text color="red.500">{tokenError || fairCurveError}</Text>
        </VStack>
      </Center>
    )
  }

  if (!selectedToken || !formattedData) {
    return (
      <Center minH="60vh">
        <Text>{t('tokenNotFound')}</Text>
      </Center>
    )
  }

  return (
    <Box>
      <Container maxW="container.xl" py={12}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            <VStack spacing={8} align="stretch">
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stack spacing={6}>
                    <Box>
                      <Heading as="h1" size="lg" mb={2}>
                        {selectedToken.name} ({selectedToken.symbol})
                      </Heading>
                      <Text color="gray.500">
                        {t('tokenAddress')}: {selectedToken.address}
                      </Text>
                      {tokenAccount && tokenBalance !== null && (
                        <Text color="gray.500" mt={2}>
                          {t('yourBalance')}: {tokenBalance} {selectedToken.symbol}
                        </Text>
                      )}
                    </Box>

                    <Divider />

                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                      gap={4}
                    >
                      <Stat bg={statBg} p={4} borderRadius="lg">
                        <StatLabel>
                          <HStack>
                            <Icon as={FaCoins} color="brand.primary" />
                            <Text>{t('totalSupply')}</Text>
                          </HStack>
                        </StatLabel>
                        <StatNumber>{formattedData.supply}</StatNumber>
                      </Stat>

                      <Stat bg={statBg} p={4} borderRadius="lg">
                        <StatLabel>
                          <HStack>
                            <Icon as={FaUsers} color="brand.primary" />
                            <Text>{t('participants')}</Text>
                          </HStack>
                        </StatLabel>
                        <StatNumber>{selectedToken.participants}</StatNumber>
                      </Stat>

                      <Stat bg={statBg} p={4} borderRadius="lg">
                        <StatLabel>
                          <HStack>
                            <Icon as={FaChartPie} color="brand.primary" />
                            <Text>{t('progress')}</Text>
                          </HStack>
                        </StatLabel>
                        <StatNumber>{formattedData.progress}%</StatNumber>
                        <StatHelpText>
                          <Progress
                            value={formattedData.progress}
                            size="sm"
                            colorScheme="purple"
                            borderRadius="full"
                          />
                        </StatHelpText>
                      </Stat>
                    </Grid>
                  </Stack>
                </CardBody>
              </Card>

              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <Stack spacing={4}>
                    <Heading size="md">{t('mintToken')}</Heading>
                    <MintingForm
                      token={{
                        symbol: selectedToken.symbol,
                        presaleRate: formattedData.feeRate,
                        network,
                        currencyUnit,
                        address: selectedToken.address,
                      }}
                      tokenAccount={tokenAccount}
                      tokenBalance={tokenBalance}
                    />
                  </Stack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          <GridItem>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stack spacing={4}>
                  <Heading size="md">{t('tokenInfo')}</Heading>
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <Text color="gray.500">{t('presaleRate')}:</Text>
                      <Text fontWeight="bold">{formattedData.feeRate}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text color="gray.500">{t('remaining')}:</Text>
                      <Text fontWeight="bold">{formattedData.remaining}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text color="gray.500">{t('supplied')}:</Text>
                      <Text fontWeight="bold">{formattedData.supplied}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text color="gray.500">{t('solReceived')}:</Text>
                      <Text fontWeight="bold">
                        {formattedData.solReceived} SOL
                      </Text>
                    </HStack>
                  </VStack>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}
