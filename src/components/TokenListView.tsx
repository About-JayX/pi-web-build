import {
  Box,
  Flex,
  Text,
  Icon,
  HStack,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  useColorModeValue,
  useToast,
  Progress,
} from '@chakra-ui/react'
import { FaSort, FaFileContract, FaShareAlt } from 'react-icons/fa'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { formatTokenAmount } from '@/utils'
import { useCallback } from 'react'
import { useMintingCalculations } from '@/hooks/useMintingCalculations'
import { MintToken } from '@/api/types'
import { useNetwork } from '@/contexts/NetworkContext'
interface TokenListViewProps {
  tokens: MintToken[]
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  currencyUnit: string
}

// 排序指示器组件
function SortIndicator({
  column,
  sortColumn,
  sortDirection,
}: {
  column: string
  sortColumn: string
  sortDirection: 'asc' | 'desc'
}) {
  if (sortColumn !== column) {
    return (
      <Box as="span" ml={1} color="gray.400" opacity={0.6}>
        <Icon as={FaSort} fontSize="xs" />
      </Box>
    )
  }
  return (
    <Box as="span" ml={1} color="brand.primary">
      <Icon
        as={sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon}
        fontSize="sm"
      />
    </Box>
  )
}

const TokenListView = ({
  tokens,
  sortColumn,
  sortDirection,
  onSort,
  currencyUnit,
}: TokenListViewProps) => {
  const router = useRouter()
  const bg = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const thBg = useColorModeValue('gray.50', 'gray.700')
  const thHoverBg = useColorModeValue('gray.100', 'gray.600')
  const iconColor = useColorModeValue('gray.600', 'gray.400')
  const iconHoverColor = useColorModeValue('brand.primary', 'brand.light')
  const toast = useToast()
  const { t } = useTranslation()
  const { network } = useNetwork()

  // 将hook移到组件顶层，只初始化一次
  const { getFormattedMintRate } = useMintingCalculations({
    totalSupply: '', // 这里不提供具体值，只是初始化hook
    target: '',
    currencyUnit,
    tokenDecimals: 6,
  })

  // 修改格式化铸造比率函数，不在内部调用Hook
  const formatMintRateForToken = useCallback(
    (token: MintToken) => {
      // 使用已初始化的getFormattedMintRate函数
      // 注意这里只是使用函数，不再创建新的Hook实例
      const rate =
        token.mintRate ||
        getFormattedMintRate({
          totalSupply: token.totalSupply,
          target: token.target,
          currencyUnit,
          tokenDecimals: 6,
        })

      // 移除数字中的千分号（逗号）
      return rate ? rate.replace(/,/g, '') : rate
    },
    [getFormattedMintRate, currencyUnit]
  )

  // 跳转到代币铸造页面
  const navigateToMintPage = (contractAddress: string) => {
    router.push(`/${network.toLowerCase()}/${contractAddress}`)
  }

  // 缩略显示合约地址
  const formatContractAddress = (address: string) => {
    if (!address) return ''
    const start = address.substring(0, 6)
    const end = address.substring(address.length - 4)
    return `${start}...${end}`
  }

  // 分享功能处理
  const handleShare = (token: MintToken) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${token.name} (${token.symbol})`,
          text: `${t('share')} ${token.name} ${t('token')}`,
          url:
            window.location.origin +
            `/${network.toLowerCase()}/${token.address}`,
        })
        .catch(error => console.log(`${t('share')} ${t('failed')}:`, error))
    } else {
      // 如果浏览器不支持，可以复制链接到剪贴板
      const url =
        window.location.origin + `/${network.toLowerCase()}/${token.address}`
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
  const copyContractAddress = (address: string) => {
    if (address) {
      navigator.clipboard
        .writeText(address)
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

  const ThSortable = ({
    column,
    children,
    width,
  }: {
    column: string
    children: React.ReactNode
    width?: string
  }) => (
    <Th
      onClick={() => onSort(column)}
      cursor="pointer"
      position="relative"
      py={4}
      bg={thBg}
      borderBottom="2px"
      borderColor="brand.primary"
      _hover={{ bg: thHoverBg }}
      transition="all 0.2s"
      textAlign="center"
      width={width}
    >
      <Flex align="center" justify="center">
        {children}
        <SortIndicator
          column={column}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </Flex>
    </Th>
  )

  return (
    <TableContainer
      bg={bg}
      borderRadius="lg"
      boxShadow="md"
      width="100%"
      maxWidth="100%"
      overflowX="auto"
    >
      <Table variant="simple" width="100%" size="md" layout="fixed">
        <Thead>
          <Tr>
            <Th
              bg={thBg}
              borderBottom="2px"
              borderColor="brand.primary"
              width="15%"
            >
              {t('tokenColumn')}
            </Th>
            <Th
              bg={thBg}
              borderBottom="2px"
              borderColor="brand.primary"
              width="15%"
            >
              {t('contractAddressColumn')}
            </Th>
            <ThSortable column="totalSupply" width="12%">
              {t('totalSupplyColumn')}
            </ThSortable>
            <ThSortable column="raised" width="25%">
              {t('progressColumn')}
            </ThSortable>
            <ThSortable column="participants" width="10%">
              {t('participantsColumn')}
            </ThSortable>
            <Th
              bg={thBg}
              borderBottom="2px"
              borderColor="brand.primary"
              textAlign="center"
              width="15%"
            >
              {t('mintingPrice')}
            </Th>
            <Th
              bg={thBg}
              borderBottom="2px"
              borderColor="brand.primary"
              width="8%"
            >
              {t('linksColumn')}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokens.map(token => (
            <Tr
              key={token.id}
              _hover={{ bg: hoverBg, cursor: 'pointer' }}
              onClick={e => {
                if (
                  (e.target as HTMLElement).tagName !== 'A' &&
                  !(e.target as HTMLElement).closest('a') &&
                  !(e.target as HTMLElement).closest('button')
                ) {
                  navigateToMintPage(token.address)
                }
              }}
              sx={{
                transition: 'all 0.2s',
              }}
            >
              <Td>
                <HStack spacing={3}>
                  <Image
                    src={token.image}
                    alt={token.name}
                    boxSize="40px"
                    borderRadius="full"
                    border="2px solid"
                    borderColor="brand.light"
                  />
                  <Box>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color="brand.primary"
                      lineHeight="1.2"
                    >
                      {token.symbol}
                    </Text>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      noOfLines={1}
                      maxW="180px"
                    >
                      {token.name}
                    </Text>
                  </Box>
                </HStack>
              </Td>
              <Td>
                {token.address && (
                  <Box
                    as="button"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                    fontFamily="mono"
                    color="brand.primary"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    title={token.address}
                    cursor="pointer"
                    width="fit-content"
                    onClick={() => copyContractAddress(token.address)}
                    _hover={{
                      bg: 'gray.100',
                      borderColor: 'brand.primary',
                    }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaFileContract} mr={1} fontSize="10px" />
                    {formatContractAddress(token.address)}
                  </Box>
                )}
              </Td>
              <Td textAlign="center">
                {formatTokenAmount(token.totalSupply, { abbreviate: true })}
              </Td>
              <Td>
                <Box py={1} width="100%">
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
                      value={token.progress}
                      colorScheme="purple"
                      borderRadius="full"
                      size="sm"
                      flex="1"
                    />
                    <Text fontSize="xs" fontWeight="bold" whiteSpace="nowrap">
                      {token.progress.toFixed(2)}%
                    </Text>
                  </HStack>
                </Box>
              </Td>
              <Td textAlign="center">{token.participants}</Td>
              <Td textAlign="center">
                <Text
                  fontWeight="medium"
                  textAlign="center"
                  width="100%"
                  display="block"
                >
                  {formatMintRateForToken(token)}
                </Text>
              </Td>
              <Td>
                <HStack spacing={3} justify="center">
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
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default TokenListView
