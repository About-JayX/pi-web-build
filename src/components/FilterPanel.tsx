import {
  Flex,
  Icon,
  Button,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'

interface FilterPanelProps {
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  showSortButtons?: boolean
}

const FilterPanel = ({
  sortColumn,
  sortDirection,
  onSort,

  showSortButtons = false,
}: FilterPanelProps) => {
  const buttonBg = useColorModeValue('white', 'gray.700')
  const activeBg = useColorModeValue('gray.100', 'gray.600')
  // const inputBg = useColorModeValue('white', 'gray.800')
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
      pt={{ base: 1, md: 2 }}
    >
      {showSortButtons && (
        <Flex align="center" gap={2} flexWrap="wrap">
          <Text
            fontWeight="medium"
            fontSize="sm"
            whiteSpace="nowrap"
            color="gray.600"
          >
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
                    as={
                      sortDirection === 'asc' ? ChevronUpIcon : ChevronDownIcon
                    }
                  />
                ) : undefined
              }
              onClick={() => onSort(option.column)}
              bg={sortColumn === option.column ? activeBg : buttonBg}
              borderColor={
                sortColumn === option.column ? 'brand.primary' : 'gray.200'
              }
              color={
                sortColumn === option.column ? 'brand.primary' : 'gray.600'
              }
              _hover={{ borderColor: 'brand.primary', color: 'brand.primary' }}
              transition="all 0.2s ease"
              fontWeight={sortColumn === option.column ? 'semibold' : 'normal'}
              boxShadow={sortColumn === option.column ? 'sm' : 'none'}
            >
              {option.label}
            </Button>
          ))}
        </Flex>
      )}
    </Flex>
  )
}

export default FilterPanel
