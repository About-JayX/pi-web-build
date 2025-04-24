import React, { useState } from 'react'
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
  Button,
  Link,
  Tooltip,
  IconButton,
} from '@chakra-ui/react'
import { FaSort, FaFileContract, FaShareAlt, FaUser, FaGlobe, FaTwitter, FaTelegram } from 'react-icons/fa'
import { ChevronUpIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { formatTokenAmount } from '@/utils'
import { useCallback } from 'react'
import { useMintingCalculations } from '@/hooks/useMintingCalculations'
import { MintToken } from '@/api/types'
import { useNetwork } from '@/contexts/NetworkContext'
import { IconType } from 'react-icons'
import { ShareModal } from './index'

interface TokenListViewProps {
  tokens: MintToken[]
  sortColumn: string
  sortDirection: 'ASC' | 'DESC'
  onSort: (column: string) => void
  currencyUnit: string
}

// 定义UI中使用的社交媒体链接类型
interface SocialLinkDisplay {
  platform: string;
  link: string;
  icon: IconType;
}

// 排序指示器组件
function SortIndicator({
  column,
  sortColumn,
  sortDirection,
}: {
  column: string
  sortColumn: string
  sortDirection: 'ASC' | 'DESC'
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
        as={sortDirection === 'ASC' ? ChevronUpIcon : ChevronDownIcon}
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
  const toast = useToast()
  const { t } = useTranslation()
  const { network } = useNetwork()
  
  // 用于管理分享弹窗
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareToken, setShareToken] = useState<MintToken | null>(null);
  
  const bg = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const thBg = useColorModeValue('gray.50', 'gray.700')
  const thHoverBg = useColorModeValue('gray.100', 'gray.600')
  const iconColor = useColorModeValue('gray.600', 'gray.400')
  const iconHoverColor = useColorModeValue('brand.primary', 'brand.light')

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
      const rate = getFormattedMintRate({
        totalSupply: token.totalSupply,
        target: token.target,
        currencyUnit,
        tokenDecimals: token.tokenDecimal || 6,
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
    const start = address.substring(0, 4)
    const end = address.substring(address.length - 4)
    return `${start}...${end}`
  }

  // 分享功能处理
  const handleShare = (token: MintToken) => {
    // 设置当前分享的代币并打开弹窗
    setShareToken(token);
    setIsShareModalOpen(true);
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

  // 计算已筹集的金额
  const getCollectedAmount = (token: MintToken) => {
    if (!token.target || !token.progress) return '0'
    // 从target中提取数字部分
    const targetMatch = token.target.match(/[0-9.]+/)
    if (!targetMatch) return '0'
    const targetAmount = parseFloat(targetMatch[0])
    // 计算已筹集金额 = 目标金额 * 进度百分比
    const collected = targetAmount * (token.progress / 100)
    // 保留2位小数，并添加币种单位
    const unit = token.target.replace(/[0-9.]+/g, '').trim()
    return collected.toFixed(2) + ' ' + unit
  }

  // 获取社交媒体链接
  const getSocials = (token: MintToken) => {
    const links: SocialLinkDisplay[] = [];
    
    // 如果存在 socials 数组，从中提取链接
    if (token.socials && token.socials.length > 0) {
      // 查找网站链接 - 匹配多种可能的平台名称，忽略大小写
      const website = token.socials.find(s => 
        s.platform && (
          s.platform.toLowerCase() === "website" || 
          s.platform.toLowerCase() === "web" || 
          s.platform.toLowerCase() === "site" ||
          s.platform.toLowerCase() === "homepage"
        )
      );
      if (website) {
        const url = website.link; // API返回的链接
        if (url) {
          links.push({
            platform: "website",
            link: url,
            icon: FaGlobe
          });
        }
      }
      
      // 查找推特链接 - 匹配多种可能的平台名称，忽略大小写
      const twitter = token.socials.find(s => 
        s.platform && (
          s.platform.toLowerCase() === "twitter" || 
          s.platform.toLowerCase() === "x" || 
          s.platform.toLowerCase() === "tweet"
        )
      );
      if (twitter) {
        const url = twitter.link;
        if (url) {
          links.push({
            platform: "twitter",
            link: url,
            icon: FaTwitter
          });
        }
      }
      
      // 查找电报链接 - 匹配多种可能的平台名称，忽略大小写
      const telegram = token.socials.find(s => 
        s.platform && (
          s.platform.toLowerCase() === "telegram" || 
          s.platform.toLowerCase() === "tg" || 
          s.platform.toLowerCase() === "tele"
        )
      );
      if (telegram) {
        const url = telegram.link;
        if (url) {
          links.push({
            platform: "telegram",
            link: url,
            icon: FaTelegram
          });
        }
      }
    } else {
      // 兼容旧数据格式，使用旧的独立属性
      if (token.website) {
        links.push({
          platform: "website",
          link: token.website,
          icon: FaGlobe
        });
      }
      
      if (token.twitter) {
        links.push({
          platform: "twitter",
          link: token.twitter,
          icon: FaTwitter
        });
      }
      
      if (token.telegram) {
        links.push({
          platform: "telegram",
          link: token.telegram,
          icon: FaTelegram
        });
      }
    }
    
    return links;
  };

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
    <>
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
              <Th bg={thBg} width="15%">
                {t('tokenColumn')}
              </Th>
              <Th bg={thBg} width="15%">
                {t('contractAddressColumn')}
              </Th>
              <Th bg={thBg} textAlign="center" width="12%">
                {t('totalSupplyColumn')}
              </Th>
              <ThSortable column="progress" width="25%">
                {t('progressColumn')}
              </ThSortable>
              <ThSortable column="minter_counts" width="10%">
                {t('participantsColumn')}
              </ThSortable>
              <Th bg={thBg} textAlign="center" width="15%">
                {t('mintingPrice')}
              </Th>
              <Th bg={thBg} width="8%">
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
                        maxW="120px"
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
                      fontWeight="bold"
                      color="brand.primary"
                      border="1px solid"
                      borderColor="brand.light"
                      title={token.address}
                      cursor="pointer"
                      width="fit-content"
                      onClick={() => copyContractAddress(token.address)}
                      bg="#F7F6FE"
                      _hover={{ bg: 'brand.light' }}
                      _active={{ bg: '#F7F6FE' }}
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
                    <HStack mb={1}>
                      <Text fontWeight="bold" fontSize="sm" color="brand.primary">
                        {token.progress.toFixed(2)}%
                      </Text>
                      {token.progress > 0 && (
                        <Text fontWeight="medium" fontSize="sm" color="brand.600">
                          ({getCollectedAmount(token)})
                        </Text>
                      )}
                      <Text fontWeight="medium" fontSize="sm" ml="auto">
                        / {token.target}
                      </Text>
                    </HStack>
                    <HStack spacing={2} align="center">
                      <Progress
                        value={token.progress}
                        variant="subtle"
                        borderRadius="full"
                        size="sm"
                        flex="1"
                        bg="#E7E3FC"
                        sx={{
                          // 进度条颜色
                          "& > div:last-of-type": {
                            bg: "brand.primary !important",
                            transition: "width 0.3s ease-in-out",
                          },
                        }}
                      />
                    </HStack>
                  </Box>
                </Td>
                <Td textAlign="center">
                  <Button
                    h="26px"
                    size="sm"
                    px={2}
                    variant="outline"
                    colorScheme="brand"
                    bg="#F7F6FE"
                    _hover={{ bg: 'brand.light' }}
                    _active={{ bg: '#F7F6FE' }}
                    leftIcon={
                      <Icon
                        as={FaUser}
                        color="#fff"
                        boxSize="16px"
                        p="3px"
                        bg="brand.primary"
                        rounded="6px"
                      />
                    }
                  >
                    {token.minterCounts}
                  </Button>
                </Td>
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
                    {/* 社交媒体图标 */}
                    {getSocials(token).map((social, index) => (
                      <Tooltip key={index} label={social.platform} placement="top">
                        <Link 
                          href={social.link}
                          isExternal
                          onClick={(e) => e.stopPropagation()}
                          color={iconColor}
                          _hover={{ color: "brand.primary" }}
                          transition="color 0.2s"
                        >
                          <Icon as={social.icon} boxSize="16px" />
                        </Link>
                      </Tooltip>
                    ))}
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
      
      {/* 添加分享模态框 */}
      {shareToken && (
        <ShareModal 
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title={`分享 ${shareToken.name} (${shareToken.symbol})`}
          content={""}
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/${network.toLowerCase()}/${shareToken.address}`}
          tokenTicker={shareToken.symbol}
          tokenName={shareToken.name}
          contractAddress={shareToken.address}
          hashtags={["PIS", "PI", "Web3", shareToken.symbol]}
        />
      )}
    </>
  )
}

export default TokenListView
