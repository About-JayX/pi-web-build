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
  Grid,
  Card,
  CardBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
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
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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
import PaginationControl from '@/components/PaginationControl'
import TokenListView from '@/components/TokenListView'
import FilterPanel from '@/components/FilterPanel'
import { MintToken } from '@/api/types'
import { LoadingSpinner, StyledTabs, ShareModal } from '@/components'
import ErrorDisplay from '@/components/common/ErrorDisplay'

// 添加参数接口定义
interface TokenListParams {
  page?: number
  limit?: number
  category?: string
  order?: string
  sort_by?: string
  search?: string
}

export default function MintPage() {
  const { tokenList, loading, error } = useAppSelector(state => state.token)
  const { network } = useNetwork()
  const { t } = useTranslation()

  // 添加初次加载标记，用于避免页面刷新时不必要的数据请求
  const [isInitialLoad, setIsInitialLoad] = useState(true)
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
  const [viewMode, setViewMode] = useState<'card' | 'list'>(() => {
    // 仅在客户端执行
    if (typeof window !== 'undefined') {
      // 从localStorage中读取保存的视图模式
      const savedViewMode = localStorage.getItem('mint_view_mode')
      // 如果存在有效值则使用它，否则默认为'card'
      return savedViewMode === 'card' || savedViewMode === 'list'
        ? savedViewMode
        : 'card'
    }
    // 服务器端渲染时默认使用卡片视图
    return 'card'
  })
  const [sortColumn, setSortColumn] = useState('progress')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC')
  const [totalTokenCount, setTotalTokenCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [tabChangeInProgress, setTabChangeInProgress] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // 创建滚动到顶部的通用功能函数，避免重复声明
  const scrollToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [])

  // 获取token列表
  const getTokenList = async () => {
    try {
      // 在数据加载前先滚动到顶部
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0)
      }

      // 根据标签索引选择不同的类别
      let category = ''

      switch (tabIndex) {
        case 0: // 热门铸造
          category = 'hot'
          break
        case 1: // 所有代币
          // 所有代币不需要 category
          break
        case 2: // 最新部署
          category = 'latest'
          break
        case 3: // 铸造结束
          category = 'completed'
          break
      }

      // 构建请求参数
      const params: TokenListParams = {
        page: currentPage,
        limit: pageSize,
        order: sortDirection.toUpperCase(),
        sort_by: sortColumn,
        ...(category && { category }),
      }

      // 先清空数据，显示加载状态
      store.dispatch({
        type: 'token/fetchTokenList/pending',
      })

      // 发起数据请求
      await store.dispatch(fetchTokenList(params))

      // 数据加载完成后再次滚动到顶部
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0)
      }
    } catch (error) {
      console.error('Failed to fetch token list:', error)
    }
  }

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    // 只更新页码，滚动由PaginationControl组件处理
    setCurrentPage(newPage)
  }

  // 处理每页显示数量变化
  const handlePageSizeChange = (newSize: number) => {
    // 调整当前页以保持项目连续性
    const firstItemIndex = (currentPage - 1) * pageSize
    const newCurrentPage = Math.floor(firstItemIndex / newSize) + 1

    // 更新状态，滚动由PaginationControl组件处理
    setPageSize(newSize)
    setCurrentPage(newCurrentPage)
  }

  // 计算总页数
  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      // 如果返回的数据条数等于pageSize，说明可能还有下一页
      const hasMorePages = tokenList.length >= pageSize
      // 如果当前页是第1页，并且有足够多的数据，则至少有2页
      // 否则，我们认为当前页就是最后一页
      const calculatedTotalPages =
        currentPage === 1 && hasMorePages
          ? Math.max(2, currentPage + 1)
          : hasMorePages
          ? currentPage + 1
          : currentPage

      setTotalPages(calculatedTotalPages)
      setTotalTokenCount(
        tokenList.length + (calculatedTotalPages - currentPage) * pageSize
      )
    } else {
      setTotalPages(1)
      setTotalTokenCount(0)
    }
  }, [tokenList, currentPage, pageSize])

  // 处理Tab切换处理函数，添加到组件中
  const handleTabChange = (index: number) => {
    // 如果已经是当前Tab，不做任何操作
    if (index === tabIndex) return

    // 滚动到顶部
    scrollToTop()

    // 设置标志位，防止useEffect触发额外查询
    setTabChangeInProgress(true)

    // 在sessionStorage中设置标记，表示Tab正在切换
    // 这是为了防止其他useEffect触发重复请求
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('tabJustChanged', 'true')
    }

    // 更新Tab索引状态
    setTabIndex(index)
    setCurrentPage(1)

    // 根据Tab设置不同的排序条件
    let newSortColumn = ''
    let newDirection: 'ASC' | 'DESC' = 'DESC'

    switch (index) {
      case 0: // 热门铸造 - 修改为默认使用进度排序
        newSortColumn = 'progress'
        break
      case 1: // 所有代币 - 默认按铸造进度排序
        newSortColumn = 'progress'
        break
      case 2: // 最新部署
        newSortColumn = ''
        break
      case 3: // 铸造结束
        newSortColumn = 'deployAt'
        break
      default:
        newSortColumn = ''
        break
    }

    // 更新排序状态，但不触发额外的useEffect
    setSortColumn(newSortColumn)
    setSortDirection(newDirection)

    // 预先清除任何可能存在的上一次参数缓存
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('lastTokenListParams')
    }

    // 构建请求参数
    const params: TokenListParams = {
      page: 1, // 始终从第一页开始
      limit: pageSize,
      order: newDirection.toUpperCase(),
      sort_by: newSortColumn,
      ...(index === 0 && { category: 'hot' }),
      ...(index === 2 && { category: 'latest' }),
      ...(index === 3 && { category: 'completed' }),
    }

    // 记录本次请求的参数以防重复请求
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'lastTokenListParams',
        JSON.stringify({
          page: 1,
          limit: pageSize,
          sort: newSortColumn,
          direction: newDirection,
          category:
            index === 0
              ? 'hot'
              : index === 2
              ? 'latest'
              : index === 3
              ? 'completed'
              : '',
        })
      )
    }

    // 先清空数据，显示加载状态
    store.dispatch({
      type: 'token/fetchTokenList/pending',
    })

    // 直接发起数据请求
    store.dispatch(fetchTokenList(params)).finally(() => {
      // 查询完成后重置标志位，不管请求成功还是失败
      setTabChangeInProgress(false)

      // 延迟一点移除tabJustChanged标记，确保其他useEffect不会立即触发
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.sessionStorage.removeItem('tabJustChanged')
        }, 300)
      }
    })
  }

  // 共享排序逻辑，优化为单一数据请求
  const handleSort = (column: string) => {
    // 如果正在进行其他操作，不处理排序
    if (tabChangeInProgress) return

    // 设置排序正在进行的标记，防止useEffect触发额外请求
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('sortingInProgress', 'true')
    }

    // 计算新的排序方向
    const newDirection =
      sortColumn === column && sortDirection === 'DESC' ? 'ASC' : 'DESC'

    // 更新排序状态
    setSortColumn(column)
    setSortDirection(newDirection)

    // 如果不是第1页，重置到第1页
    if (currentPage !== 1) {
      setCurrentPage(1)
    }

    // 构建请求参数
    let category = ''
    switch (tabIndex) {
      case 0: // 热门铸造
        category = 'hot'
        break
      case 1: // 所有代币
        // 不需要category
        break
      case 2: // 最新部署
        category = 'latest'
        break
      case 3: // 铸造结束
        category = 'completed'
        break
    }

    // 直接构建一次请求参数
    const params: TokenListParams = {
      page: 1, // 总是从第一页开始
      limit: pageSize,
      order: newDirection.toUpperCase(),
      sort_by: column,
      ...(category && { category }),
    }

    // 记录本次请求参数，防止重复请求
    if (typeof window !== 'undefined') {
      const currentParams = JSON.stringify({
        page: 1,
        limit: pageSize,
        sort: column,
        direction: newDirection,
        category,
      })
      window.sessionStorage.setItem('lastTokenListParams', currentParams)
      window.sessionStorage.setItem('lastSearchParams', currentParams)
    }

    // 先清空数据，显示加载状态
    store.dispatch({
      type: 'token/fetchTokenList/pending',
    })

    // 延迟执行，确保状态更新已完成
    setTimeout(() => {
      // 发起数据请求
      store.dispatch(fetchTokenList(params)).finally(() => {
        // 请求完成后清理标记
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem('sortingInProgress')
        }
      })
    }, 10)
  }

  // 处理搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // 使用 useEffect 来处理输入值的更新
  useEffect(() => {
    const handleSearch = () => {
      if (searchInputRef.current) {
        setSearchQuery(searchInputRef.current.value)
      }
    }

    // 使用 requestAnimationFrame 来优化性能
    let rafId: number
    const debouncedHandleSearch = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleSearch)
    }

    if (searchInputRef.current) {
      searchInputRef.current.addEventListener('input', debouncedHandleSearch)
    }

    return () => {
      if (searchInputRef.current) {
        searchInputRef.current.removeEventListener(
          'input',
          debouncedHandleSearch
        )
      }
      cancelAnimationFrame(rafId)
    }
  }, [])

  // 修改最后一个useEffect，使用防抖后的搜索值
  useEffect(() => {
    // 增加tabChangeInProgress检查，避免Tab切换过程中的重复查询
    if (isInitialLoad || tabChangeInProgress) return

    // 如果Tab刚刚切换过或正在排序，也不触发请求
    if (
      typeof window !== 'undefined' &&
      (window.sessionStorage.getItem('tabJustChanged') === 'true' ||
        window.sessionStorage.getItem('sortingInProgress') === 'true')
    ) {
      return
    }

    // 重置到第一页
    setCurrentPage(1)

    // 检查当前参数是否有变化
    let category = ''
    switch (tabIndex) {
      case 0: // 热门铸造
        category = 'hot'
        break
      case 1: // 所有代币
        // 不需要category
        break
      case 2: // 最新部署
        category = 'latest'
        break
      case 3: // 铸造结束
        category = 'completed'
        break
    }

    // 构建当前参数
    const currentParams = JSON.stringify({
      page: 1,
      limit: pageSize,
      sort: sortColumn,
      direction: sortDirection,
      category,
      ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
    })

    // 使用sessionStorage保存上一次的参数，如果和当前参数相同，则不重新请求
    if (typeof window !== 'undefined') {
      const lastSearchParams = window.sessionStorage.getItem('lastSearchParams')
      if (lastSearchParams === currentParams) return
      window.sessionStorage.setItem('lastSearchParams', currentParams)
    }

    // 构建请求参数
    const params: TokenListParams = {
      page: 1,
      limit: pageSize,
      order: sortDirection.toUpperCase(),
      sort_by: sortColumn,
      ...(category && { category }),
      ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
    }

    // 添加短延迟确保UI更新
    const timeoutId = setTimeout(() => {
      // 先清空数据
      store.dispatch({
        type: 'token/fetchTokenList/pending',
      })

      // 发起请求
      store.dispatch(fetchTokenList(params))
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [
    debouncedSearchQuery,
    sortColumn,
    sortDirection,
    isInitialLoad,
    pageSize,
    tabChangeInProgress,
    tabIndex,
  ]) // 使用 debouncedSearchQuery 替代 searchQuery

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

  // 添加初始加载处理
  useEffect(() => {
    if (isInitialLoad && typeof window !== 'undefined') {
      // 根据当前标签设置初始排序列
      let initialSortColumn = 'progress'

      if (tabIndex === 2) {
        // 最新部署标签
        initialSortColumn = ''
      } else if (tabIndex === 3) {
        // 铸造结束标签
        initialSortColumn = 'deployAt'
      }

      setSortColumn(initialSortColumn)

      // 构建请求参数
      const params: TokenListParams = {
        page: currentPage,
        limit: pageSize,
        order: sortDirection.toUpperCase(),
        sort_by: initialSortColumn,
        ...(tabIndex === 0 && { category: 'hot' }),
        ...(tabIndex === 2 && { category: 'latest' }),
        ...(tabIndex === 3 && { category: 'completed' }),
      }

      // 发起数据请求
      store.dispatch(fetchTokenList(params))

      // 将初始加载标志设置为false
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, currentPage, pageSize, tabIndex, sortDirection])

  // 强制在移动设备上使用卡片视图
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode !== 'card') {
        setViewMode('card')
      }
    }

    // 添加客户端检测，以避免服务器端渲染问题
    if (typeof window !== 'undefined') {
      // 初始化时检查
      handleResize()

      // 监听窗口大小变化
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [viewMode])

  // 使用 useMemo 缓存处理后的 token 列表
  const processedTokens = useMemo(() => {
    if (!tokenList) return []

    // 判断是否为测试环境
    const isTestEnv = process.env.NODE_ENV === 'development'

    // 处理token列表
    let processed = tokenList.map(token => ({
      ...token,
      image: token.logo || '/token-logo.png',
    }))

    // 只显示总供应量为 314M 和 1000M 的项目
    processed = processed.filter(token => {
      const totalSupply = parseFloat(token.totalSupply)
      if (isNaN(totalSupply)) return false

      if (isTestEnv && totalSupply === 1000000) {
        return true
      }

      return totalSupply === 314000000 || totalSupply === 1000000000
    })

    // 在热门铸造标签页，筛选掉持有人小于2的项目
    if (tabIndex === 0) {
      processed = processed.filter(token => token.minterCounts >= 2)
    }

    return processed
  }, [tokenList, tabIndex])

  // 使用 useMemo 缓存渲染内容
  const tabContent = useMemo(() => {
    // 显示加载状态
    if (loading || isInitialLoad) {
      return <LoadingSpinner />
    }

    // 显示API错误
    if (error) {
      return (
        <Box py={10} textAlign="center">
          <ErrorDisplay message={error} onRetry={getTokenList} />
        </Box>
      )
    }

    // 显示空结果状态
    if (processedTokens.length === 0) {
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
          <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={4}>
            {processedTokens.map(token => (
              <MintingTokenCard
                key={token.id}
                token={token}
                currencyUnit={currencyUnit}
              />
            ))}
          </SimpleGrid>
        ) : (
          <TokenListView
            tokens={processedTokens}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            currencyUnit={currencyUnit}
          />
        )}

        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </>
    )
  }, [
    loading,
    isInitialLoad,
    error,
    processedTokens,
    searchQuery,
    viewMode,
    currencyUnit,
    sortColumn,
    sortDirection,
    currentPage,
    totalPages,
    pageSize,
  ])

  // 修改 renderTabContent 函数
  const renderTabContent = () => tabContent

  const inputBg = useColorModeValue('white', 'gray.800')

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
            <Flex align="baseline">
              <Heading as="h2" size="lg" m={0}>
                {t('mintingTokens')}
              </Heading>
              <Button
                display={{ base: 'flex', md: 'none' }}
                as={NextLink}
                href="/deploy"
                ml={2}
                colorScheme="teal"
                variant="solid"
                size="sm"
                bg="teal.400"
                _hover={{ bg: 'teal.500' }}
                leftIcon={<FaPlus />}
                fontWeight="medium"
              >
                {t('deploy')}
              </Button>
              <Button
                display={{ base: 'none', md: 'flex' }}
                as={NextLink}
                href="/deploy"
                ml={4}
                mt={{ base: 0, md: 1 }}
                colorScheme="teal"
                variant="solid"
                size={{ base: 'sm', md: 'md' }}
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
          <Grid gap={2}>
            <Flex
              justifyContent="space-between"
              alignItems={{ base: 'flex-start', md: 'center' }}
              flexWrap="wrap"
              flexDirection={{ base: 'column', md: 'row' }}
              gap={4}
              overflow="hidden"
            >
              <Flex
                gap={4}
                overflowX="auto"
                flex={1}
                sx={{
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE and Edge
                }}
              >
                {[
                  t('hotTokens'),
                  t('allMinting'),
                  t('latestDeployed'),
                  t('mintingFinished'),
                ].map((item, index) => (
                  <Button
                    flexShrink={{ base: 0, lg: 1 }}
                    key={index}
                    variant={tabIndex === index ? 'outline' : 'outline'}
                    bg={tabIndex === index ? 'transparent' : ''}
                    color={tabIndex === index ? 'brand.primary' : 'gray.500'}
                    borderColor={
                      tabIndex === index ? 'brand.light' : 'transparent'
                    }
                    borderWidth={tabIndex === index ? 2 : 0}
                    onClick={() => handleTabChange(index)}
                  >
                    {item}
                  </Button>
                ))}
              </Flex>

              <Flex gap={2} w={{ base: '100%', md: 'auto' }}>
                {/* 排序 */}
                <Menu>
                  <MenuButton
                    minW={{ base: '120px', md: '160px' }}
                    as={Button}
                    variant="solid"
                    bg="white"
                    _hover={{ bg: 'white' }}
                    _active={{ bg: 'white' }}
                    borderWidth={1}
                    fontSize="sm"
                    rightIcon={<ChevronDownIcon />}
                  >
                    {!sortColumn
                      ? // 当没有选择排序条件时，显示默认文本
                        tabIndex === 0
                        ? t('progressColumn') // 修改热门铸造标签页的默认显示
                        : tabIndex === 1
                        ? t('progressColumn') // 所有代币默认显示"铸造进度"
                        : tabIndex === 2
                        ? t('deployed')
                        : tabIndex === 3
                        ? t('deployed')
                        : t('sortBy')
                      : // 当用户选择了排序条件时，显示所选排序条件
                      sortColumn === 'progress'
                      ? t('progressColumn')
                      : sortColumn === 'minter_counts'
                      ? t('participantsColumn')
                      : sortColumn === 'target'
                      ? t('targetSort')
                      : sortColumn === 'raised'
                      ? t('raisedSort')
                      : sortColumn === 'deployAt'
                      ? t('deployed')
                      : tabIndex === 2 && sortColumn === ''
                      ? t('deployed') // 确保最新部署标签页空排序列显示为"部署时间"
                      : t('progressColumn')}
                  </MenuButton>
                  <MenuList minW={{ base: '120px', md: '160px' }}>
                    {[
                      { label: t('progressColumn'), value: 'progress' },
                      { label: t('targetSort'), value: 'target' },
                      { label: t('raisedSort'), value: 'raised' },
                      {
                        label: t('participantsColumn'),
                        value: 'minter_counts',
                      },
                      { label: t('deployed'), value: 'deployAt' },
                    ].map((item, index) => (
                      <MenuItem
                        key={index}
                        fontSize="sm"
                        bg={
                          sortColumn === item.value ? 'brand.light' : undefined
                        }
                        fontWeight={
                          sortColumn === item.value ? 'bold' : 'normal'
                        }
                        color={
                          sortColumn === item.value
                            ? 'brand.primary'
                            : undefined
                        }
                        onClick={() => {
                          // 修改为直接调用handleSort而不是多次设置状态
                          handleSort(item.value)
                        }}
                      >
                        {item.label}
                        {sortColumn === item.value && (
                          <Icon
                            as={
                              sortDirection === 'ASC'
                                ? ChevronUpIcon
                                : ChevronDownIcon
                            }
                            ml={2}
                            color="brand.primary"
                          />
                        )}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <InputGroup maxW={{ base: '100%', md: '300px' }} mb={0}>
                  <InputLeftElement pointerEvents="none" flexShrink={1}>
                    <Icon as={FaSearch} color="gray.400" />
                  </InputLeftElement>

                  <Input
                    ref={searchInputRef}
                    placeholder={t('searchPlaceholder')}
                    defaultValue={searchQuery}
                    bg={inputBg}
                    borderColor="gray.200"
                    borderRadius="md"
                    _hover={{ borderColor: 'brand.primary' }}
                    _focus={{
                      borderColor: 'brand.primary',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)',
                    }}
                    size="md"
                    fontSize="sm"
                  />
                </InputGroup>
              </Flex>
            </Flex>
            <FilterPanel
              sortColumn={sortColumn}
              sortDirection={sortDirection.toLowerCase() as 'asc' | 'desc'}
              onSort={handleSort}
            />
            <Card
              p={0}
              bg="transparent"
              shadow="none"
              mt={{ base: -5, sm: -4 }}
            >
              <CardBody p={0}>{renderTabContent()}</CardBody>
            </Card>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}
