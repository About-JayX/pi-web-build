'use client';

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
  Card,
  CardBody,
  Divider,
  Badge,
  Button,
  useColorModeValue,
  Flex,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
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
  Spacer,
  useToast,
  Select,
  IconButton
} from '@chakra-ui/react'
import { FaUsers, FaCalendarAlt, FaChartPie, FaThLarge, FaList, FaSort, FaSearch, FaGlobe, FaTwitter, FaTelegram, FaShareAlt, FaFileContract, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import NextLink from 'next/link'
import { mintingTokensPi, mintingTokensSol } from '@/mock'
import { useState, useEffect, useMemo } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import { useNetwork } from '@/contexts/NetworkContext'
import MintingTokenCard from '@/components/MintingTokenCard'
import { useTranslation } from 'react-i18next'

// 排序指示器组件
function SortIndicator({ column, sortColumn, sortDirection }: { 
  column: string, 
  sortColumn: string, 
  sortDirection: 'asc' | 'desc' 
}) {
  if (sortColumn !== column) {
    return (
      <Box as="span" ml={1} color="gray.400" opacity={0.6}>
        <Icon as={FaSort} fontSize="xs" />
      </Box>
    );
  }
  return (
    <Box as="span" ml={1} color="brand.primary">
      <Icon 
        as={sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon} 
        fontSize="sm" 
      />
    </Box>
  );
}

// 列表视图组件
function TokenListView({ tokens, sortColumn, sortDirection, onSort, currencyUnit }: { 
  tokens: any[], 
  sortColumn: string, 
  sortDirection: 'asc' | 'desc',
  onSort: (column: string) => void,
  currencyUnit?: string
}) {
  const router = useRouter()
  const bg = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const thBg = useColorModeValue('gray.50', 'gray.700')
  const thHoverBg = useColorModeValue('gray.100', 'gray.600')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const iconColor = useColorModeValue('gray.600', 'gray.400')
  const iconHoverColor = useColorModeValue('brand.primary', 'brand.light')
  const toast = useToast()
  const { t } = useTranslation()
  
  // 跳转到代币铸造页面
  const navigateToMintPage = (contractAddress: string) => {
    router.push(`/mint/${contractAddress}`)
  }
  
  // 缩略显示合约地址
  const formatContractAddress = (address: string) => {
    if (!address) return '';
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };
  
  // 分享功能处理
  const handleShare = (token: any) => {
    if (navigator.share) {
      navigator.share({
        title: `${token.name} (${token.symbol})`,
        text: `${t('share')} ${token.name} ${t('token')}`,
        url: window.location.origin + `/mint/${token.contractAddress}`
      })
      .catch((error) => console.log(`${t('share')} ${t('failed')}:`, error));
    } else {
      // 如果浏览器不支持，可以复制链接到剪贴板
      const url = window.location.origin + `/mint/${token.contractAddress}`;
      navigator.clipboard.writeText(url)
        .then(() => toast({
          title: t('copySuccess'),
          description: t('copyLinkSuccess'),
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top"
        }))
        .catch((error) => console.log(`${t('copy')} ${t('failed')}:`, error));
    }
  };

  // 复制合约地址
  const copyContractAddress = (address: string) => {
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => toast({
          title: t('copySuccess'),
          description: t('copyAddressSuccess'),
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top"
        }))
        .catch(err => console.error(`${t('copy')} ${t('failed')}:`, err));
    }
  };

  const ThSortable = ({ column, children }: { column: string, children: React.ReactNode }) => (
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
        <SortIndicator column={column} sortColumn={sortColumn} sortDirection={sortDirection} />
      </Flex>
    </Th>
  );

  return (
    <TableContainer bg={bg} borderRadius="lg" boxShadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">{t('tokenColumn')}</Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">{t('contractAddressColumn')}</Th>
            <ThSortable column="totalSupply">{t('totalSupplyColumn')}</ThSortable>
            <ThSortable column="raised">{t('amountColumn')}</ThSortable>
            <ThSortable column="progress">{t('progressColumn')}</ThSortable>
            <ThSortable column="participants">{t('participantsColumn')}</ThSortable>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">{t('priceColumn')}</Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">{t('linksColumn')}</Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokens.map(token => (
            <Tr 
              key={token.id} 
              _hover={{ bg: hoverBg, cursor: 'pointer' }}
              onClick={(e) => {
                // 防止点击链接和按钮时触发行的点击事件
                if ((e.target as HTMLElement).tagName !== 'A' && 
                    !(e.target as HTMLElement).closest('a') &&
                    !(e.target as HTMLElement).closest('button')) {
                  navigateToMintPage(token.contractAddress)
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
                {token.contractAddress && (
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
                    title={token.contractAddress}
                    cursor="pointer"
                    width="fit-content"
                    onClick={() => copyContractAddress(token.contractAddress)}
                    _hover={{
                      bg: "gray.100",
                      borderColor: "brand.primary"
                    }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaFileContract} mr={1} fontSize="10px" />
                    {formatContractAddress(token.contractAddress)}
                  </Box>
                )}
              </Td>
              <Td textAlign="center">{token.totalSupply}</Td>
              <Td>
                <VStack spacing={1} align="center">
                  <Text fontSize="xs" color="gray.500">{t('target')}: {token.target}</Text>
                  <Text fontWeight="bold" color="brand.primary" fontSize="sm">{t('raised')}: {token.raised}</Text>
                </VStack>
              </Td>
              <Td>
                <HStack width="120px" justifyContent="center">
                  <Progress 
                    value={token.progress} 
                    colorScheme="purple" 
                    borderRadius="full" 
                    size="sm"
                    width="80px"
                  />
                  <Text fontSize="sm">{token.progress}%</Text>
                </HStack>
              </Td>
              <Td textAlign="center">{token.participants}</Td>
              <Td textAlign="center">
                {token.presaleRate && (
                  <Text fontWeight="medium" textAlign="center">
                    {token.presaleRate}
                  </Text>
                )}
              </Td>
              <Td>
                <HStack spacing={3} justify="center">
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
                  href={`/mint/${token.contractAddress}`}
                  colorScheme="purple" 
                  size="sm"
                  bg="brand.primary"
                  _hover={{ bg: 'brand.light' }}
                >
                  {t('joinMinting')}
                </Button>
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
  onSearchChange
}: {
  sortColumn: string, 
  sortDirection: 'asc' | 'desc',
  onSort: (column: string) => void,
  searchQuery: string,
  onSearchChange: (value: string) => void
}) {
  const buttonBg = useColorModeValue('white', 'gray.700');
  const activeBg = useColorModeValue('gray.100', 'gray.600');
  const inputBg = useColorModeValue('white', 'gray.800');
  const { t } = useTranslation();
  
  const sortOptions = [
    { label: t('participantsSort'), column: 'participants' },
    { label: t('progressSort'), column: 'progress' },
    { label: t('raisedSort'), column: 'raised' },
    { label: t('targetSort'), column: 'target' }
  ];

  return (
    <Flex 
      align="center" 
      mb={4} 
      gap={3} 
      flexWrap={{ base: 'wrap', md: 'nowrap' }}
      justifyContent="space-between"
    >
      <InputGroup maxW={{ base: '100%', md: '300px' }} mb={{ base: 2, md: 0 }}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
        <Input 
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          bg={inputBg}
          borderColor="gray.300"
          _hover={{ borderColor: 'brand.primary' }}
          _focus={{ borderColor: 'brand.primary', boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)' }}
        />
      </InputGroup>
      
      <Flex align="center" gap={2} flexWrap="wrap">
        <Text fontWeight="medium" fontSize="sm" whiteSpace="nowrap">{t('sortBy')}</Text>
        {sortOptions.map((option) => (
          <Button 
            key={option.column}
            size="sm" 
            variant="outline"
            rightIcon={
              sortColumn === option.column 
                ? <Icon as={sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon} /> 
                : undefined
            }
            onClick={() => onSort(option.column)}
            bg={sortColumn === option.column ? activeBg : buttonBg}
            borderColor={sortColumn === option.column ? 'brand.primary' : 'gray.200'}
            color={sortColumn === option.column ? 'brand.primary' : 'gray.600'}
            _hover={{ borderColor: 'brand.primary', color: 'brand.primary' }}
          >
            {option.label}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}

// 添加一个新的分页控制组件
function PaginationControl({ 
  currentPage, 
  totalPages, 
  onPageChange,
  pageSize,
  onPageSizeChange
}: { 
  currentPage: number, 
  totalPages: number, 
  onPageChange: (page: number) => void,
  pageSize: number,
  onPageSizeChange: (size: number) => void
}) {
  const pageSizeOptions = [12, 24, 36, 48, 96];
  const { t } = useTranslation();
  
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
        <Text fontSize="sm" fontWeight="medium">{t('itemsPerPage')}:</Text>
        <Select 
          value={pageSize} 
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          size="sm"
          w="80px"
          borderColor="gray.300"
          _hover={{ borderColor: 'brand.primary' }}
          _focus={{ borderColor: 'brand.primary', boxShadow: '0 0 0 1px var(--chakra-colors-brand-primary)' }}
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
          {t('pageInfo').replace('{current}', currentPage.toString()).replace('{total}', totalPages.toString())}
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
  );
}

export default function MintPage() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [sortColumn, setSortColumn] = useState<string>('progress');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [tabIndex, setTabIndex] = useState<number>(0);
  
  // 获取当前网络上下文
  const { network } = useNetwork();
  
  // 获取翻译函数
  const { t } = useTranslation();
  
  // 根据当前网络选择数据集和货币单位
  const tokensData = useMemo(() => {
    if (network === 'Solana') {
      return mintingTokensSol;
    } else {
      return mintingTokensPi;
    }
  }, [network]);
  
  // 设置当前网络的计价单位
  const currencyUnit = useMemo(() => {
    return network === 'Solana' ? 'SOL' : 'Pi';
  }, [network]);
  
  // 从本地存储加载视图模式和标签页选择
  useEffect(() => {
    // 确保只在客户端执行
    if (typeof window !== 'undefined') {
      // 加载视图模式选择
      const savedViewMode = localStorage.getItem('mint_view_mode');
      if (savedViewMode && (savedViewMode === 'card' || savedViewMode === 'list')) {
        setViewMode(savedViewMode as 'card' | 'list');
      }
      
      // 加载标签页选择
      const savedTabIndex = localStorage.getItem('mint_tab_index');
      if (savedTabIndex && !isNaN(Number(savedTabIndex))) {
        setTabIndex(Number(savedTabIndex));
      }
    }
  }, []);
  
  // 保存视图模式到本地存储
  const handleViewModeChange = (mode: 'card' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('mint_view_mode', mode);
  };
  
  // 保存标签页选择到本地存储
  const handleTabChange = (index: number) => {
    setTabIndex(index);
    localStorage.setItem('mint_tab_index', String(index));
  };
  
  // 移除已完成铸造的代币（进度100%）
  const activeTokens = tokensData.filter(token => token.progress < 100);
  
  // 获取最新部署的代币（按deployedAt倒序排列）
  const latestDeployedTokens = useMemo(() => {
    return [...activeTokens]
      .sort((a, b) => {
        // 如果没有deployedAt字段或值为空，将其放在最后
        if (!a.deployedAt) return 1;
        if (!b.deployedAt) return -1;
        // 倒序排列，最新的在前面
        return b.deployedAt - a.deployedAt;
      });
  }, [activeTokens]);
  
  // 共享排序逻辑
  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortColumn(column);
    setSortDirection(newDirection);
  };
  
  // 搜索过滤逻辑
  const filterTokensBySearch = (tokens: any[]) => {
    if (!searchQuery.trim()) return tokens;
    
    const query = searchQuery.toLowerCase().trim();
    return tokens.filter(token => 
      token.name.toLowerCase().includes(query) || 
      token.symbol.toLowerCase().includes(query) ||
      (token.contractAddress && token.contractAddress.toLowerCase().includes(query))
    );
  };
  
  // 对数据进行排序
  const getSortedTokens = (tokens: any[]) => {
    return [...tokens].sort((a, b) => {
      if (sortColumn === 'totalSupply' || sortColumn === 'target' || sortColumn === 'raised') {
        // 移除非数字字符并转换为数字
        const aValue = parseFloat(a[sortColumn].replace(/[^0-9.]/g, ''));
        const bValue = parseFloat(b[sortColumn].replace(/[^0-9.]/g, ''));
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        // 数字类型的字段直接比较
        return sortDirection === 'asc' ? a[sortColumn] - b[sortColumn] : b[sortColumn] - a[sortColumn];
      }
    });
  };
  
  // 处理分页逻辑
  const paginateTokens = (tokens: any[]) => {
    const startIndex = (currentPage - 1) * pageSize;
    return tokens.slice(startIndex, startIndex + pageSize);
  };
  
  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // 滚动到页面顶部以便看到新内容
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 处理每页显示数量变化
  const handlePageSizeChange = (newSize: number) => {
    // 调整当前页以保持项目连续性
    const firstItemIndex = (currentPage - 1) * pageSize;
    const newCurrentPage = Math.floor(firstItemIndex / newSize) + 1;
    
    setPageSize(newSize);
    setCurrentPage(newCurrentPage);
  };

  // 当筛选或排序条件变化时，重置为第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [sortColumn, sortDirection, searchQuery]);

  const renderTabContent = (tokens: any[], isLatestDeployed = false) => {
    // 先过滤搜索结果，再排序
    const filteredTokens = filterTokensBySearch(tokens);
    
    // 如果是最新部署标签页，则直接使用已经按deployedAt排序的代币列表
    const sortedTokens = isLatestDeployed ? filteredTokens : getSortedTokens(filteredTokens);
    
    // 计算总页数
    const totalPages = Math.ceil(sortedTokens.length / pageSize);
    
    // 显示空结果状态
    if (sortedTokens.length === 0) {
      return (
        <Box py={10} textAlign="center">
          <Text color="gray.500" fontSize="lg">{t('noResults')}</Text>
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
      );
    }
    
    // 根据当前页码和每页显示数量来分页
    const paginatedTokens = paginateTokens(sortedTokens);
    
    return (
      <>
        {viewMode === 'card' ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4, xl: 4 }} spacing={{ base: 6, md: 5, lg: 4 }}>
            {paginatedTokens.map(token => (
              <MintingTokenCard key={token.id} token={token} currencyUnit={currencyUnit} />
            ))}
          </SimpleGrid>
        ) : (
          <TokenListView 
            tokens={paginatedTokens} 
            sortColumn={isLatestDeployed ? 'deployedAt' : sortColumn} 
            sortDirection={isLatestDeployed ? 'desc' : sortDirection} 
            onSort={isLatestDeployed ? () => {} : handleSort} 
            currencyUnit={currencyUnit}
          />
        )}
        
        {/* 分页控制器 */}
        {totalPages > 1 && (
          <PaginationControl 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </>
    );
  };

  return (
    <Box>
      <Container maxW="container.xl" py={12}>
        <VStack spacing={10} align="stretch">
          <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }}>
            <Box>
              <Heading as="h2" size="lg" mb={2}>{t('mintingTokens')}</Heading>
              <Text color="gray.500">{t('viewAllTokens')}</Text>
            </Box>
            <ButtonGroup isAttached variant="outline" colorScheme="purple">
              <Button 
                leftIcon={<FaThLarge />}
                variant={viewMode === 'card' ? 'solid' : 'outline'}
                bg={viewMode === 'card' ? 'brand.primary' : undefined}
                color={viewMode === 'card' ? 'white' : 'brand.primary'}
                onClick={() => handleViewModeChange('card')}
              >
                {t('cardView')}
              </Button>
              <Button 
                leftIcon={<FaList />}
                variant={viewMode === 'list' ? 'solid' : 'outline'}
                bg={viewMode === 'list' ? 'brand.primary' : undefined}
                color={viewMode === 'list' ? 'white' : 'brand.primary'}
                onClick={() => handleViewModeChange('list')}
              >
                {t('listView')}
              </Button>
            </ButtonGroup>
          </Stack>
          
          <Tabs 
            colorScheme="purple" 
            variant="enclosed" 
            index={tabIndex} 
            onChange={handleTabChange}
          >
            <TabList 
              borderBottom="2px" 
              borderColor="brand.primary"
              mb={4}
            >
              <Tab 
                fontWeight="medium"
                _selected={{ 
                  color: 'brand.primary', 
                  borderColor: 'brand.primary',
                  borderBottom: '3px solid',
                  fontWeight: 'bold',
                  bg: 'gray.50'
                }}
                _hover={{
                  color: 'brand.primary',
                  borderColor: 'brand.light'
                }}
                transition="all 0.2s"
              >
                {t('hotTokens')}
              </Tab>
              <Tab 
                fontWeight="medium"
                _selected={{ 
                  color: 'brand.primary', 
                  borderColor: 'brand.primary',
                  borderBottom: '3px solid',
                  fontWeight: 'bold',
                  bg: 'gray.50'
                }}
                _hover={{
                  color: 'brand.primary',
                  borderColor: 'brand.light'
                }}
                transition="all 0.2s"
              >
                {t('allMinting')}
              </Tab>
              <Tab 
                fontWeight="medium"
                _selected={{ 
                  color: 'brand.primary', 
                  borderColor: 'brand.primary',
                  borderBottom: '3px solid',
                  fontWeight: 'bold',
                  bg: 'gray.50'
                }}
                _hover={{
                  color: 'brand.primary',
                  borderColor: 'brand.light'
                }}
                transition="all 0.2s"
              >
                {t('latestDeployed')}
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
                {renderTabContent(activeTokens.filter(token => token.participants > 200 && token.progress > 60))}
              </TabPanel>
              
              <TabPanel px={0}>
                <FilterPanel 
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                {renderTabContent(activeTokens)}
              </TabPanel>
              
              <TabPanel px={0}>
                <FilterPanel 
                  sortColumn={"deployedAt"}
                  sortDirection={"desc"}
                  onSort={() => {}} // 禁用排序功能
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
                {renderTabContent(latestDeployedTokens, true)}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  )
} 