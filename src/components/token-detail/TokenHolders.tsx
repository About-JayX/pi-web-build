'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Icon,
  Badge,
  SimpleGrid,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Flex,
  IconButton,
  Card,
  CardBody,
  Progress,
  Input,
  Button,
  useNumberInput,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FaUsers, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { TokenHolder } from '@/mock';
import { useTranslation } from 'react-i18next';

interface TokenHoldersProps {
  holders: TokenHolder[];
  tokenSymbol: string;
}

export default function TokenHolders({ holders, tokenSymbol }: TokenHoldersProps) {
  // 持有人列表分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const { t } = useTranslation();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const softBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const secondaryText = useColorModeValue('gray.600', 'gray.400');
  const progressColor = useColorModeValue('brand.primary', 'brand.light');
  const progressTrackColor = useColorModeValue('purple.100', 'purple.800');
  
  // 找出最大持有比例作为基准值
  const maxPercentage = useMemo(() => {
    if (holders.length === 0) return 1;
    return holders[0].percentage; // 假设holders已经按持有比例降序排序
  }, [holders]);
  
  // 分页处理持有人数据
  const paginatedHolders = holders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // 计算总页数
  const totalPages = Math.ceil(holders.length / pageSize);
  
  // 页码变化处理
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // 页面大小变化处理
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理页码输入
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      setCurrentPage(value);
    }
  };
  
  // 持有人分页控制组件 - 全新设计
  const PaginationControl = () => (
    <Flex 
      direction={{ base: "column", md: "row" }}
      justify={{ base: "center", md: "space-between" }} 
      align={{ base: "center", md: "center" }}
      mt={{ base: 6, md: 4 }}
      gap={{ base: 3, md: 2 }}
      width="100%"
    >
      {/* 页码选择和显示信息 */}
      <HStack spacing={{ base: 2, md: 3 }} fontSize="sm" width={{ base: "100%", md: "auto" }}>
        <Text color={secondaryText} fontSize={{ base: "xs", md: "sm" }}>{t('itemsPerPage')}:</Text>
        <Select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          size="sm"
          width={{ base: "70px", md: "80px" }}
          borderColor="purple.200"
          borderRadius="md"
          bg="white"
          fontSize={{ base: "xs", md: "sm" }}
        >
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </Select>
        
        <Text color={secondaryText} fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", sm: "block" }}>
          {t('totalItems').replace('{total}', holders.length.toString())}
        </Text>
      </HStack>

      {/* 分页导航按钮 */}
      <HStack spacing={{ base: 1, md: 2 }} width={{ base: "100%", md: "auto" }} justify="center">
        {/* 页码信息显示 - 移动端 */}
        <Text 
          display={{ base: "block", sm: "none" }} 
          fontSize="xs" 
          color={secondaryText}
          bg="purple.50"
          px={2}
          py={1}
          borderRadius="md"
        >
          {t('pageInfo').replace('{current}', currentPage.toString()).replace('{total}', totalPages.toString())}
        </Text>
        
        {/* 首页按钮 */}
        <IconButton
          aria-label={t('firstPage')}
          icon={<FaAngleDoubleLeft />}
          size="sm"
          colorScheme="purple"
          variant="ghost"
          isDisabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        />
        
        {/* 上一页按钮 */}
        <IconButton
          aria-label={t('prevPage')}
          icon={<FaChevronLeft />}
          size="sm"
          colorScheme="purple"
          variant="ghost"
          isDisabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        
        {/* 页码输入和显示 - 桌面端 */}
        <HStack spacing={1} display={{ base: "none", sm: "flex" }}>
          <InputGroup size="sm" width="120px">
            <Input
              value={currentPage}
              onChange={handlePageInputChange}
              textAlign="center"
              borderColor="purple.200"
              _hover={{ borderColor: "purple.300" }}
              _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)" }}
              min={1}
              max={totalPages}
              type="number"
            />
            <InputRightElement width="4rem" pr={1}>
              <Text fontSize="xs" color={secondaryText}>/ {totalPages}</Text>
            </InputRightElement>
          </InputGroup>
        </HStack>
        
        {/* 下一页按钮 */}
        <IconButton
          aria-label={t('nextPage')}
          icon={<FaChevronRight />}
          size="sm"
          colorScheme="purple"
          variant="ghost"
          isDisabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
        
        {/* 末页按钮 */}
        <IconButton
          aria-label={t('lastPage')}
          icon={<FaAngleDoubleRight />}
          size="sm"
          colorScheme="purple"
          variant="ghost"
          isDisabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        />
      </HStack>
    </Flex>
  );
  
  return (
    <Card 
      bg={cardBg} 
      boxShadow="md" 
      borderRadius="lg" 
      overflow="hidden" 
      width="100%"
    >
      <CardBody p={{ base: 3, md: 5 }} width="100%">
        <VStack spacing={{ base: 3, md: 4 }} align="stretch" width="100%">
          <HStack justify="space-between">
            <HStack>
              <Icon as={FaUsers} color="brand.primary" mr={1} boxSize={{ base: "14px", md: "16px" }} />
              <Heading as="h2" size={{ base: "sm", md: "md" }}>{t('holdersDistribution')} ({holders.length})</Heading>
            </HStack>
            
            {/* 移动端显示当前范围 */}
            <Text fontSize="2xs" color={secondaryText} display={{ base: "block", sm: "none" }}>
              {t('showingRange').replace('{start}', ((currentPage - 1) * pageSize + 1).toString())
                               .replace('{end}', Math.min(currentPage * pageSize, holders.length).toString())}
            </Text>
            
            {/* 桌面端显示当前范围 */}
            <Text fontSize="xs" color={secondaryText} display={{ base: "none", sm: "block" }}>
              {t('showingRange').replace('{start}', ((currentPage - 1) * pageSize + 1).toString())
                                .replace('{end}', Math.min(currentPage * pageSize, holders.length).toString())}
            </Text>
          </HStack>
          
          <Box 
            borderRadius="md"
            overflow={{ base: "auto", md: "hidden" }}
            borderWidth="1px"
            borderColor={borderColor}
            width="100%"
            bg={cardBg}
          >
            <TableContainer width="100%">
              <Table variant="simple" size="sm" width="100%">
                <Thead>
                  <Tr bg={softBg}>
                    <Th width={{ base: "40px", md: "60px" }} textAlign="center" py={{ base: 2, md: 3 }} fontSize={{ base: "xs", md: "sm" }}>#</Th>
                    <Th py={{ base: 2, md: 3 }} fontSize={{ base: "xs", md: "sm" }}>{t('address')}</Th>
                    <Th py={{ base: 2, md: 3 }} width={{ base: "90px", md: "30%" }} fontSize={{ base: "xs", md: "sm" }}>{t('holdingRatio')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedHolders.map((holder, index) => (
                    <Tr key={index} 
                      _hover={{ bg: softBg }} 
                      borderTopWidth="1px" 
                      borderColor={borderColor}
                    >
                      <Td py={{ base: 2, md: 2 }} textAlign="center" fontWeight="medium" color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
                        {(currentPage - 1) * pageSize + index + 1}.
                      </Td>
                      <Td py={{ base: 2, md: 2 }}>
                        <Text 
                          fontFamily="mono" 
                          fontSize={{ base: "2xs", md: "sm" }}
                          fontWeight="medium"
                          noOfLines={1}
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {holder.address && holder.address.length > 40 
                            ? `${holder.address.substring(0, 8)}...${holder.address.substring(holder.address.length - 8)}`
                            : holder.address
                          }
                        </Text>
                      </Td>
                      <Td py={{ base: 2, md: 2 }}>
                        <VStack spacing={1} align="stretch">
                          <Progress 
                            value={(holder.percentage / maxPercentage) * 100}
                            size="sm"
                            colorScheme="purple"
                            borderRadius="full"
                            bg={progressTrackColor}
                            hasStripe={true}
                          />
                          <Text 
                            fontSize={{ base: "2xs", md: "xs" }} 
                            fontWeight="bold" 
                            color="brand.primary" 
                            textAlign="right"
                          >
                            {holder.percentage}%
                          </Text>
                        </VStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          
          {/* 分页控制 */}
          <PaginationControl />
        </VStack>
      </CardBody>
    </Card>
  );
} 