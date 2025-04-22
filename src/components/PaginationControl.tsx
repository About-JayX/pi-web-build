import {
  Flex,
  Text,
  HStack,
  Select,
  Input,
  ButtonGroup,
  IconButton,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

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
  const [pageInput, setPageInput] = useState(currentPage.toString())

  // 页码变化时更新输入框
  useEffect(() => {
    setPageInput(currentPage.toString())
  }, [currentPage])

  // 处理页码输入框变化
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 只允许输入数字
    if (/^\d*$/.test(value)) {
      setPageInput(value)
    }
  }

  // 处理页码输入框回车事件
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput)
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange(page)
      } else {
        // 如果输入无效，恢复为当前页码
        setPageInput(currentPage.toString())
      }
    }
  }

  // 处理输入框失焦事件
  const handlePageInputBlur = () => {
    const page = parseInt(pageInput)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page)
    } else {
      // 如果输入无效，恢复为当前页码
      setPageInput(currentPage.toString())
    }
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
          onChange={e => onPageSizeChange(Number(e.target.value))}
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
        direction={{ base: 'column', sm: 'row' }} 
        w={{ base: '100%', md: 'auto' }} 
        gap={3} 
        alignItems="center" 
        justifyContent={{ base: 'center', md: 'flex-end' }}
      >
        <HStack spacing={2} justifyContent={{ base: 'center', md: 'flex-start' }}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {t('goToPage')}:
          </Text>
          <Input
            size="sm"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown}
            onBlur={handlePageInputBlur}
            textAlign="center"
            w="45px"
            borderColor={borderColor}
            _hover={{ borderColor: activeColor }}
            _focus={{
              borderColor: activeColor,
              boxShadow: `0 0 0 1px var(--chakra-colors-brand-primary)`,
            }}
            borderRadius="md"
          />
        </HStack>
        
        <ButtonGroup 
          isAttached 
          variant="outline" 
          size="sm" 
          alignSelf={{ base: 'center', md: 'auto' }}
          width={{ base: 'fit-content', md: 'auto' }}
        >
          <IconButton
            aria-label={t('firstPage')}
            icon={<Icon as={FaChevronLeft} fontSize="10px" />}
            onClick={() => onPageChange(1)}
            isDisabled={currentPage <= 1}
            colorScheme="purple"
            borderColor={borderColor}
            _hover={{ bg: 'purple.50' }}
            _active={{ bg: 'purple.100' }}
            borderLeftRadius="md"
            size="sm"
            borderRight="0"
            transition="all 0.2s"
          />
          <IconButton
            aria-label={t('prevPage')}
            icon={<Icon as={FaChevronLeft} fontSize="13px" />}
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage <= 1}
            colorScheme="purple"
            borderColor={borderColor}
            _hover={{ bg: 'purple.50' }}
            _active={{ bg: 'purple.100' }}
            borderRadius="0"
            transition="all 0.2s"
          />
          <IconButton
            aria-label={t('nextPage')}
            icon={<Icon as={FaChevronRight} fontSize="13px" />}
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
            colorScheme="purple"
            borderColor={borderColor}
            _hover={{ bg: 'purple.50' }}
            _active={{ bg: 'purple.100' }}
            borderRadius="0"
            transition="all 0.2s"
          />
          <IconButton
            aria-label={t('lastPage')}
            icon={<Icon as={FaChevronRight} fontSize="10px" />}
            onClick={() => onPageChange(totalPages)}
            isDisabled={currentPage >= totalPages}
            colorScheme="purple"
            borderColor={borderColor}
            _hover={{ bg: 'purple.50' }}
            _active={{ bg: 'purple.100' }}
            borderRightRadius="md"
            size="sm"
            borderLeft="0"
            transition="all 0.2s"
          />
        </ButtonGroup>
      </Flex>
    </Flex>
  )
}

export default PaginationControl 