'use client'

import { useEffect } from 'react'
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

export default function TokenMintPage() {
  const { address } = useParams()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { token: selectedToken, loading, error } = useAppSelector(
    selectTokenByAddress(address as string)
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const statBg = useColorModeValue('gray.50', 'gray.700')

  // 使用SOL作为货币单位
  const currencyUnit = 'SOL'
  // 使用Solana网络
  const network = 'Solana'

  useEffect(() => {
    // 如果 tokenList 为空，则获取列表
    dispatch(fetchTokenList())
  }, [dispatch])

  if (loading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="brand.primary" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center minH="60vh">
        <VStack spacing={4}>
          <Text color="red.500">{error}</Text>
        </VStack>
      </Center>
    )
  }

  if (!selectedToken) {
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
                        <StatNumber>{selectedToken.totalSupply}</StatNumber>
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
                        <StatNumber>{selectedToken.progress}%</StatNumber>
                        <StatHelpText>
                          <Progress
                            value={selectedToken.progress}
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
                        presaleRate: selectedToken.presaleRate || '0.000001',
                        network: network,
                        currencyUnit: currencyUnit,
                      }}
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
                      <Text fontWeight="bold">{selectedToken.presaleRate}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text color="gray.500">{t('target')}:</Text>
                      <Text fontWeight="bold">{selectedToken.target}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text color="gray.500">{t('raised')}:</Text>
                      <Text fontWeight="bold">{selectedToken.raised}</Text>
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
