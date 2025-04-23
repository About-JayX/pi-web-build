import {
  Flex,
  Text,
  HStack,
  Select,
  ButtonGroup,
  IconButton,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useRef, useEffect } from 'react'

interface PaginationControlProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
}

const PaginationControl = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [12, 24, 36, 48, 96],
}: PaginationControlProps) => {
  const { t } = useTranslation()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const activeColor = 'brand.primary'
  
  // 跟踪页面更改的ref
  const pageChangeRef = useRef<number | null>(null);
  
  // 当页面更改时使用useEffect来滚动
  useEffect(() => {
    if (pageChangeRef.current !== null) {
      // 立即滚动到顶部
      window.scrollTo(0, 0);
      // 重置ref
      pageChangeRef.current = null;
    }
  }, [currentPage, pageSize]);

  // 处理分页点击并确保滚动到顶部
  const handlePageClick = (newPage: number) => {
    // 设置标记，表示页面已更改
    pageChangeRef.current = newPage;
    
    // 首先尝试立即滚动到顶部
    window.scrollTo(0, 0);
    
    // 调用父组件的回调
    onPageChange(newPage);
    
    // 使用多个setTimeout确保在不同时间点尝试滚动，覆盖各种可能的数据加载和渲染时机
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
    
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 300);
    
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 500);
  }
  
  // 处理每页数量变化
  const handlePageSizeChange = (newSize: number) => {
    // 设置标记，表示页面大小已更改
    pageChangeRef.current = 0;
    
    // 调用父组件的回调
    onPageSizeChange(newSize);
  }

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      mt={8}
      mb={4}
      flexDir={{ base: 'column', md: 'row' }}
      gap={{ base: 3, md: 4 }}
      px={{ base: 3, md: 4 }}
      py={{ base: 3, md: 4 }}
      bg={bg}
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <HStack spacing={3} w={{ base: '100%', md: 'auto' }} justifyContent={{ base: 'center', md: 'flex-start' }}>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          {t('itemsPerPage')}:
        </Text>
        <Select
          value={pageSize}
          onChange={e => handlePageSizeChange(Number(e.target.value))}
          size="sm"
          w="80px"
          borderColor={borderColor}
          _hover={{ borderColor: activeColor }}
          _focus={{
            borderColor: activeColor,
            boxShadow: `0 0 0 1px var(--chakra-colors-brand-primary)`,
          }}
          borderRadius="md"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </HStack>

      <Flex 
        direction="row" 
        w={{ base: '100%', md: 'auto' }} 
        gap={3} 
        alignItems="center" 
        justifyContent={{ base: 'center', md: 'flex-end' }}
      >
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          {t('currentPage').replace('{current}', currentPage.toString())}
        </Text>
        
        <ButtonGroup 
          isAttached 
          variant="outline" 
          size="sm" 
          alignSelf={{ base: 'center', md: 'auto' }}
          width={{ base: 'fit-content', md: 'auto' }}
        >
          <IconButton
            aria-label={t('prevPage')}
            icon={<Icon as={FaChevronLeft} fontSize="13px" />}
            onClick={() => handlePageClick(currentPage - 1)}
            isDisabled={currentPage <= 1}
            colorScheme="purple"
            borderColor={borderColor}
            _hover={{ bg: 'purple.50' }}
            _active={{ bg: 'purple.100' }}
            borderLeftRadius="md"
            transition="all 0.2s"
          />
          <IconButton
            aria-label={t('nextPage')}
            icon={<Icon as={FaChevronRight} fontSize="13px" />}
            onClick={() => handlePageClick(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
            colorScheme="purple"
            borderColor={borderColor}
            _hover={{ bg: 'purple.50' }}
            _active={{ bg: 'purple.100' }}
            borderRightRadius="md"
            transition="all 0.2s"
          />
        </ButtonGroup>
      </Flex>
    </Flex>
  )
}

export default PaginationControl 