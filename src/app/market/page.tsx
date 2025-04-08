'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  InputRightElement,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Badge,
  Image,
  Flex,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  StatArrow,
  Divider,
  Card,
  CardBody,
  Stack,
  ButtonGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  VStack,
  useToast,
  Center,
  Select,
  IconButton
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaFire, FaChartLine, FaArrowUp, FaArrowDown, FaSort, FaSearch, FaGlobe, FaTwitter, FaTelegram, FaShareAlt, FaLayerGroup, FaFileContract, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import NextLink from 'next/link';
import { marketTokens, marketOverview } from '@/mock';
import { useTranslation } from 'react-i18next';

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
function TokenListView({ tokens, sortColumn, sortDirection, onSort }: { 
  tokens: any[], 
  sortColumn: string, 
  sortDirection: 'asc' | 'desc',
  onSort: (column: string) => void 
}) {
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const thBg = useColorModeValue('gray.50', 'gray.700');
  const thHoverBg = useColorModeValue('gray.100', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  const iconHoverColor = useColorModeValue('brand.primary', 'brand.light');
  const toast = useToast();
  const { t } = useTranslation();

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
      textAlign="right"
      isNumeric={true}
    >
      <Flex align="center" justify="flex-end">
        {children}
        <SortIndicator column={column} sortColumn={sortColumn} sortDirection={sortDirection} />
      </Flex>
    </Th>
  );

  // 缩略显示合约地址
  const formatContractAddress = (address: string) => {
    if (!address) return '';
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
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
        .catch(err => console.error(t('failed'), err));
    }
  };

  // 分享功能处理
  const handleShare = (token: any) => {
    if (navigator.share) {
      navigator.share({
        title: `${token.name} (${token.symbol})`,
        text: t('viewTokenMarketInfo', { name: token.name }),
        url: window.location.origin + `/market/${token.id}`
      })
      .catch((error) => console.log(t('shareFailed'), error));
    } else {
      // 如果浏览器不支持，可以复制链接到剪贴板
      const url = window.location.origin + `/market/${token.id}`;
      navigator.clipboard.writeText(url)
        .then(() => toast({
          title: t('linkCopied'),
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top"
        }))
        .catch((error) => console.log(t('copyFailed'), error));
    }
  };

  return (
    <TableContainer bg={bg} borderRadius="lg" boxShadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">{t('tokenColumn')}</Th>
            <ThSortable column="price">{t('priceColumn')}</ThSortable>
            <ThSortable column="change24hValue">{t('change24hColumn')}</ThSortable>
            <ThSortable column="marketCap">{t('marketCapColumn')}</ThSortable>
            <ThSortable column="totalSupply">{t('totalSupplyColumn')}</ThSortable>
            <ThSortable column="volume24h">{t('volumeColumn')}</ThSortable>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary" isNumeric textAlign="right">{t('contractAddressColumn')}</Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary" isNumeric textAlign="right">{t('linksColumn')}</Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokens.map(token => (
            <Tr key={token.id} _hover={{ bg: hoverBg }}>
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
              <Td isNumeric fontWeight="bold">$ {token.price}</Td>
              <Td isNumeric>
                <Flex justify="flex-end">
                  <Text 
                    fontWeight="bold" 
                    color={token.change24hValue > 0 ? "green.500" : "red.500"}
                  >
                    <Icon as={token.change24hValue > 0 ? FaArrowUp : FaArrowDown} boxSize="12px" mr={1} />
                    {Math.abs(token.change24hValue)}%
                  </Text>
                </Flex>
              </Td>
              <Td isNumeric>$ {token.marketCap}</Td>
              <Td isNumeric>{token.totalSupply}</Td>
              <Td isNumeric>$ {token.volume24h}</Td>
              <Td isNumeric>
                {token.contractAddress && (
                  <Box
                    as="button"
                    onClick={() => copyContractAddress(token.contractAddress)}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
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
                    ml="auto"
                    _hover={{
                      bg: "gray.100",
                      borderColor: "brand.primary"
                    }}
                    transition="all 0.2s"
                    title={t('clickToCopyFullAddress')}
                  >
                    <Icon as={FaFileContract} mr={1} fontSize="10px" />
                    {formatContractAddress(token.contractAddress)}
                  </Box>
                )}
              </Td>
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
                  href={`/market/${token.contractAddress}`}
                  colorScheme="purple" 
                  size="sm"
                  bg="brand.primary"
                  _hover={{ bg: 'brand.light' }}
                >
                  {t('detail')}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

// 修改分页导航组件，使其与mint页面的设计保持一致
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
  const pageSizeOptions = [10, 20, 30, 50];
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

export default function MarketPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortColumn(column);
    setSortDirection(newDirection);
    // 排序时重置到第一页
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到页面顶部以便查看新内容
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

  const filteredTokens = marketTokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (token.contractAddress && token.contractAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    const aValue = String(a[sortColumn as keyof typeof a])
    const bValue = String(b[sortColumn as keyof typeof b])
    
    // 处理百分比字符串
    if (sortColumn === 'change24h') {
      const aNum = parseFloat(aValue.replace('%', ''))
      const bNum = parseFloat(bValue.replace('%', ''))
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
    }
    
    // 处理带逗号的数字字符串
    if (['marketCap', 'volume24h'].includes(sortColumn)) {
      const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ''))
      const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ''))
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
    }
    
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue)
  });

  // 计算总页数
  const totalPages = Math.ceil(sortedTokens.length / pageSize);
  
  // 分页后的代币数据
  const paginatedTokens = sortedTokens.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 当搜索结果改变时，如果当前页已经超出了总页数，则回到第一页
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  // 搜索、排序条件变化时重置为第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [sortColumn, sortDirection, searchTerm]);

  return (
    <Box>
      {/* 页面标题 */}
      <Container maxW="container.xl" py={12}>
        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }}>
          <Box>
            <Heading as="h2" size="lg" mb={2}>{t('marketTitle')}</Heading>
            <Text color="gray.500">{t('marketDescription')}</Text>
          </Box>
        </Stack>

        {/* 市场统计 */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10} mt={10}>
          <Box
            px={5}
            py={4}
            position="relative"
            overflow="hidden"
            shadow={'xl'}
            borderRadius={'xl'}
            bgGradient={useColorModeValue(
              'linear(to-br, blue.50, purple.50)',
              'linear(to-br, blue.900, purple.900)'
            )}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: 'xl',
            }}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              bgGradient: 'linear(to-r, blue.400, purple.400)'
            }}
          >
            <Flex mb={2} justify="space-between" align="center">
              <Text fontWeight="bold" fontSize="md" color={useColorModeValue('gray.600', 'gray.300')}>
                {t('totalTokens')}
              </Text>
              <Icon as={FaLayerGroup} boxSize={7} color="blue.400" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" color={useColorModeValue('blue.600', 'blue.300')}>
              {marketOverview.totalTokens}
            </Text>
          </Box>
          
          <Box
            px={5}
            py={4}
            position="relative"
            overflow="hidden"
            shadow={'xl'}
            borderRadius={'xl'}
            bgGradient={useColorModeValue(
              'linear(to-br, green.50, teal.50)',
              'linear(to-br, green.900, teal.900)'
            )}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: 'xl',
            }}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              bgGradient: 'linear(to-r, green.400, teal.400)'
            }}
          >
            <Flex mb={2} justify="space-between" align="center">
              <Text fontWeight="bold" fontSize="md" color={useColorModeValue('gray.600', 'gray.300')}>
                {t('totalMarketCap')}
              </Text>
              <Icon as={FaChartLine} boxSize={7} color="green.400" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" color={useColorModeValue('green.600', 'green.300')}>
              $ {marketOverview.totalMarketCap}
            </Text>
          </Box>
          
          <Box
            px={5}
            py={4}
            position="relative"
            overflow="hidden"
            shadow={'xl'}
            borderRadius={'xl'}
            bgGradient={useColorModeValue(
              'linear(to-br, orange.50, red.50)',
              'linear(to-br, orange.900, red.900)'
            )}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: 'xl',
            }}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              bgGradient: 'linear(to-r, orange.400, red.400)'
            }}
          >
            <Flex mb={2} justify="space-between" align="center">
              <Text fontWeight="bold" fontSize="md" color={useColorModeValue('gray.600', 'gray.300')}>
                {t('totalVolume24h')}
              </Text>
              <Icon as={FaFire} boxSize={7} color="orange.400" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" color={useColorModeValue('orange.600', 'orange.300')}>
              $ {marketOverview.totalVolume24h}
            </Text>
          </Box>
        </SimpleGrid>
      
        <Tabs variant="soft-rounded" colorScheme="brand" mb={6} defaultIndex={1}>
          <Flex 
            width="100%" 
            justifyContent="space-between" 
            alignItems="center" 
            mb={4}
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 4, md: 0 }}
          >
            <TabList 
              width={{ base: '100%', md: 'auto' }}
              overflowX={{ base: 'auto', md: 'visible' }}
              py={2}
            >
              <Tab _selected={{ color: 'white', bg: 'brand.primary' }}><Icon as={FaChartLine} mr={2} /> {t('marketCapRanking')}</Tab>
              <Tab _selected={{ color: 'white', bg: 'brand.primary' }}><Icon as={FaFire} mr={2} /> {t('hotTokens')}</Tab>
            </TabList>
            
            <InputGroup maxW={{ base: '100%', md: '300px' }}>
              <InputLeftElement pointerEvents='none'>
                <SearchIcon color='gray.300' />
              </InputLeftElement>
              <Input 
                placeholder={t('searchNameSymbolAddress')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // 在搜索时重置到第一页
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <InputRightElement>
                  <Button 
                    size='sm' 
                    onClick={() => {
                      setSearchTerm('');
                      // 清空搜索时重置到第一页
                      setCurrentPage(1);
                    }} 
                    variant="ghost"
                  >
                    ×
                  </Button>
                </InputRightElement>
              )}
            </InputGroup>
          </Flex>
          
          <TabPanels>
            {/* 市值排行 */}
            <TabPanel px={0}>
              <TokenListView 
                tokens={paginatedTokens} 
                sortColumn={sortColumn} 
                sortDirection={sortDirection} 
                onSort={handleSort} 
              />
              
              {/* 分页控制 */}
              {totalPages > 1 && (
                <PaginationControl 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
              
              {/* 显示结果信息 */}
              <Center mt={4} mb={4}>
                <Text fontSize="sm" color="gray.500">
                  {t('totalResults').replace('{count}', filteredTokens.length.toString())}
                </Text>
              </Center>
            </TabPanel>
            
            {/* 热门代币 */}
            <TabPanel px={0}>
              <TokenListView 
                tokens={sortedTokens
                  .filter(token => {
                    // 移除逗号并转为数字，比较市值是否超过50,000
                    const marketCapValue = parseFloat(token.marketCap.replace(/,/g, ''));
                    return marketCapValue > 50000;
                  })
                  .sort((a, b) => {
                    // 根据交易量排序（降序）
                    const volumeA = parseFloat(a.volume24h.replace(/,/g, ''));
                    const volumeB = parseFloat(b.volume24h.replace(/,/g, ''));
                    return volumeB - volumeA;
                  })
                  .slice(0, 10)}
                sortColumn={sortColumn} 
                sortDirection={sortDirection} 
                onSort={handleSort} 
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
} 