'use client'

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Icon,
  Link,
  useColorModeValue,
  useDisclosure,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useNetwork } from '@/contexts/NetworkContext'
import { useI18n } from '@/contexts/I18nProvider'
import { useTranslation } from 'react-i18next'
import { FaGlobeAsia } from 'react-icons/fa'
import { useSolana } from '@/contexts/solanaProvider'

// 动态导入LogoText组件，禁用服务器端渲染
const LogoText = dynamic(() => import('./LogoText'), { ssr: false })

// 客户端专用组件，防止服务器端渲染不匹配
const ClientSideOnly = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <>{children}</> : null
}

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { network, handleNetworkChange } = useNetwork()
  const { publicKey, setPublicKey } = useSolana()
  const { t } = useTranslation()
  const { language, changeLanguage } = useI18n()
  const pathname = usePathname()

  const connectwallet = async () => {
    if (network === 'Solana') {
      if (publicKey) return
      try {
        const result = await window.solana.connect()
        setPublicKey(result.publicKey.toString())
      } catch (error) {
        console.log(error,"error_");
        
      }
    }
  }
  // 组件加载时检查路径，确保网络选择器已同步
  useEffect(() => {
    // 逻辑已移至NetworkContext中处理
  }, [pathname, handleNetworkChange])

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="1000"
      bg={bgColor}
      borderBottom="1px"
      borderStyle="solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex minH="60px" py={{ base: 2 }} px={{ base: 4 }} alignItems="center">
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              aria-label="Toggle Navigation"
              variant="ghost"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            />
          </Flex>
          <Flex
            flex={{ base: 1 }}
            alignItems="center"
            justify={{ base: 'space-between', md: 'start' }}
          >
            <NextLink href="/" passHref>
              <Flex
                align="center"
                cursor="pointer"
                display={{ base: 'none', md: 'flex' }}
              >
                <ClientSideOnly>
                  <Image
                    src="/pis.png"
                    alt="Pi Logo"
                    boxSize="30px"
                    mr={2}
                    borderRadius="full"
                  />
                  <LogoText />
                </ClientSideOnly>
              </Flex>
            </NextLink>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 0, md: 0 }}
            justify="flex-end"
            direction="row"
            spacing={{ base: 2, md: 1 }}
            align="center"
            ml={{ base: 2, md: 0 }}
          >
            {/* 语言选择 */}
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label={t('language')}
                icon={<FaGlobeAsia />}
                variant="unstyled"
                display="flex"
                alignItems="center"
                justifyContent="center"
                colorScheme="purple"
                size={{ base: 'lg', md: 'lg' }}
                fontSize={{ base: '2xl', md: '2xl' }}
                mr={{ base: '-3px', md: '-4px' }}
                color="brand.primary"
                transition="color 0.2s ease"
                _hover={{
                  color: 'brand.secondary',
                }}
                _active={{
                  color: 'brand.secondary',
                  transform: 'scale(1.1)',
                }}
              />
              <MenuList minW="120px">
                <MenuItem
                  fontWeight="500"
                  onClick={() => changeLanguage('en')}
                  bg={language === 'en' ? 'purple.50' : undefined}
                  _dark={{
                    bg: language === 'en' ? 'purple.900' : undefined,
                  }}
                >
                  {t('english')}
                </MenuItem>
                <MenuItem
                  fontWeight="500"
                  onClick={() => changeLanguage('ko')}
                  bg={language === 'ko' ? 'purple.50' : undefined}
                  _dark={{
                    bg: language === 'ko' ? 'purple.900' : undefined,
                  }}
                >
                  {t('korean')}
                </MenuItem>
                <MenuItem
                  fontWeight="500"
                  onClick={() => changeLanguage('zh')}
                  bg={language === 'zh' ? 'purple.50' : undefined}
                  _dark={{
                    bg: language === 'zh' ? 'purple.900' : undefined,
                  }}
                >
                  {t('chinese')}
                </MenuItem>
              </MenuList>
            </Menu>

            {/* 网络选择 */}
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                colorScheme="purple"
                size={{ base: 'sm', md: 'md' }}
                rightIcon={<ChevronDownIcon />}
                fontWeight={600}
                borderWidth="2px"
                h={{ base: '36px', md: '40px' }}
                minW={{ base: 'auto', md: 'initial' }}
              >
                {network}
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={
                    <Image
                      src="/pi.png"
                      alt="Pi Network"
                      boxSize="18px"
                      borderRadius="full"
                    />
                  }
                  fontWeight="500"
                  onClick={() => handleNetworkChange('Pi Network')}
                  bg={network === 'Pi Network' ? 'purple.50' : undefined}
                  _dark={{
                    bg: network === 'Pi Network' ? 'purple.900' : undefined,
                  }}
                >
                  Pi Network
                </MenuItem>
                <MenuItem
                  icon={
                    <Image
                      src="/sol.png"
                      alt="Solana"
                      boxSize="18px"
                      borderRadius="full"
                    />
                  }
                  fontWeight="500"
                  onClick={() => handleNetworkChange('Solana')}
                  bg={network === 'Solana' ? 'purple.50' : undefined}
                  _dark={{
                    bg: network === 'Solana' ? 'purple.900' : undefined,
                  }}
                >
                  Solana
                </MenuItem>
              </MenuList>
            </Menu>

            <Button
              onClick={connectwallet}
              as="a"
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight={600}
              variant="solid"
              bg="brand.primary"
              color="white"
              _hover={{ bg: 'brand.light' }}
              href="#"
              h={{ base: '36px', md: '40px' }}
              px={{ base: 3, md: 4 }}
              size={{ base: 'sm', md: 'md' }}
            >
              {network === 'Solana'
                ? publicKey
                  ? publicKey
                  : t('connectWallet')
                : '连接Pi钱包'}
            </Button>
          </Stack>
        </Flex>

        <Box>{isOpen && <MobileNav onClose={onToggle} />}</Box>
      </Container>
    </Box>
  )
}

const DesktopNav = () => {
  const pathname = usePathname()
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('brand.primary', 'white')
  const activeLinkColor = useColorModeValue('brand.primary', 'brand.light')
  const activeBgColor = useColorModeValue('brand.background', 'gray.700')
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700')
  const { t } = useTranslation()

  return (
    <HStack spacing={4}>
      {NAV_ITEMS.map(navItem => {
        const isActive = pathname === navItem.href

        return (
          <Box key={navItem.label}>
            {navItem.children ? (
              <Menu>
                <MenuButton
                  as={Link}
                  p={2}
                  href={navItem.href ?? '#'}
                  fontSize="sm"
                  fontWeight={600}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}
                >
                  {t(navItem.label)} <ChevronDownIcon />
                </MenuButton>
                <MenuList>
                  {navItem.children.map(child => (
                    <MenuItem
                      key={child.label}
                      as={NextLink}
                      href={child.href ?? '#'}
                    >
                      <Text>{t(child.label)}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {t(child.subLabel || '')}
                      </Text>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <Link
                as={NextLink}
                p={2}
                px={4}
                href={navItem.href ?? '#'}
                fontSize="sm"
                fontWeight={isActive ? 700 : 600}
                color={isActive ? activeLinkColor : linkColor}
                bg={isActive ? activeBgColor : 'transparent'}
                borderRadius="md"
                position="relative"
                _after={
                  isActive
                    ? {
                        content: '""',
                        position: 'absolute',
                        bottom: '-1px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        bg: 'brand.primary',
                      }
                    : {}
                }
                _hover={{
                  textDecoration: 'none',
                  color: isActive ? activeLinkColor : linkHoverColor,
                  bg: isActive ? activeBgColor : hoverBgColor,
                }}
              >
                {t(navItem.label)}
              </Link>
            )}
          </Box>
        )
      })}
    </HStack>
  )
}

const MobileNav = ({ onClose }: { onClose: () => void }) => {
  const pathname = usePathname()
  const { network, handleNetworkChange } = useNetwork()
  const { t } = useTranslation()
  const { language, changeLanguage } = useI18n()

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map(navItem => (
        <MobileNavItem
          key={navItem.label}
          {...navItem}
          isActive={pathname === navItem.href}
          onClose={onClose}
        />
      ))}

      {/* 移动端语言选择 */}
      <Box pt={4} pb={2}>
        <Text fontWeight="600" mb={2} color="gray.500" fontSize="sm">
          {t('language')}
        </Text>
        <Stack spacing={2}>
          <Button
            size="sm"
            colorScheme={language === 'en' ? 'purple' : 'gray'}
            variant={language === 'en' ? 'solid' : 'outline'}
            justifyContent="flex-start"
            onClick={() => changeLanguage('en')}
            h="36px"
          >
            {t('english')}
          </Button>
          <Button
            size="sm"
            colorScheme={language === 'ko' ? 'purple' : 'gray'}
            variant={language === 'ko' ? 'solid' : 'outline'}
            justifyContent="flex-start"
            onClick={() => changeLanguage('ko')}
            h="36px"
          >
            {t('korean')}
          </Button>
          <Button
            size="sm"
            colorScheme={language === 'zh' ? 'purple' : 'gray'}
            variant={language === 'zh' ? 'solid' : 'outline'}
            justifyContent="flex-start"
            onClick={() => changeLanguage('zh')}
            h="36px"
          >
            {t('chinese')}
          </Button>
        </Stack>
      </Box>

      {/* 移动端网络选择 */}
      <Box pt={4} pb={2}>
        <Text fontWeight="600" mb={2} color="gray.500" fontSize="sm">
          {t('selectNetwork')}
        </Text>
        <Stack spacing={2}>
          <Button
            size="sm"
            colorScheme="purple"
            variant={network === 'Pi Network' ? 'solid' : 'outline'}
            justifyContent="flex-start"
            leftIcon={
              <Image
                src="/pis.png"
                alt="Pi Network"
                boxSize="18px"
                borderRadius="full"
              />
            }
            onClick={() => handleNetworkChange('Pi Network')}
            h="36px"
          >
            Pi Network
          </Button>
          <Button
            size="sm"
            colorScheme={network === 'Solana' ? 'purple' : 'gray'}
            variant={network === 'Solana' ? 'solid' : 'outline'}
            justifyContent="flex-start"
            leftIcon={
              <Image
                src="/sol.png"
                alt="Solana"
                boxSize="18px"
                borderRadius="full"
              />
            }
            onClick={() => handleNetworkChange('Solana')}
            h="36px"
          >
            Solana
          </Button>
        </Stack>
      </Box>

      <Box pt={4}>
        <Button
          w="full"
          bg="brand.primary"
          color="white"
          _hover={{ bg: 'brand.light' }}
          size="md"
        >
          {t('connectWallet')}
        </Button>
      </Box>
    </Stack>
  )
}

const MobileNavItem = ({
  label,
  children,
  href,
  isActive,
  onClose,
}: NavItem & { isActive?: boolean; onClose: () => void }) => {
  const { isOpen, onToggle } = useDisclosure()
  const activeLinkColor = useColorModeValue('brand.primary', 'brand.light')
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const { t } = useTranslation()

  const handleClick = () => {
    if (href && !children) {
      onClose() // 点击普通链接时关闭菜单
    } else {
      onToggle() // 点击有子菜单的项时切换子菜单
    }
  }

  return (
    <Stack spacing={4} onClick={handleClick}>
      <Flex
        py={2}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Link
          as={NextLink}
          href={href ?? '#'}
          fontWeight={isActive ? 700 : 600}
          color={isActive ? activeLinkColor : linkColor}
          position="relative"
          display="flex"
          alignItems="center"
          _before={
            isActive
              ? {
                  content: '""',
                  position: 'absolute',
                  left: '-10px',
                  width: '4px',
                  height: '100%',
                  bg: 'brand.primary',
                  borderRadius: 'sm',
                }
              : {}
          }
          onClick={e => {
            if (children) {
              e.preventDefault() // 阻止链接导航，只触发onToggle
            }
          }}
        >
          {isActive && (
            <Box
              as="span"
              bg={activeLinkColor}
              w="6px"
              h="6px"
              borderRadius="full"
              mr="2"
            />
          )}
          {t(label)}
        </Link>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="all .25s ease-in-out"
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Box display={isOpen ? 'block' : 'none'}>
        <Stack
          mt={2}
          pl={4}
          borderLeft="1px"
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align="start"
        >
          {children &&
            children.map(child => (
              <Link
                key={child.label}
                as={NextLink}
                py={2}
                href={child.href ?? '#'}
              >
                {t(child.label)}
              </Link>
            ))}
        </Stack>
      </Box>
    </Stack>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'nav.home',
    href: '/',
  },
  {
    label: 'nav.mint',
    href: '/mint',
  },
  {
    label: 'nav.market',
    href: '/market',
  },
  {
    label: 'nav.swap',
    href: '/swap',
  },
  {
    label: 'nav.news',
    href: '/news',
  },
  {
    label: 'nav.tutorials',
    href: '/docs/tutorials',
  },
  {
    label: 'nav.points',
    href: '/points',
  },
]
