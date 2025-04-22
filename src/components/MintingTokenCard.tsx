/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import {
  Box,
  Stack,
  HStack,
  Text,
  Card,
  CardBody,
  Progress,
  Divider,
  Button,
  useColorModeValue,
  Icon,
  Image,
  useToast,
} from '@chakra-ui/react'
import {
  FaGlobe,
  FaTwitter,
  FaTelegram,
  FaShareAlt,
  FaFileContract,
} from 'react-icons/fa'
import NextLink from 'next/link'
import { useTranslation } from 'react-i18next'
import { formatTokenAmount } from '@/utils'
import { useMemo } from 'react'
import { useMintingCalculations } from '@/hooks/useMintingCalculations'

interface MintingTokenCardProps {
  token: {
    id: number
    name: string
    symbol: string
    image: string
    target: string
    raised: string
    progress: number
    participants: number
    totalSupply: string
    minterCounts: number
    presaleRate?: string
    tokenDecimal?: number
    address?: string
    website?: string
    twitter?: string
    telegram?: string
  }
  currencyUnit?: string
}

export default function MintingTokenCard({
  token,
  currencyUnit = 'SOL',
}: MintingTokenCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const iconColor = useColorModeValue('gray.600', 'gray.400')
  const iconHoverColor = useColorModeValue('brand.primary', 'brand.light')
  const toast = useToast()
  const { t } = useTranslation()

  // 使用自定义Hook处理铸造计算
  const { getFormattedExchangeRate } = useMintingCalculations({
    totalSupply: token.totalSupply,
    target: token.target,
    presaleRate: token.presaleRate,
    currencyUnit,
    tokenDecimals: token.tokenDecimal || 6  // 从token对象获取小数位，默认为6
  });

  // 缩略显示合约地址
  const formatContractAddress = (address: string) => {
    if (!address) return ''
    const start = address.substring(0, 6)
    const end = address.substring(address.length - 4)
    return `${start}...${end}`
  }

  // 格式化总供应量，以便在有限空间显示
  const formatSupply = (supply: string) => {
    // 第一性原理：总供应量在tokenSlice中已经被除以10^tokenDecimal，这里仅进行格式化
    // 适当缩写大数字，如显示为：314M，1B等
    return formatTokenAmount(supply, { 
      abbreviate: true, 
      decimals: 2
    })
  }

  // 获取铸造金额，确保只有在target存在时才返回值
  const getMintAmount = () => {
    if (!token.target) return 0;
    const targetMatch = token.target.match(/[0-9.]+/);
    if (!targetMatch) return 0;
    return parseFloat(targetMatch[0]);
  }

  // 分享功能处理
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${token.name} (${token.symbol})`,
          text: `${t('share')} ${token.name} ${t('token')}`,
          url: window.location.origin + `/${token.address}`,
        })
        .catch(error => console.log(`${t('share')} ${t('failed')}:`, error))
    } else {
      // 如果浏览器不支持，可以复制链接到剪贴板
      const url = window.location.origin + `/${token.address}`
      navigator.clipboard
        .writeText(url)
        .then(() =>
          toast({
            title: t('copySuccess'),
            description: t('copyLinkSuccess'),
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
          })
        )
        .catch(error => console.log(`${t('copy')} ${t('failed')}:`, error))
    }
  }

  // 复制合约地址
  const copyContractAddress = () => {
    if (token.address) {
      navigator.clipboard
        .writeText(token.address)
        .then(() =>
          toast({
            title: t('copySuccess'),
            description: t('copyAddressSuccess'),
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
          })
        )
        .catch(err => console.error(`${t('copy')} ${t('failed')}:`, err))
    }
  }

  return (
    <Card
      bg={cardBg}
      boxShadow="none"
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
      position="relative"
    >
      <CardBody p={{ base: 1, md: 0, xl: 4 }}>
        <Stack spacing={3}>
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

          <Stack spacing={{ base: 1.5, xl: 2 }}>
            <HStack justify="space-between">
              <Text fontSize="xs" color={textColor}>
                {t('mintingAmount')}
              </Text>
              <Text fontWeight="bold" fontSize="sm">
                {token.target}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="xs" color={textColor}>
                {t('raisedAmount')}
              </Text>
              <Text fontWeight="bold" fontSize="sm" color="brand.primary">
                {token.raised}
              </Text>
            </HStack>

            <Box py={1}>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" color={textColor}>
                  {t('progress')}
                </Text>
                <Text fontSize="xs" fontWeight="bold">
                  {token.progress || 0}%
                </Text>
              </HStack>
              <Progress
                value={token.progress || 0}
                colorScheme="purple"
                borderRadius="full"
                size="sm"
              />
            </Box>

            <Divider />

            <HStack justify="space-between">
              <Text fontSize="xs" color={textColor}>
                {t('participants')}
              </Text>
              <Text fontWeight="bold" fontSize="sm">
                {token.minterCounts}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontSize="xs" color={textColor}>
                {t('totalSupply')}
              </Text>
              <Text fontWeight="bold" fontSize="sm">
                {formatSupply(token.totalSupply)}
              </Text>
            </HStack>

            {/* 铸造价格显示 */}
            <HStack justify="space-between">
              <Text fontSize="xs" color={textColor}>
                {t('mintingPrice')}
              </Text>
              <Text fontWeight="bold" fontSize="sm">
                {token.presaleRate || getFormattedExchangeRate()}
              </Text>
            </HStack>

            {token.address && (
              <HStack justify="space-between">
                <Text fontSize="xs" color={textColor}>
                  {t('contractAddress')}
                </Text>
                <Box
                  as="button"
                  onClick={copyContractAddress}
                  display="flex"
                  alignItems="center"
                  fontSize="xs"
                  fontWeight="medium"
                  fontFamily="mono"
                  color="brand.primary"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  px={2}
                  py={0.5}
                  _hover={{
                    bg: 'gray.100',
                    borderColor: 'brand.primary',
                  }}
                  transition="all 0.2s"
                  title={t('copyAddressSuccess')}
                >
                  <Icon as={FaFileContract} mr={1} fontSize="10px" />
                  {formatContractAddress(token.address)}
                </Box>
              </HStack>
            )}
          </Stack>

          <Button
            as={NextLink}
            href={`/${token.address}`}
            colorScheme="purple"
            bg="brand.primary"
            _hover={{ bg: 'brand.light' }}
            size="sm"
            borderRadius="md"
            mt={1}
          >
            {t('joinMinting')}
          </Button>

          {/* 社交媒体链接和分享按钮 */}
          <HStack justify="space-between" mt={1}>
            <HStack spacing={3}>
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
            </HStack>
            <Box
              as="button"
              onClick={handleShare}
              color={iconColor}
              _hover={{ color: iconHoverColor }}
              transition="color 0.2s"
            >
              <Icon as={FaShareAlt} boxSize="16px" />
            </Box>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  )
}
