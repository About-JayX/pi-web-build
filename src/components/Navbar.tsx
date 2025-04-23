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
  Collapse,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useToast,
  Avatar,
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
import { UserAPI } from '@/api'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUser, clearUser } from '@/store/slices/userSlice'

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

// 格式化钱包地址，显示前4位和后4位
const formatWalletAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const { network, handleNetworkChange } = useNetwork()
  const { publicKey, setPublicKey, disconnectWallet, isConnecting, reconnectWallet, autoConnected } = useSolana()
  const { t } = useTranslation()
  const { language, changeLanguage } = useI18n()
  const pathname = usePathname()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const { isLoggedIn, userInfo } = useAppSelector(state => state.user)

  // 自动登录功能已移除
  // 仅在用户主动点击"连接"按钮时进行登录

  // 监听钱包状态变化，如果钱包断开连接，清除登录状态
  useEffect(() => {
    if (!publicKey && isLoggedIn) {
      dispatch(clearUser())
    }
  }, [publicKey, isLoggedIn, dispatch])

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      dispatch(clearUser())
      
      // 清除用户信息
      localStorage.removeItem('userId')
      localStorage.removeItem('nickname')
      localStorage.removeItem('avatar_url')
      
      toast({
        title: '已断开连接',
        description: '钱包已成功断开连接',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
    } catch (error) {
      console.error('断开连接失败:', error)
      toast({
        title: '错误',
        description: '断开连接失败，请重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  const handleReconnect = async () => {
    try {
      await reconnectWallet()
      toast({
        title: '已重新连接',
        description: '钱包已成功重新连接',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
    } catch (error) {
      console.error('重新连接失败:', error)
      toast({
        title: '错误',
        description: '重新连接失败，请重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  const connectwallet = async () => {
    console.log(window.solana, 'window_______solana')
    console.log(window.solana, 'window_______solana')
    if (!window.solana) {
      toast({
        title: '错误',
        description: '请先安装 Phantom 钱包插件',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
      return
    }

    try {
      if (network === 'SOL') {
        // 如果未连接钱包，先连接钱包并立即进行登录
        if (!publicKey) {
          try {
            const result = await window.solana.connect()
            const newPublicKey = result.publicKey.toString()
            setPublicKey(newPublicKey)

            // 立即执行登录
            try {
              const message = 'Hello from PiSale!'
              const encodedMessage = new TextEncoder().encode(message)
              const signed = await window.solana.signMessage(encodedMessage, 'utf8')
              const signatureBytes = new Uint8Array(signed.signature)

              const loginResult = await UserAPI.loginWithSolana({
                publicKey: newPublicKey,
                message,
                signature: Array.from(signatureBytes),
                code: 'K7QEISU9',
              })

              if (loginResult.data) {
                // 保存用户基本信息到localStorage，便于恢复登录状态
                localStorage.setItem('userId', loginResult.data.user.userId.toString())
                localStorage.setItem('nickname', loginResult.data.user.nickname || '用户')
                localStorage.setItem('avatar_url', loginResult.data.user.avatar_url || '')
                
                dispatch(
                  setUser({
                    user: loginResult.data.user,
                    authToken: loginResult.data.authToken,
                  })
                )

                toast({
                  title: '登录成功',
                  description: `欢迎回来，${
                    loginResult.data.user.nickname || 'User'
                  }`,
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                  position: 'top',
                })
              }
            } catch (signError) {
              console.error('消息签名失败:', signError)
              // 检查是否是用户拒绝签名
              if (signError.message && (
                  signError.message.includes('User rejected') || 
                  signError.message.includes('用户拒绝') || 
                  signError.message.includes('cancelled') || 
                  signError.message.includes('取消')
                )) {
                toast({
                  title: '操作取消',
                  description: '您取消了消息签名，请重试以完成登录',
                  status: 'warning',
                  duration: 3000,
                  isClosable: true,
                  position: 'top',
                })
              } else {
                toast({
                  title: '签名错误',
                  description: '签名消息时出错，请重试',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                  position: 'top',
                })
              }
              // 如果签名失败，断开钱包连接
              await disconnectWallet()
            }
            return
          } catch (connectError) {
            console.error('钱包连接失败:', connectError)
            // 检查是否是用户拒绝连接
            if (connectError.message && (
                connectError.message.includes('User rejected') || 
                connectError.message.includes('用户拒绝') || 
                connectError.message.includes('cancelled') || 
                connectError.message.includes('取消')
              )) {
              toast({
                title: '连接取消',
                description: '您取消了钱包连接请求',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top',
              })
            } else {
              toast({
                title: '连接错误',
                description: '连接钱包时出错，请重试',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
              })
            }
            return
          }
        }

        // 如果已登录，显示已登录提示
        if (isLoggedIn) {
          toast({
            title: '提示',
            description: '您已经登录了',
            status: 'info',
            duration: 3000,
            isClosable: true,
            position: 'top',
          })
          return
        }

        // 如果已连接钱包但未登录，执行登录
        try {
          const message = 'Hello from PiSale!'
          const encodedMessage = new TextEncoder().encode(message)
          const signed = await window.solana.signMessage(encodedMessage, 'utf8')
          const signatureBytes = new Uint8Array(signed.signature)

          const result = await UserAPI.loginWithSolana({
            publicKey,
            message,
            signature: Array.from(signatureBytes),
            code: 'K7QEISU9',
          })

          if (result.data) {
            // 保存用户基本信息到localStorage，便于恢复登录状态
            localStorage.setItem('userId', result.data.user.userId.toString())
            localStorage.setItem('nickname', result.data.user.nickname || '用户')
            localStorage.setItem('avatar_url', result.data.user.avatar_url || '')
            
            dispatch(
              setUser({
                user: result.data.user,
                authToken: result.data.authToken,
              })
            )

            toast({
              title: '登录成功',
              description: `欢迎回来，${result.data.user.nickname || 'User'}`,
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top',
            })
          }
        } catch (signError) {
          console.error('消息签名或登录失败:', signError)
          // 检查是否是用户拒绝签名
          if (signError.message && (
              signError.message.includes('User rejected') || 
              signError.message.includes('用户拒绝') || 
              signError.message.includes('cancelled') || 
              signError.message.includes('取消')
            )) {
            toast({
              title: '操作取消',
              description: '您取消了消息签名，请重试以完成登录',
              status: 'warning',
              duration: 3000,
              isClosable: true,
              position: 'top',
            })
          } else {
            toast({
              title: '错误',
              description: '登录过程中发生错误，请重试',
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'top',
            })
          }
        }
      } else {
        // Pi Network 的连接逻辑
        try {
          toast({
            title: '提示',
            description: '即将支持 Pi 钱包连接',
            status: 'info',
            duration: 3000,
            isClosable: true,
            position: 'top',
          })
        } catch (piError) {
          console.error('Pi Network操作失败:', piError)
          toast({
            title: '错误',
            description: 'Pi Network操作失败，请稍后再试',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          })
        }
      }
    } catch (error) {
      console.error('操作失败:', error)
      // 通用错误处理
      const errorMessage = error instanceof Error ? error.message : '操作失败，请重试'
      toast({
        title: '错误',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
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
        <Flex
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 0, xl: 4 }}
          alignItems="center"
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', xl: 'none' }}
            alignItems="center"
          >
            <IconButton
              onClick={onToggle}
              aria-label="Toggle Navigation"
              variant="ghost"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            />
            {/* 移动端显示Logo */}
            <NextLink href="/" passHref>
              <Flex align="center" cursor="pointer" ml={2}>
                <ClientSideOnly>
                  <Image
                    src="/pis.png"
                    alt="Pi Logo"
                    boxSize="32px"
                    objectFit="contain"
                    borderRadius="full"
                  />
                </ClientSideOnly>
              </Flex>
            </NextLink>
          </Flex>
          <Flex
            flex={{ base: 1, xl: 'auto' }}
            alignItems="center"
            justify={{ base: 'space-between', xl: 'start' }}
          >
            <NextLink href="/" passHref>
              <Flex
                align="center"
                cursor="pointer"
                display={{ base: 'none', xl: 'flex' }}
              >
                <ClientSideOnly>
                  <Image
                    src="/pis.png"
                    alt="Pi Logo"
                    boxSize={{ base: '36px', xl: '40px' }}
                    display={{ base: 'none', xl: 'flex' }}
                    objectFit="contain"
                    mr={2}
                    borderRadius="full"
                    flex={1}
                  />
                  <Flex display={{ base: 'none', xl: 'flex' }}>
                    <LogoText />
                  </Flex>
                </ClientSideOnly>
              </Flex>
            </NextLink>

            <Flex
              display={{ base: 'none', xl: 'flex' }}
              ml={{ base: 10, xl: 6 }}
            >
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
                fontSize={{ base: '2xl', lg: '2xl' }}
                mr={{ base: 0, md: 1 }}
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
            <Box display="none">
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
                  minW={{ base: '80px', md: '100px' }}
                  width="auto"
                >
                  {network}
                </MenuButton>
                <MenuList minW="120px">
                  <MenuItem
                    icon={
                      <Image
                        src="/sol.png"
                        alt="SOL"
                        boxSize="18px"
                        borderRadius="full"
                      />
                    }
                    fontWeight="500"
                    onClick={() => handleNetworkChange('SOL')}
                    bg={network === 'SOL' ? 'purple.50' : undefined}
                    _dark={{
                      bg: network === 'SOL' ? 'purple.900' : undefined,
                    }}
                  >
                    SOL
                  </MenuItem>
                  <MenuItem
                    icon={
                      <Image
                        src="/pi.png"
                        alt="PI"
                        boxSize="18px"
                        borderRadius="full"
                      />
                    }
                    fontWeight="500"
                    onClick={() => handleNetworkChange('PI')}
                    bg={network === 'PI' ? 'purple.50' : undefined}
                    _dark={{
                      bg: network === 'PI' ? 'purple.900' : undefined,
                    }}
                  >
                    PI
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>

            {/* 连接钱包按钮 或 已连接钱包的下拉菜单 */}
            {network === 'SOL' && isLoggedIn && publicKey ? (
              <Menu>
                <MenuButton
                  as={Button}
                  fontSize={{ base: 'xs', md: 'sm' }}
                  fontWeight={600}
                  variant="solid"
                  bg="brand.primary"
                  color="white"
                  _hover={{ bg: 'brand.light' }}
                  h={{ base: '36px', md: '40px' }}
                  px={{ base: 3, md: 4 }}
                  size={{ base: 'sm', md: 'md' }}
                  rightIcon={<ChevronDownIcon />}
                >
                  {formatWalletAddress(publicKey)}
                </MenuButton>
                <MenuList minW="120px">
                  <MenuItem onClick={handleDisconnect} fontWeight="500">
                    断开连接
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                onClick={connectwallet}
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight={600}
                variant="solid"
                bg="brand.primary"
                color="white"
                _hover={{ bg: 'brand.light' }}
                h={{ base: '36px', md: '40px' }}
                px={{ base: 3, md: 4 }}
                size={{ base: 'sm', md: 'md' }}
                isLoading={isConnecting}
              >
                连接
              </Button>
            )}
          </Stack>
        </Flex>

        <Box>{isOpen && <MobileNav onClose={onToggle} connectWallet={connectwallet} />}</Box>
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

const MobileNav = ({ onClose, connectWallet }: { onClose: () => void; connectWallet: () => Promise<void> }) => {
  const pathname = usePathname()
  const { network, handleNetworkChange } = useNetwork()
  const { publicKey, disconnectWallet, isConnecting } = useSolana()
  const { t } = useTranslation()
  const { language, changeLanguage } = useI18n()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const { isLoggedIn } = useAppSelector(state => state.user)

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      dispatch(clearUser())
      toast({
        title: '已断开连接',
        description: '钱包已成功断开连接',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
      onClose() // 关闭移动菜单
    } catch (error) {
      console.error('断开连接失败:', error)
      toast({
        title: '错误',
        description: '断开连接失败，请重试',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ xl: 'none' }}
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
      <Box pt={4} pb={2} display="none">
      </Box>

      {/* 钱包连接/断开 */}
      <Box pt={4}>
        {network === 'SOL' && isLoggedIn && publicKey ? (
          <Stack spacing={2}>
            <Button
              w="full"
              bg="brand.background"
              color="brand.primary"
              borderWidth="1px"
              borderColor="brand.primary"
              _hover={{ bg: 'brand.background' }}
              size="md"
            >
              {formatWalletAddress(publicKey)}
            </Button>
            <Button
              w="full"
              variant="outline"
              colorScheme="red"
              onClick={handleDisconnect}
              size="md"
            >
              断开连接
            </Button>
          </Stack>
        ) : (
          <Button
            w="full"
            bg="brand.primary"
            color="white"
            _hover={{ bg: 'brand.light' }}
            size="md"
            onClick={connectWallet}
            isLoading={isConnecting}
          >
            连接
          </Button>
        )}
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
    label: 'nav.mint',
    href: '/',
  },
  {
    label: 'nav.deploy',
    href: '/deploy',
  },
    /* 暂时隐藏入口
  {
    label: 'nav.market',
    href: '/market',
  },
  {
    label: 'nav.home',
    href: '/home',
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
    */
]

