'use client'

import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  useColorModeValue,
  SimpleGrid,
  VStack,
  HStack,
  StackDivider,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Circle,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import {
  FaRocket,
  FaChartLine,
  FaLayerGroup,
  FaGlobe,
  FaTwitter,
  FaTelegram,
  FaShareAlt,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaFileContract,
} from 'react-icons/fa'
import { useNetwork } from '@/contexts/NetworkContext'
import MintingTokenCard from '@/components/MintingTokenCard'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { TokenAPI, type PlatformMetrics } from '@/api/token'
import type { Token } from '@/api/token'
import BigNumber from 'bignumber.js'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { marketTokens } from '@/mock'

// 功能特点组件
interface FeatureProps {
  text: string
  iconBg: string
  icon?: React.ReactElement
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex
        w={8}
        h={8}
        align={'center'}
        justify={'center'}
        rounded={'full'}
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  )
}

// 在文件顶部添加类型定义
interface TokenShare {
  token: Token
  share: number
}

export default function HomePage() {
  const { network } = useNetwork()
  const { t } = useTranslation()
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null)

  // 获取平台数据
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await TokenAPI.getPlatformMetrics()
        setMetrics(data)
      } catch (error) {
        console.error('Failed to fetch platform data:', error)
      }
    }

    fetchMetrics()
    // 每60秒更新一次数据
    const intervalId = setInterval(fetchMetrics, 60000)

    return () => clearInterval(intervalId)
  }, [])

  // 移动 useColorModeValue 调用到组件顶部
  const iconColor = useColorModeValue('gray.600', 'gray.400')
  const iconHoverColor = useColorModeValue('brand.primary', 'brand.light')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  // 铸造代币数据
  const [mintingData, setMintingData] = useState<any[]>([])
  
  // 获取铸造代币数据
  useEffect(() => {
    const fetchMintingData = async () => {
      try {
        // 使用 store.dispatch 获取铸造代币列表，类似于 page.tsx 中的方法
        // 或者使用空数组代替，避免报错
        setMintingData([])
      } catch (error) {
        console.error('Failed to fetch mint token data:', error)
        setMintingData([])
      }
    }
    
    fetchMintingData()
  }, [])

  // 修改handleShare的类型
  const handleShare = (token: any) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${token.name} (${token.symbol})`,
          text: `${t('share')} ${token.name} ${t('token')}`,
          url: window.location.origin + `/${token.address}`,
        })
        .catch(error => console.log(`${t('share')} ${t('failed')}:`, error))
    } else {
      const url = window.location.origin + `/${token.address}`
      navigator.clipboard
        .writeText(url)
        .then(() => alert(`${t('copySuccess')}`))
        .catch(error => console.log(`${t('copy')} ${t('failed')}:`, error))
    }
  }

  return (
    <Box>
      {/* Hero区域 */}
      <Container maxW={'container.xl'}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          pt={{ base: 10, md: 20 }}
          direction={{ base: 'column', lg: 'row' }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 5, xl: 6 }}>
            <Heading
              lineHeight={1.16}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '5xl', xl: '6xl' }}
            >
              <Text
                as={'span'}
                position={'relative'}
                display="block"
                color={'brand.primary'}
                bgGradient="linear(to-r, purple.600, brand.primary, purple.400)"
                bgClip="text"
                fontWeight="900"
                letterSpacing="wide"
              >
                {t('heroTitlePart1')}
              </Text>
              <Text
                as={'span'}
                position={'relative'}
                display="block"
                color={'brand.secondary'}
                bgGradient="linear(to-r, gold.400, brand.secondary, gold.500)"
                bgClip="text"
                fontWeight="900"
                letterSpacing="wide"
                whiteSpace="nowrap"
              >
                {t('heroTitlePiNetwork')}
                {t('heroTitlePart2')}
              </Text>
              <Text
                as={'span'}
                position={'relative'}
                display="block"
                color={'brand.primary'}
                bgGradient="linear(to-r, purple.600, brand.primary, purple.400)"
                bgClip="text"
                fontWeight="900"
                letterSpacing="wide"
              >
                {t('heroTitlePart3')}
              </Text>
            </Heading>
            <Text
              color={'gray.500'}
              fontSize={{ base: 'md', md: 'md', xl: 'lg' }}
            >
              {t('heroDescription')}
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                as={NextLink}
                href="/"
                colorScheme="purple"
                variant="solid"
                bg="brand.primary"
                size={{ base: 'md', md: 'lg' }}
                px={{ base: 6, md: 8 }}
                _hover={{ bg: 'brand.light' }}
                rightIcon={<ChevronRightIcon />}
              >
                {t('heroButtonExplore')}
              </Button>
              <Button
                as={NextLink}
                href="/market"
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                leftIcon={<FaChartLine />}
              >
                {t('tokenMarket')}
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
          >
            <Box
              position={'relative'}
              height={'300px'}
              rounded={'2xl'}
              boxShadow={'2xl'}
              width={'full'}
              overflow={'hidden'}
              as={NextLink}
              href="/"
              cursor="pointer"
              transition="transform 0.3s ease-in-out"
              _hover={{
                transform: 'scale(1.02)',
                boxShadow: '3xl',
              }}
              bg="brand.primary"
              backgroundImage="linear-gradient(135deg, #7B2CBF 0%, #5A189A 100%)"
            >
              {/* 装饰性元素 */}
              <Box
                position="absolute"
                top="20px"
                right="20px"
                width="120px"
                height="120px"
                borderRadius="full"
                bg="rgba(230, 179, 37, 0.2)"
              />
              <Box
                position="absolute"
                bottom="-30px"
                left="10%"
                width="80px"
                height="80px"
                borderRadius="full"
                bg="rgba(230, 179, 37, 0.15)"
              />

              {/* 主要内容 */}
              <Flex
                position="relative"
                direction="column"
                justify="center"
                align="center"
                height="100%"
                px={8}
                zIndex={2}
              >
                <Text
                  lineHeight={1.6}
                  fontSize={{ base: '2xl', md: '4xl', xl: '5xl' }}
                  fontWeight="900"
                  letterSpacing="wider"
                  textAlign="center"
                  mb={4}
                  bgGradient="linear(to-r, brand.secondary, yellow.300, brand.secondary)"
                  bgClip="text"
                  textShadow="0 2px 4px rgba(0,0,0,0.1)"
                >
                  {t('mintMemeTokens')}
                </Text>
                <Text
                  fontSize={{ base: 'md', md: 'xl' }}
                  fontWeight="medium"
                  color="white"
                  textAlign="center"
                  maxW="container.md"
                  mb={8}
                  textShadow="0 1px 2px rgba(0,0,0,0.2)"
                >
                  {t('mintDescription')}
                </Text>

                <HStack spacing={{ base: 2, md: 4 }} mt={{ base: 1, md: 6 }}>
                  <Icon as={FaRocket} color="brand.secondary" w={6} h={6} />
                  <Text
                    color="whiteAlpha.900"
                    fontWeight="bold"
                    fontSize={{ base: 'md', md: 'lg' }}
                    textAlign="center"
                  >
                    {t('viewMintingTokens')}
                  </Text>
                  <Icon as={FaRocket} color="brand.secondary" w={6} h={6} />
                </HStack>
              </Flex>

              {/* 底部装饰 */}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                height="6px"
                bg="brand.secondary"
              />
            </Box>
          </Flex>
        </Stack>
      </Container>

      {/* 平台统计 */}
      <Box bg={useColorModeValue('brand.50', 'gray.700')} py={10}>
        <Container maxW={'container.xl'}>
          <Heading as="h2" size="lg" mb={8} textAlign="center">
            {t('platformData')}
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, lg: 8 }}>
            <Box
              px={{ base: 4, md: 6 }}
              py={6}
              shadow={'xl'}
              borderRadius={'xl'}
              bgGradient={useColorModeValue(
                'linear(to-br, white, blue.50)',
                'linear(to-br, gray.800, blue.900)'
              )}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                bgGradient: 'linear(to-r, blue.400, teal.400)',
              }}
            >
              <Flex mb={4} justify="center">
                <Icon
                  as={FaLayerGroup}
                  boxSize={{ base: 10, md: 12 }}
                  color="blue.400"
                />
              </Flex>
              <Text
                fontWeight="bold"
                fontSize={{ base: 'md', md: 'lg' }}
                textAlign="center"
                mb={1}
              >
                {t('totalMintedTokens')}
              </Text>
              <Text
                fontSize={{ base: 'xl', lg: '3xl' }}
                fontWeight="bold"
                textAlign="center"
                color={useColorModeValue('blue.600', 'blue.300')}
              >
                {metrics?.token_count || 0}
              </Text>
            </Box>
            <Box
              px={{ base: 4, md: 6 }}
              py={6}
              shadow={'xl'}
              borderRadius={'xl'}
              bgGradient={useColorModeValue(
                'linear(to-br, white, green.50)',
                'linear(to-br, gray.800, green.900)'
              )}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                bgGradient: 'linear(to-r, green.400, teal.400)',
              }}
            >
              <Flex mb={4} justify="center">
                <Icon
                  as={FaChartLine}
                  boxSize={{ base: 10, md: 12 }}
                  color="green.400"
                />
              </Flex>
              <Text
                fontWeight="bold"
                fontSize={{ base: 'md', md: 'lg' }}
                textAlign="center"
                mb={1}
              >
                {t('铸造代币总数')}
              </Text>
              <Text
                fontSize={{ base: 'xl', lg: '3xl' }}
                fontWeight="bold"
                textAlign="center"
                color={useColorModeValue('green.600', 'green.300')}
              >
                {metrics?.total_mint
                  ? new BigNumber(metrics.total_mint).div(1e9).toFormat(3) +
                    ' SOL'
                  : '0.000 SOL'}
              </Text>
            </Box>
            <Box
              px={{ base: 4, md: 6 }}
              py={6}
              shadow={'xl'}
              borderRadius={'xl'}
              bgGradient={useColorModeValue(
                'linear(to-br, white, purple.50)',
                'linear(to-br, gray.800, purple.900)'
              )}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                bgGradient: 'linear(to-r, purple.400, pink.400)',
              }}
            >
              <Flex mb={4} justify="center">
                <Icon
                  as={FaUsers}
                  boxSize={{ base: 10, md: 12 }}
                  color="purple.400"
                />
              </Flex>
              <Text
                fontWeight="bold"
                fontSize={{ base: 'md', md: 'lg' }}
                textAlign="center"
                mb={1}
              >
                {t('铸造地址总数')}
              </Text>
              <Text
                fontSize={{ base: 'xl', lg: '3xl' }}
                fontWeight="bold"
                textAlign="center"
                color={useColorModeValue('purple.600', 'purple.300')}
              >
                {metrics?.mint_accounts.toLocaleString() || 0}
              </Text>
            </Box>
            <Box
              px={{ base: 4, md: 6 }}
              py={6}
              shadow={'xl'}
              borderRadius={'xl'}
              bgGradient={useColorModeValue(
                'linear(to-br, white, orange.50)',
                'linear(to-br, gray.800, orange.900)'
              )}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '8px',
                bgGradient: 'linear(to-r, orange.400, red.400)',
              }}
            >
              <Flex mb={4} justify="center">
                <Icon
                  as={FaFileContract}
                  boxSize={{ base: 10, md: 12 }}
                  color="orange.400"
                />
              </Flex>
              <Text
                fontWeight="bold"
                fontSize={{ base: 'md', md: 'lg' }}
                textAlign="center"
                mb={1}
              >
                {t('锁仓总价值')}
              </Text>
              <Text
                fontSize={{ base: 'xl', lg: '3xl' }}
                fontWeight="bold"
                textAlign="center"
                color={useColorModeValue('orange.600', 'orange.300')}
              >
                {metrics?.tvl.toLocaleString() || 0} SOL
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 热门铸造 */}
      <Container maxW={'container.xl'} py={10}>
        <Heading as="h2" size="lg" mb={2}>
          {t('hotMinting')}
        </Heading>
        <Text color={'gray.500'} mb={8}>
          {t('discoverHotProjects')}
        </Text>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={{ base: 6, md: 5, lg: 4 }}
        >
          {mintingData
            .filter(token => token.progress < 100)
            .filter(token => token.participants > 200 && token.progress > 60)
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 4)
            .map(token => {
              return (
                <MintingTokenCard
                  key={token.id}
                  token={token}
                  currencyUnit={network === 'SOL' ? 'SOL' : 'PI'}
                />
              )
            })}
        </SimpleGrid>

        <Box textAlign="center" mt={10}>
          <Button
            as={NextLink}
            href="/"
            size="lg"
            variant="outline"
            colorScheme="brand"
          >
            {t('moreMintingProjects')}
          </Button>
        </Box>
      </Container>

      {/* 功能特点 */}
      <Box
        py={10}
        bg={useColorModeValue('gray.50', 'gray.700')}
        position="relative"
      >
        <Container maxW={'container.xl'} position="relative">
          <VStack spacing={4} mb={10}>
            <Heading as="h2" size="xl" textAlign="center" color="brand.primary">
              {t('platformFeatures')}
            </Heading>
            <Text
              color={useColorModeValue('gray.600', 'gray.400')}
              maxW="container.md"
              textAlign="center"
              fontSize="lg"
            >
              {t('platformFeaturesDesc')}
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 16, md: 8 }}
          >
            <Box
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="xl"
              boxShadow="none"
              overflow="visible"
              position="relative"
              pt="38px"
              pb={6}
              px={6}
            >
              {/* 卡片顶部装饰 */}
              <Box
                w="full"
                h="8px"
                bg="brand.primary"
                position="absolute"
                top="0"
                left="0"
                borderTopLeftRadius="xl"
                borderTopRightRadius="xl"
              />

              {/* 圆形图标 */}
              <Circle
                size="76px"
                bg="brand.primary"
                position="absolute"
                top="-38px"
                left="50%"
                transform="translateX(-50%)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 4px 10px rgba(0,0,0,0.1)"
                border="4px solid white"
                _dark={{
                  border: '4px solid gray.800',
                }}
              >
                <Icon as={FaRocket} color="white" boxSize={6} />
              </Circle>

              {/* 内容部分 */}
              <VStack spacing={3} align="center">
                <Heading
                  fontSize={{ base: 'lg', lg: 'xl' }}
                  fontWeight="bold"
                  color="brand.primary"
                >
                  {t('easyMinting')}
                </Heading>
                <Text
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontSize="md"
                  textAlign="center"
                >
                  {t('easyMintingDesc')}
                </Text>
              </VStack>
            </Box>

            <Box
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="xl"
              boxShadow="none"
              overflow="visible"
              position="relative"
              pt="38px"
              pb={6}
              px={6}
            >
              {/* 卡片顶部装饰 */}
              <Box
                w="full"
                h="8px"
                bg="teal.500"
                position="absolute"
                top="0"
                left="0"
                borderTopLeftRadius="xl"
                borderTopRightRadius="xl"
              />

              {/* 圆形图标 */}
              <Circle
                size="76px"
                bg="teal.500"
                position="absolute"
                top="-38px"
                left="50%"
                transform="translateX(-50%)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 4px 10px rgba(0,0,0,0.1)"
                border="4px solid white"
                _dark={{
                  border: '4px solid gray.800',
                }}
              >
                <Icon as={FaChartLine} color="white" boxSize={6} />
              </Circle>

              {/* 内容部分 */}
              <VStack spacing={3} align="center">
                <Heading
                  fontSize={{ base: 'lg', lg: 'xl' }}
                  fontWeight="bold"
                  color="teal.500"
                >
                  {t('safeTransparent')}
                </Heading>
                <Text
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontSize="md"
                  textAlign="center"
                >
                  {t('safeTransparentDesc')}
                </Text>
              </VStack>
            </Box>

            <Box
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="xl"
              boxShadow="none"
              overflow="visible"
              position="relative"
              pt="38px"
              pb={6}
              px={6}
            >
              {/* 卡片顶部装饰 */}
              <Box
                w="full"
                h="8px"
                bg="orange.500"
                position="absolute"
                top="0"
                left="0"
                borderTopLeftRadius="xl"
                borderTopRightRadius="xl"
              />

              {/* 圆形图标 */}
              <Circle
                size="76px"
                bg="orange.500"
                position="absolute"
                top="-38px"
                left="50%"
                transform="translateX(-50%)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                boxShadow="0 4px 10px rgba(0,0,0,0.1)"
                border="4px solid white"
                _dark={{
                  border: '4px solid gray.800',
                }}
              >
                <Icon as={FaLayerGroup} color="white" boxSize={6} />
              </Circle>

              {/* 内容部分 */}
              <VStack spacing={3} align="center">
                <Heading
                  fontSize={{ base: 'lg', lg: 'xl' }}
                  fontWeight="bold"
                  color="orange.500"
                >
                  {t('tokenMarketplace')}
                </Heading>
                <Text
                  color={useColorModeValue('gray.600', 'gray.300')}
                  fontSize="md"
                  textAlign="center"
                >
                  {t('tokenMarketplaceDesc')}
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 功能特点部分 */}
      <Box bg={useColorModeValue('brand.background', 'gray.700')}>
        <Container maxW={'container.xl'} py={12}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Stack spacing={4}>
              <Heading color={'brand.primary'}>{t('startMemeProject')}</Heading>
              <Text color={'gray.500'} fontSize={'lg'}>
                {t('startMemeProjectDesc')}
              </Text>
              <Stack
                spacing={4}
                divider={
                  <StackDivider
                    borderColor={useColorModeValue('gray.100', 'gray.700')}
                  />
                }
              >
                <Feature
                  icon={<Icon as={FaRocket} color={'yellow.500'} w={4} h={4} />}
                  iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                  text={t('quickDeploy')}
                />
                <Feature
                  icon={
                    <Icon as={FaLayerGroup} color={'green.500'} w={5} h={5} />
                  }
                  iconBg={useColorModeValue('green.100', 'green.900')}
                  text={t('easySettings')}
                />
                <Feature
                  icon={
                    <Icon as={FaChartLine} color={'purple.500'} w={5} h={5} />
                  }
                  iconBg={useColorModeValue('purple.100', 'purple.900')}
                  text={t('instantTrade')}
                />
              </Stack>
            </Stack>
            <Flex>
              <Box
                rounded={'md'}
                overflow="hidden"
                position="relative"
                boxShadow="xl"
                width="100%"
                height="100%"
                minHeight="300px"
                bg="brand.primary"
                backgroundImage="linear-gradient(135deg, #7B2CBF 0%, #5A189A 100%)"
              >
                {/* 装饰性元素 */}
                <Box
                  position="absolute"
                  top="10%"
                  right="10%"
                  width="100px"
                  height="100px"
                  borderRadius="full"
                  bg="rgba(230, 179, 37, 0.2)"
                />
                <Box
                  position="absolute"
                  bottom="10%"
                  left="10%"
                  width="70px"
                  height="70px"
                  borderRadius="full"
                  bg="rgba(230, 179, 37, 0.15)"
                />

                {/* 中心Logo */}
                <Flex
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                  p={6}
                >
                  <Heading
                    fontSize="6xl"
                    fontWeight="900"
                    bgGradient="linear(to-r, brand.secondary, yellow.300, brand.secondary)"
                    bgClip="text"
                    textShadow="0 2px 4px rgba(0,0,0,0.1)"
                    mb={4}
                  >
                    Pi.Sale
                  </Heading>
                  <Text
                    color="white"
                    fontSize="xl"
                    fontWeight="medium"
                    textAlign="center"
                  >
                    {t('unleashCreativity')}
                  </Text>
                </Flex>

                {/* 底部装饰 */}
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  height="6px"
                  bg="brand.secondary"
                />
              </Box>
            </Flex>
          </SimpleGrid>
        </Container>
      </Box>

      {/* 市场热门 */}
      <Container maxW={'container.xl'} py={12}>
        <VStack spacing={2} textAlign="center" mb={10}>
          <Heading as="h2" size="xl" color={'brand.primary'}>
            {t('marketHot')}
          </Heading>
          <Text color={'gray.500'}>{t('marketHotDesc')}</Text>
        </VStack>

        <Box
          boxShadow="none"
          borderRadius="lg"
          overflow="hidden"
          bg={useColorModeValue('white', 'gray.800')}
          mb={6}
        >
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottom="2px"
                    borderColor="brand.primary"
                  >
                    {t('tokenColumn')}
                  </Th>
                  <Th
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottom="2px"
                    borderColor="brand.primary"
                    isNumeric
                    textAlign="right"
                  >
                    {t('priceColumn')}
                  </Th>
                  <Th
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottom="2px"
                    borderColor="brand.primary"
                    isNumeric
                    textAlign="right"
                  >
                    {t('change24hColumn')}
                  </Th>
                  <Th
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottom="2px"
                    borderColor="brand.primary"
                    isNumeric
                    textAlign="right"
                  >
                    {t('marketCapColumn')}
                  </Th>
                  <Th
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottom="2px"
                    borderColor="brand.primary"
                    isNumeric
                    textAlign="right"
                  >
                    {t('totalSupplyColumn')}
                  </Th>
                  <Th
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottom="2px"
                    borderColor="brand.primary"
                    isNumeric
                    textAlign="right"
                  >
                    {t('volumeColumn')}
                  </Th>
                  <Th
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottom="2px"
                    borderColor="brand.primary"
                    isNumeric
                    textAlign="right"
                  >
                    {t('linksColumn')}
                  </Th>
                  <Th
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderBottom="2px"
                    borderColor="brand.primary"
                  ></Th>
                </Tr>
              </Thead>
              <Tbody>
                {marketTokens
                  .filter(token => {
                    const marketCapValue = parseFloat(
                      token.marketCap.replace(/,/g, '')
                    )
                    return marketCapValue > 50000
                  })
                  .sort((a, b) => {
                    const volumeA = parseFloat(a.volume24h.replace(/,/g, ''))
                    const volumeB = parseFloat(b.volume24h.replace(/,/g, ''))
                    return volumeB - volumeA
                  })
                  .slice(0, 5)
                  .map(token => {
                    const isPositiveChange = token.change24hValue > 0

                    return (
                      <Tr
                        key={token.id}
                        _hover={{ bg: hoverBg }}
                        transition="background-color 0.2s"
                      >
                        <Td>
                          <HStack spacing={2} align="center">
                            <Image
                              src={token.image}
                              alt={token.name}
                              boxSize="40px"
                              borderRadius="full"
                              objectFit="cover"
                              border="2px solid"
                              borderColor="brand.light"
                            />
                            <Box>
                              <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color="brand.primary"
                                lineHeight="1.2"
                              >
                                {token.symbol}
                              </Text>
                              <Text
                                fontSize="xs"
                                color="gray.500"
                                mt={0.5}
                                noOfLines={1}
                                maxW="150px"
                              >
                                {token.name}
                              </Text>
                            </Box>
                          </HStack>
                        </Td>
                        <Td isNumeric fontWeight="bold">
                          $ {token.price}
                        </Td>
                        <Td isNumeric>
                          <Flex justify="flex-end">
                            <Text
                              fontWeight="bold"
                              color={isPositiveChange ? 'green.500' : 'red.500'}
                            >
                              <Icon
                                as={isPositiveChange ? FaArrowUp : FaArrowDown}
                                boxSize="12px"
                                mr={1}
                              />
                              {Math.abs(token.change24hValue)}%
                            </Text>
                          </Flex>
                        </Td>
                        <Td isNumeric>$ {token.marketCap}</Td>
                        <Td isNumeric>{token.totalSupply}</Td>
                        <Td isNumeric>$ {token.volume24h}</Td>
                        <Td isNumeric>
                          <HStack spacing={3} justify="flex-end">
                            {token.website && (
                              <Box
                                as="a"
                                href={token.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                color={iconColor}
                                _hover={{ color: iconHoverColor }}
                                transition="color 0.2s"
                              >
                                <Icon as={FaGlobe} boxSize="16px" />
                              </Box>
                            )}
                            {token.twitter && (
                              <Box
                                as="a"
                                href={token.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                color={iconColor}
                                _hover={{ color: iconHoverColor }}
                                transition="color 0.2s"
                              >
                                <Icon as={FaTwitter} boxSize="16px" />
                              </Box>
                            )}
                            {token.telegram && (
                              <Box
                                as="a"
                                href={token.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                color={iconColor}
                                _hover={{ color: iconHoverColor }}
                                transition="color 0.2s"
                              >
                                <Icon as={FaTelegram} boxSize="16px" />
                              </Box>
                            )}
                            <Box
                              as="button"
                              onClick={() => handleShare(token)}
                              color={iconColor}
                              _hover={{ color: iconHoverColor }}
                              transition="color 0.2s"
                            >
                              <Icon as={FaShareAlt} boxSize="16px" />
                            </Box>
                          </HStack>
                        </Td>
                        <Td>
                          <Button
                            as={NextLink}
                            href={`/market/${token.id}`}
                            colorScheme="purple"
                            size="sm"
                            bg="brand.primary"
                            _hover={{ bg: 'brand.light' }}
                          >
                            {t('detail')}
                          </Button>
                        </Td>
                      </Tr>
                    )
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Box textAlign="center" mt={8}>
          <Button
            as={NextLink}
            href="/market"
            rounded={'full'}
            size={'lg'}
            fontWeight={'normal'}
            colorScheme={'purple'}
            bg={'brand.primary'}
            _hover={{ bg: 'brand.light' }}
            px={6}
          >
            {t('tokenMarket')}
          </Button>
        </Box>
      </Container>

      {/* 行动召唤部分 */}
      <Box bg={useColorModeValue('brand.primaryGradient', 'gray.900')}>
        <Container maxW={'container.xl'} py={16}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={'center'}
            justify={'space-between'}
          >
            <Stack spacing={4} mb={{ base: 8, md: 0 }} maxW={{ md: '50%' }}>
              <Heading color={'white'} size={'lg'}>
                {t('readyToDeployQuestion')}
              </Heading>
              <Text color={'whiteAlpha.800'}>{t('readyToDeployDesc')}</Text>
            </Stack>
            <Button
              as={NextLink}
              href="/"
              rounded={'full'}
              size={'lg'}
              bg={'brand.secondary'}
              color={'white'}
              px={8}
              _hover={{ bg: 'yellow.400' }}
              rightIcon={<Icon as={FaRocket} />}
            >
              {t('startDeploy')}
            </Button>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
