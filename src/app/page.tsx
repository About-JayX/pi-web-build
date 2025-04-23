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
import PaginationControl from '@/components/PaginationControl'
import TokenListView from '@/components/TokenListView'
import FilterPanel from '@/components/FilterPanel'
import { LoadingSpinner } from '@/components'

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
  const [totalTokenCount, setTotalTokenCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
      
      // 构建请求参数，添加搜索关键词
      const params: any = {
        page: currentPage,
        limit: pageSize,
        sort: sortField,
      };
      
      // 如果有搜索关键词，添加到请求参数中
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      // 如果是铸造结束标签页，添加进度100%的过滤条件
      if (tabIndex === 3) {
        params.finished = true;
      }
      
      await store.dispatch(
        fetchTokenList(params)
      )
    } catch (error) {
      console.error('获取代币列表失败:', error)
    }
  }

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // 处理每页显示数量变化
  const handlePageSizeChange = (newSize: number) => {
    // 调整当前页以保持项目连续性
    const firstItemIndex = (currentPage - 1) * pageSize
    const newCurrentPage = Math.floor(firstItemIndex / newSize) + 1

    setPageSize(newSize)
    setCurrentPage(newCurrentPage)
  }

  // 计算总页数
  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      // 如果返回的数据条数等于pageSize，说明可能还有下一页
      const hasMorePages = tokenList.length >= pageSize;
      // 如果当前页是第1页，并且有足够多的数据，则至少有2页
      // 否则，我们认为当前页就是最后一页
      const calculatedTotalPages = (currentPage === 1 && hasMorePages) 
        ? Math.max(2, currentPage + 1) 
        : (hasMorePages ? currentPage + 1 : currentPage);
      
      setTotalPages(calculatedTotalPages);
      setTotalTokenCount(tokenList.length + (calculatedTotalPages - currentPage) * pageSize);
    } else {
      setTotalPages(1);
      setTotalTokenCount(0);
    }
  }, [tokenList, currentPage, pageSize]);

  // 监听页码或每页数量变化，获取对应页的数据
  useEffect(() => {
    // 避免初始加载时的重复请求
    if (isInitialLoad) return;
    
    getTokenList()
    // 滚动到页面顶部以便看到新内容
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage, pageSize, isInitialLoad])

  // 修改切换tab时重置页码并获取数据的useEffect
  useEffect(() => {
    // 如果是初始加载，不触发重复请求
    if (isInitialLoad) {
      setIsInitialLoad(false)
      return
    }

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
  }, [tabIndex, pageSize, isInitialLoad])

  // 监听页码变化获取数据
  useEffect(() => {
    // 避免初始加载时的重复请求
    if (isInitialLoad) return;
    
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
  }, [currentPage, pageSize, tabIndex, isInitialLoad])

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

  // 初始化时基于tabIndex加载正确的数据
  useEffect(() => {
    if (isInitialLoad && typeof window !== 'undefined') {
      // 根据初始化的标签索引选择正确的排序字段
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
      
      // 在初始化时基于本地存储中的tabIndex加载数据
      store.dispatch(
        fetchTokenList({
          page: 1,
          limit: pageSize,
          sort: sortField,
          finished: tabIndex === 3 // 如果是铸造结束标签页，添加进度100%的过滤条件
        })
      )

      // 标记初始加载已完成
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, tabIndex, pageSize])

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

  // 当搜索条件、排序条件变化时，重置为第一页并重新请求数据
  useEffect(() => {
    setCurrentPage(1);
    // 通过监听currentPage变化会自动触发getTokenList
  }, [searchQuery, sortColumn, sortDirection]);
  
  const renderTabContent = (tokens: MintToken[]) => {
    // 显示加载状态
    if (loading) {
      return <LoadingSpinner />
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
    }));

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
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4, xl: 4 }}
            spacing={{ base: 6, md: 5, lg: 4 }}
          >
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
                {renderTabContent(tokenList)}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  )
}
