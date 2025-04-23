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
  FaHammer,
  FaUsers,
  FaCoins,
  FaExchangeAlt,
} from 'react-icons/fa'
import NextLink from 'next/link'
import { useTranslation } from 'react-i18next'
import { formatTokenAmount } from '@/utils'
import { useMemo } from 'react'
import { useMintingCalculations } from '@/hooks/useMintingCalculations'
import { useNetwork } from '@/contexts/NetworkContext'

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
    mintRate?: string
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
  const { network } = useNetwork()

  // 使用自定义Hook处理铸造计算
  const { getFormattedMintRate } = useMintingCalculations({
    totalSupply: token.totalSupply,
    target: token.target,
    mintRate: token.mintRate,
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
          url: window.location.origin + `/${network.toLowerCase()}/${token.address}`,
        })
        .catch(error => console.log(`${t('share')} ${t('failed')}:`, error))
    } else {
      // 如果浏览器不支持，可以复制链接到剪贴板
      const url = window.location.origin + `/${network.toLowerCase()}/${token.address}`
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

  // 格式化铸造比率，移除千分号
  const formatMintRate = () => {
    const rate = token.mintRate || getFormattedMintRate();
    // 移除数字中的千分号（逗号）
    return rate ? rate.replace(/,/g, '') : rate;
  }

  return (
    <Card
      as={NextLink}
      href={`/${network.toLowerCase()}/${token.address}`}
      bg={cardBg}
      boxShadow="none"
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
        textDecoration: 'none',
      }}
      position="relative"
    >
      {/* 右上角的铸造LOGO */}
      <Box
        position="absolute"
        top={3}
        right={3}
        zIndex={1}
        bg="brand.primary"
        borderRadius="full"
        width="32px"
        height="32px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="md"
        transform="rotate(25deg)"
        _hover={{
          transform: "rotate(0deg)",
          transition: "transform 0.3s"
        }}
        transition="transform 0.3s"
      >
        <Icon 
          as={FaHammer} 
          color="white" 
          boxSize="16px" 
        />
      </Box>
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
            <Box py={1}>
              <HStack justify="space-between" mb={1}>
                <Text fontWeight="bold" fontSize="sm" color="brand.primary">
                  {token.raised}
                </Text>
                <Text fontWeight="bold" fontSize="sm">
                  {token.target}
                </Text>
              </HStack>
              <HStack spacing={2} align="center">
                <Progress
                  value={token.progress || 0}
                  colorScheme="purple"
                  borderRadius="full"
                  size="sm"
                  flex="1"
                />
                <Text fontSize="xs" fontWeight="bold" whiteSpace="nowrap">
                  {(token.progress || 0).toFixed(2)}%
                </Text>
              </HStack>
            </Box>

            <Divider />

            {/* 统计数据区域 - 紧凑展示 */}
            <HStack justify="space-between" py={2}>
              {/* 铸造人数 */}
              <HStack>
                <Icon as={FaUsers} color="brand.primary" boxSize="14px" />
                <Text fontWeight="bold" fontSize="sm" color="brand.primary">
                  {token.minterCounts}
                </Text>
              </HStack>
              
              {/* 总供应量 */}
              <HStack>
                <Icon as={FaCoins} color="brand.primary" boxSize="14px" />
                <Text fontWeight="bold" fontSize="sm">
                  {formatSupply(token.totalSupply)}
                </Text>
              </HStack>
              
              {/* 铸造价格 */}
              <HStack>
                <Icon as={FaExchangeAlt} color="brand.primary" boxSize="14px" />
                <Text fontWeight="bold" fontSize="sm">
                  {formatMintRate()}
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}
