'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Progress,
  Button,
  useColorModeValue,
  Flex,
  Icon,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Select,
  IconButton,
  Spinner,
} from '@chakra-ui/react'
import {
  FaThLarge,
  FaList,
  FaSort,
  FaSearch,
  FaShareAlt,
  FaFileContract,
  FaChevronLeft,
  FaChevronRight,
  FaSync,
  FaPlus,
} from 'react-icons/fa'
import NextLink from 'next/link'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import { useNetwork } from '@/contexts/NetworkContext'
import MintingTokenCard from '@/components/MintingTokenCard'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import axios from '@/config/axios'
import { store } from '@/store'
import { fetchTokenList } from '@/store/slices/tokenSlice'
import { formatTokenAmount } from '@/utils'
import { useMintingCalculations } from '@/hooks/useMintingCalculations'

interface MintToken {
  id: number
  name: string
  symbol: string
  address: string
  totalSupply: string
  participants: number
  progress: number
  image: string
  target: string
  raised: string
  mintRate: string
  created_at: string
  deployedAt?: number
  logo?: string
  minterCounts: number
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

// 列表视图组件
function TokenListView({
  tokens,
  sortColumn,
  sortDirection,
  onSort,
}: {
  tokens: MintToken[]
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
}) {
  const router = useRouter()
  const bg = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const thBg = useColorModeValue('gray.50', 'gray.700')
  const thHoverBg = useColorModeValue('gray.100', 'gray.600')
  const iconColor = useColorModeValue('gray.600', 'gray.400')
  const iconHoverColor = useColorModeValue('brand.primary', 'brand.light')
  const toast = useToast()
  const { network } = useNetwork()
  const { t } = useTranslation()
  
  // 设置当前网络的计价单位
  const currencyUnit = useMemo(() => {
    return network === 'SOL' ? 'SOL' : 'PI'
  }, [network])
  
  // 将hook移到组件顶层，只初始化一次
  const { getFormattedMintRate } = useMintingCalculations({
    totalSupply: "",  // 这里不提供具体值，只是初始化hook
    target: "",
    currencyUnit,
    tokenDecimals: 6
  });

  // 修改格式化铸造价格函数，不在内部调用Hook
  const formatMintRateForToken = useCallback((token: MintToken) => {
    // 使用已初始化的getFormattedMintRate函数
    // 注意这里只是使用函数，不再创建新的Hook实例
    const rate = token.mintRate || getFormattedMintRate({
      totalSupply: token.totalSupply,
      target: token.target,
      currencyUnit,
      tokenDecimals: 6
    });
    
    // 移除数字中的千分号（逗号）
    return rate ? rate.replace(/,/g, '') : rate;
  }, [getFormattedMintRate, currencyUnit]);

  // 跳转到代币铸造页面
  const navigateToMintPage = (contractAddress: string) => {
    router.push(`/${contractAddress}`)
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
  }: {
    column: string
    children: React.ReactNode
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
    <TableContainer bg={bg} borderRadius="lg" boxShadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">
              {t('tokenColumn')}
            </Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">
              {t('contractAddressColumn')}
            </Th>
            <ThSortable column="totalSupply">
              {t('totalSupplyColumn')}
            </ThSortable>
            <ThSortable column="raised">
              {t('progressColumn')}
            </ThSortable>
            <ThSortable column="participants">
              {t('participantsColumn')}
            </ThSortable>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary" textAlign="center">
              {t('mintingPrice')}
            </Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">
              {t('linksColumn')}
            </Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary"></Th>
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
              <Td textAlign="center">{formatTokenAmount(token.totalSupply, { abbreviate: true })}</Td>
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
                <Text fontWeight="medium" textAlign="center" width="100%" display="block">
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

// 搜索和排序面板组件
function FilterPanel({
  sortColumn,
  sortDirection,
  onSort,
  searchQuery,
  onSearchChange,
}: {
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  searchQuery: string
  onSearchChange: (value: string) => void
}) {
  const buttonBg = useColorModeValue('white', 'gray.700')
  const activeBg = useColorModeValue('gray.100', 'gray.600')
  const inputBg = useColorModeValue('white', 'gray.800')
  const { t } = useTranslation()

  const sortOptions = [
    { label: t('participantsSort'), column: 'participants' },
    { label: t('progressSort'), column: 'progress' },
    { label: t('raisedSort'), column: 'raised' },
    { label: t('targetSort'), column: 'target' },
  ]

  return (
    <Flex
      align="center"
      mb={4}
      gap={4}
      flexWrap="wrap"
      justifyContent="space-between"
    >
      <InputGroup maxW={{ base: '100%', md: '300px' }} mb={{ base: 2, md: 0 }}>
        <InputLeftElement pointerEvents="none" flexShrink={1}>
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          bg={inputBg}
          borderColor="gray.300"
          _hover={{ borderColor: 'brand.primary' }}
          _focus={{
            borderColor: 'brand.primary',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)',
          }}
        />
      </InputGroup>

      {/* <Flex align="center" gap={2} flexWrap="wrap">
        <Text fontWeight="medium" fontSize="sm" whiteSpace="nowrap">
          {t('sortBy')}
        </Text>
        {sortOptions.map(option => (
          <Button
            key={option.column}
            size="sm"
            variant="outline"
            rightIcon={
              sortColumn === option.column ? (
                <Icon
                  as={sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon}
                />
              ) : undefined
            }
            onClick={() => onSort(option.column)}
            bg={sortColumn === option.column ? activeBg : buttonBg}
            borderColor={
              sortColumn === option.column ? 'brand.primary' : 'gray.200'
            }
            color={sortColumn === option.column ? 'brand.primary' : 'gray.600'}
            _hover={{ borderColor: 'brand.primary', color: 'brand.primary' }}
          >
            {option.label}
          </Button>
        ))}
      </Flex> */}
    </Flex>
  )
}

// 添加一个新的分页控制组件
function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
}) {
  const pageSizeOptions = [12, 24, 36, 48, 96]
  const { t } = useTranslation()

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      mt={6}
      flexDir={{ base: 'column', md: 'row' }}
      gap={4}
    >
      <HStack>
        <Text fontSize="sm" fontWeight="medium">
          {t('itemsPerPage')}:
        </Text>
        <Select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          size="sm"
          w="80px"
          borderColor="gray.300"
          _hover={{ borderColor: 'brand.primary' }}
          _focus={{
            borderColor: 'brand.primary',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)',
          }}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </HStack>

      <HStack>
        <Text fontSize="sm">
          {t('pageInfo')
            .replace('{current}', currentPage.toString())
            .replace('{total}', totalPages.toString())}
        </Text>
        <ButtonGroup isAttached variant="outline" size="sm">
          <IconButton
            aria-label={t('prevPage')}
            icon={<FaChevronLeft />}
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage <= 1}
            colorScheme="purple"
          />
          <IconButton
            aria-label={t('nextPage')}
            icon={<FaChevronRight />}
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
            colorScheme="purple"
          />
        </ButtonGroup>
      </HStack>
    </Flex>
  )
}

export default function MintPage() {
  const { tokenList, loading, error } = useAppSelector(state => state.token)
  const { network } = useNetwork()
  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(() => {
    // 仅在客户端执行
    if (typeof window !== 'undefined') {
      // 从localStorage中读取保存的每页显示数量
      const savedPageSize = localStorage.getItem('mint_page_size')
      // 如果存在有效值则使用它，否则默认为12
      return savedPageSize ? Number(savedPageSize) || 12 : 12
    }
    // 服务器端渲染时默认使用12
    return 12
  })
  const [tabIndex, setTabIndex] = useState(() => {
    // 仅在客户端执行
    if (typeof window !== 'undefined') {
      // 从localStorage中读取保存的标签页索引
      const savedTabIndex = localStorage.getItem('mint_tab_index')
      // 如果存在有效值则使用它，否则默认为0
      return savedTabIndex ? Number(savedTabIndex) || 0 : 0
    }
    // 服务器端渲染时默认使用第一个标签页
    return 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'list'>(() => {
    // 仅在客户端执行
    if (typeof window !== 'undefined') {
      // 从localStorage中读取保存的视图模式
      const savedViewMode = localStorage.getItem('mint_view_mode')
      // 如果存在有效值则使用它，否则默认为'card'
      return (savedViewMode === 'card' || savedViewMode === 'list') ? savedViewMode : 'card'
    }
    // 服务器端渲染时默认使用卡片视图
    return 'card'
  })
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // 获取token列表
  const getTokenList = async () => {
    try {
      // 根据标签索引选择不同的排序字段
      let sortField = '';
      switch(tabIndex) {
        case 0: // 热门铸造
          sortField = 'progress';
          break;
        case 1: // 所有代币
          sortField = 'token_id';
          break;
        case 2: // 最新部署
          sortField = 'created_at';
          break;
        case 3: // 铸造结束
          sortField = 'progress';
          break;
        default:
          sortField = 'progress';
      }
      
      await store.dispatch(
        fetchTokenList({
          page: currentPage,
          limit: pageSize,
          sort: sortField,
        })
      )
    } catch (error) {
      console.error('获取代币列表失败:', error)
    }
  }

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    getTokenList()
    // 滚动到页面顶部以便看到新内容
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 处理每页显示数量变化
  const handlePageSizeChange = (newSize: number) => {
    // 调整当前页以保持项目连续性
    const firstItemIndex = (currentPage - 1) * pageSize
    const newCurrentPage = Math.floor(firstItemIndex / newSize) + 1

    setPageSize(newSize)
    setCurrentPage(newCurrentPage)
    getTokenList()
  }

  // 切换tab时重置页码并获取数据
  useEffect(() => {
    setCurrentPage(1)
    // 根据标签索引选择不同的排序字段
    let sortField = '';
    switch(tabIndex) {
      case 0: // 热门铸造
        sortField = 'progress';
        break;
      case 1: // 所有代币
        sortField = 'token_id';
        break;
      case 2: // 最新部署
        sortField = 'created_at';
        break;
      case 3: // 铸造结束
        sortField = 'progress';
        break;
      default:
        sortField = 'progress';
    }
    
    store.dispatch(
      fetchTokenList({
        page: 1,
        limit: pageSize,
        sort: sortField,
      })
    )
  }, [tabIndex, pageSize])

  // 监听页码变化获取数据
  useEffect(() => {
    if (currentPage !== 1) {
      // 避免和tab切换时的重置冲突
      // 根据标签索引选择不同的排序字段
      let sortField = '';
      switch(tabIndex) {
        case 0: // 热门铸造
          sortField = 'progress';
          break;
        case 1: // 所有代币
          sortField = 'token_id';
          break;
        case 2: // 最新部署
          sortField = 'created_at';
          break;
        case 3: // 铸造结束
          sortField = 'progress';
          break;
        default:
          sortField = 'progress';
      }
      
      store.dispatch(
        fetchTokenList({
          page: currentPage,
          limit: pageSize,
          sort: sortField,
        })
      )
    }
  }, [currentPage, pageSize, tabIndex])

  // 设置当前网络的计价单位
  const currencyUnit = useMemo(() => {
    return network === 'SOL' ? 'SOL' : 'PI'
  }, [network])

  // 保存视图模式到本地存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mint_view_mode', viewMode)
    }
  }, [viewMode])

  // 保存标签页选择到本地存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mint_tab_index', String(tabIndex))
    }
  }, [tabIndex])

  // 保存每页显示数量到本地存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mint_page_size', String(pageSize))
    }
  }, [pageSize])

  // 强制在移动设备上使用卡片视图
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode !== 'card') {
        setViewMode('card');
      }
    };
    
    // 添加客户端检测，以避免服务器端渲染问题
    if (typeof window !== 'undefined') {
      // 初始化时检查
      handleResize();
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [viewMode]);

  // 共享排序逻辑
  const handleSort = (column: string) => {
    const newDirection =
      sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc'
    setSortColumn(column)
    setSortDirection(newDirection)
  }

  // 搜索过滤逻辑
  const filterTokensBySearch = (tokens: MintToken[]) => {
    if (!searchQuery.trim()) return tokens

    const query = searchQuery.toLowerCase().trim()
    return tokens.filter(
      token =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        (token.address && token.address.toLowerCase().includes(query))
    )
  }

  // 对数据进行排序
  const getSortedTokens = (tokens: MintToken[]) => {
    return [...tokens].sort((a, b) => {
      switch (sortColumn) {
        case 'totalSupply':
          const aSupply = parseFloat(a.totalSupply)
          const bSupply = parseFloat(b.totalSupply)
          return sortDirection === 'asc' ? aSupply - bSupply : bSupply - aSupply
        case 'progress':
          return sortDirection === 'asc'
            ? a.progress - b.progress
            : b.progress - a.progress
        case 'participants':
          return sortDirection === 'asc'
            ? a.participants - b.participants
            : b.participants - a.participants
        case 'created_at':
          return sortDirection === 'asc'
            ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        default:
          return 0
      }
    })
  }

  // 处理分页逻辑
  const paginateTokens = (tokens: MintToken[]) => {
    const startIndex = (currentPage - 1) * pageSize
    return tokens.slice(startIndex, startIndex + pageSize)
  }

  // 当筛选或排序条件变化时，重置为第一页
  useEffect(() => {
    setCurrentPage(1)
  }, [sortColumn, sortDirection, searchQuery])

  const renderTabContent = (tokens: MintToken[]) => {
    // 显示加载状态
    if (loading) {
      return (
        <Box py={10} textAlign="center">
          <VStack spacing={4}>
            <Spinner 
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='brand.primary'
              size='xl'
            />
            <Text color="gray.500" fontSize="md">
              {t('tabSwitchLoading')}
            </Text>
          </VStack>
        </Box>
      )
    }

    // 显示API错误
    if (error) {
      return (
        <Box py={10} textAlign="center">
          <Text color="red.500" fontSize="lg" mb={4}>
            {error}
          </Text>
          <VStack spacing={4}>
            <Button 
              colorScheme="purple" 
              onClick={getTokenList} 
              leftIcon={<Icon as={FaSync} />}
            >
              {t('tryAgain')}
            </Button>
          </VStack>
        </Box>
      )
    }

    // 处理token列表
    const processedTokens = tokens.map(token => ({
      ...token,
      image: token.logo || '/token-logo.png', // 使用token中的logo，如果没有则使用默认图片
    }))

    // 先过滤搜索结果
    const filteredTokens = filterTokensBySearch(processedTokens)

    // 显示空结果状态
    if (filteredTokens.length === 0) {
      return (
        <Box py={10} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            {t('noResults')}
          </Text>
          {searchQuery && (
            <Button
              mt={4}
              variant="outline"
              colorScheme="purple"
              onClick={() => setSearchQuery('')}
            >
              {t('clearSearch')}
            </Button>
          )}
        </Box>
      )
    }

    return (
      <>
        {viewMode === 'card' ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4, xl: 4 }}
            spacing={{ base: 6, md: 5, lg: 4 }}
          >
            {filteredTokens.map(token => (
              <MintingTokenCard
                key={token.id}
                token={token}
                currencyUnit={currencyUnit}
              />
            ))}
          </SimpleGrid>
        ) : (
          <TokenListView
            tokens={filteredTokens}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}

        <PaginationControl
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTokens.length / pageSize)}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </>
    )
  }

  return (
    <Box>
      <Container maxW="container.xl" py={12}>
        <VStack spacing={{ base: 4, md: 10 }} align="stretch">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            mb={{ base: 2, md: 0 }}
            spacing={{ base: 2, md: 0 }}
          >
            <Flex 
              align="baseline" 
              width={{ base: "100%", md: "auto" }}
              mb={{ base: 0, md: 0 }}
            >
              <Heading as="h2" size="lg" m={0}>
                {t('mintingTokens')}
              </Heading>
              <Button
                as={NextLink}
                href="/deploy"
                ml={4}
                mt={{ base: 0, md: 1 }}
                colorScheme="teal"
                variant="solid"
                size={{ base: "sm", md: "md" }}
                bg="teal.400"
                _hover={{ bg: 'teal.500' }}
                leftIcon={<FaPlus />}
                fontWeight="medium"
              >
                {t('deploy')}
              </Button>
            </Flex>
            {/* 在移动设备上隐藏视图切换按钮 */}
            <ButtonGroup 
              isAttached 
              variant="outline" 
              colorScheme="purple" 
              display={{ base: 'none', md: 'flex' }}
            >
              <Button
                leftIcon={<FaThLarge />}
                variant={viewMode === 'card' ? 'solid' : 'outline'}
                bg={viewMode === 'card' ? 'brand.primary' : undefined}
                color={viewMode === 'card' ? 'white' : 'brand.primary'}
                onClick={() => setViewMode('card')}
              >
                {t('cardView')}
              </Button>
              <Button
                leftIcon={<FaList />}
                variant={viewMode === 'list' ? 'solid' : 'outline'}
                bg={viewMode === 'list' ? 'brand.primary' : undefined}
                color={viewMode === 'list' ? 'white' : 'brand.primary'}
                onClick={() => setViewMode('list')}
              >
                {t('listView')}
              </Button>
            </ButtonGroup>
          </Stack>

          <Tabs
            colorScheme="purple"
            variant="enclosed"
            index={tabIndex}
            onChange={setTabIndex}
            isLazy
            mt={{ base: 0, md: 2 }}
          >
            <TabList
              borderBottom="2px"
              borderColor="brand.primary"
              mb={{ base: 2, md: 4 }}
              overflow="hidden"
              overflowX="auto"
              width="100%"
              display="flex"
              flexWrap="nowrap"
            >
              <Tab
                fontWeight="medium"
                fontSize={{ base: "xs", md: "sm" }}
                p={{ base: 2, md: 3 }}
                minWidth={{ base: "auto", md: "auto" }}
                whiteSpace="nowrap"
                flexShrink={0}
                _selected={{
                  color: 'brand.primary',
                  borderColor: 'brand.primary',
                  borderBottom: '3px solid',
                  fontWeight: 'bold',
                  bg: 'gray.50',
                }}
                _hover={{
                  color: 'brand.primary',
                  borderColor: 'brand.light',
                }}
                transition="all 0.2s"
              >
                {t('hotTokens')}
              </Tab>
              <Tab
                fontWeight="medium"
                fontSize={{ base: "xs", md: "sm" }}
                p={{ base: 2, md: 3 }}
                minWidth={{ base: "auto", md: "auto" }}
                whiteSpace="nowrap"
                flexShrink={0}
                _selected={{
                  color: 'brand.primary',
                  borderColor: 'brand.primary',
                  borderBottom: '3px solid',
                  fontWeight: 'bold',
                  bg: 'gray.50',
                }}
                _hover={{
                  color: 'brand.primary',
                  borderColor: 'brand.light',
                }}
                transition="all 0.2s"
              >
                {t('allMinting')}
              </Tab>
              <Tab
                fontWeight="medium"
                fontSize={{ base: "xs", md: "sm" }}
                p={{ base: 2, md: 3 }}
                minWidth={{ base: "auto", md: "auto" }}
                whiteSpace="nowrap"
                flexShrink={0}
                _selected={{
                  color: 'brand.primary',
                  borderColor: 'brand.primary',
                  borderBottom: '3px solid',
                  fontWeight: 'bold',
                  bg: 'gray.50',
                }}
                _hover={{
                  color: 'brand.primary',
                  borderColor: 'brand.light',
                }}
                transition="all 0.2s"
              >
                {t('latestDeployed')}
              </Tab>
              <Tab
                fontWeight="medium"
                fontSize={{ base: "xs", md: "sm" }}
                p={{ base: 2, md: 3 }}
                minWidth={{ base: "auto", md: "auto" }}
                whiteSpace="nowrap"
                flexShrink={0}
                _selected={{
                  color: 'brand.primary',
                  borderColor: 'brand.primary',
                  borderBottom: '3px solid',
                  fontWeight: 'bold',
                  bg: 'gray.50',
                }}
                _hover={{
                  color: 'brand.primary',
                  borderColor: 'brand.light',
                }}
                transition="all 0.2s"
              >
                {t('mintingFinished')}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <FilterPanel
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                {renderTabContent(tokenList)}
              </TabPanel>

              <TabPanel px={0}>
                <FilterPanel
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                {renderTabContent(tokenList)}
              </TabPanel>

              <TabPanel px={0}>
                <FilterPanel
                  sortColumn={'deployedAt'}
                  sortDirection={'desc'}
                  onSort={() => {}} // 禁用排序功能
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                {renderTabContent(tokenList)}
              </TabPanel>
              
              <TabPanel px={0}>
                <FilterPanel
                  sortColumn={'progress'}
                  sortDirection={'desc'}
                  onSort={() => {}} // 禁用排序功能
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                {renderTabContent(tokenList.filter(token => token.progress >= 100))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  )
}
