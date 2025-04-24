"use client"

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
  Skeleton,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useNetwork } from "@/contexts/NetworkContext"
import { useI18n } from "@/contexts/I18nProvider"
import { useTranslation } from "react-i18next"
import { FaGlobeAsia } from "react-icons/fa"
import { useSolana } from "@/contexts/solanaProvider"
import { UserAPI } from "@/api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setUser, clearUser } from "@/store/slices/userSlice"
import LogoText from "./LogoText"
import WalletConnectModal from "./WalletConnectModal"
import LanguageSelector from "@/components/LanguageSelector"

// 客户端专用组件，防止服务器端渲染不匹配
const ClientSideOnly = ({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <>{children}</> : <>{fallback}</>
}

// 格式化钱包地址
const formatWalletAddress = (address: string) => {
  if (!address) return ""
  if (address.length < 10) return address
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// 添加一个Logo骨架屏占位符
const LogoSkeletonPlaceholder = () => {
  const pathname = usePathname();
  const isXpiPage = pathname === "/xpi";
  
  // 为XPI页面使用深色背景
  const skeletonBg = isXpiPage 
    ? "rgba(255, 255, 255, 0.2)" 
    : useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)");
    
  return (
    <Flex align="center" width="auto" minWidth="120px">
      <Skeleton
        boxSize={{ base: "36px", xl: "40px" }}
        borderRadius="full"
        mr={2}
        startColor={skeletonBg} 
        endColor="rgba(255, 255, 255, 0.3)"
      />
      <Box height="24px" width="80px" display="flex" alignItems="center" minWidth="80px" flexShrink={0} />
    </Flex>
  )
}

// 创建一个包含Logo和网站名称的组件，统一管理它们的加载
const LogoWithName = () => {
  return (
    <Flex align="center" minWidth="120px">
      <Image
        src="/pis.png"
        alt="Pi Logo"
        boxSize={{ base: "36px", xl: "40px" }}
        display="flex"
        objectFit="contain"
        mr={2}
        borderRadius="full"
      />
      <LogoText />
    </Flex>
  )
}

// 添加一个移动端Logo骨架占位符
const MobileLogoSkeletonPlaceholder = () => {
  const pathname = usePathname();
  const isXpiPage = pathname === "/xpi";
  
  // 为XPI页面使用深色背景
  const skeletonBg = isXpiPage 
    ? "rgba(255, 255, 255, 0.2)" 
    : useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)");
    
  return <Skeleton boxSize="32px" borderRadius="full" startColor={skeletonBg} endColor="rgba(255, 255, 255, 0.3)" />
}

// 添加一个在客户端渲染前显示的占位符组件
// 注意：此NavbarPlaceholder仅在Navbar.tsx内部使用
// providers.tsx中已经重新实现了一个功能类似的组件
// 如果修改此组件，也需要同步修改providers.tsx中的版本
const NavbarPlaceholder = () => {
  const pathname = usePathname();
  const isXpiPage = pathname === "/xpi";
  
  const bgColor = useColorModeValue(
    "rgba(255,255,255,0.4)",
    "rgba(0, 0, 0, 0.36)"
  )
  const borderColor = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)")
  const isXpiMode = isXpiPage // 根据实际路径判断
  const boxShadowValue = isXpiMode ? "none" : useColorModeValue("sm", "none") // 深色模式下不显示阴影
  const skeletonBg = isXpiPage 
    ? "rgba(255, 255, 255, 0.2)" 
    : useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)");

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="1000"
      bg={bgColor}
      boxShadow={boxShadowValue}
      height="60px" // 与实际 Navbar 保持相同高度
      width="100%"
      borderBottom="1px"
      borderStyle="solid"
      borderColor={borderColor}
      style={{
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)",
        transition: "all 0.3s ease-out",
      }}>
      <Container maxW="container.xl" height="100%">
        <Flex
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 0, xl: 4 }}
          alignItems="center"
          height="100%"
          justify="space-between" // 确保两端对齐
          position="relative" // 添加相对定位，作为绝对定位的基准
        >
          {/* 移动端Logo和汉堡菜单占位符 */}
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", xl: "none" }}
            alignItems="center">
            <Skeleton 
              width="24px" 
              height="24px" 
              borderRadius="md" 
              mr={2} 
              startColor={skeletonBg} 
              endColor="rgba(255, 255, 255, 0.3)"
            />
            <Skeleton 
              boxSize="32px" 
              borderRadius="full" 
              ml={2} 
              startColor={skeletonBg} 
              endColor="rgba(255, 255, 255, 0.3)"
            />
          </Flex>

          {/* 左侧Logo占位符 */}
          <Flex
            flex={{ base: 1, xl: "auto" }}
            alignItems="center"
            justify={{ base: "space-between", xl: "start" }}
            width={{ xl: "30%" }}>
            <Flex 
              align="center" 
              minWidth="120px"
              display={{ base: "none", xl: "flex" }}
            >
              <Skeleton
                boxSize={{ base: "36px", xl: "40px" }}
                borderRadius="full"
                mr={2}
                startColor={skeletonBg} 
                endColor="rgba(255, 255, 255, 0.3)"
              />
              <Box height="24px" minWidth="80px" flexShrink={0} />
            </Flex>
          </Flex>

          {/* 导航TAB组，作为一个整体居中 - 移除导航TAB骨架屏 */}
          <Flex
            display={{ base: "none", xl: "flex" }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            width="auto">
            <Box height="24px" width="300px" />
          </Flex>

          {/* 右侧按钮占位符 */}
          <Stack
            flex={{ base: 0, xl: 1 }}
            justify="flex-end"
            direction="row"
            spacing={{ base: 2, md: 1 }}
            align="center"
            ml={{ base: 2, md: 0 }}
            width={{ xl: "30%" }}>
            <NavButtonsPlaceholder />
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}

// 添加完整的钱包和语言选择器占位符
const NavButtonsPlaceholder = () => {
  const pathname = usePathname();
  const isXpiPage = pathname === "/xpi";
  
  // 为XPI页面使用深色背景
  const skeletonBg = isXpiPage 
    ? "rgba(255, 255, 255, 0.2)" 
    : useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)");
  
  // 骨架边框颜色
  const borderColor = isXpiPage 
    ? "rgba(255, 255, 255, 0.2)" 
    : useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)");
    
  return (
    <Stack
      flex={{ base: 0, md: 0 }}
      justify="flex-end"
      direction="row"
      spacing={{ base: 2, md: 1 }}
      align="center"
      ml={{ base: 2, md: 0 }}
      width="auto"
      flexShrink={0}>
      <Box 
        h={{ base: "36px", md: "40px" }}
        minW={{ base: "80px", md: "100px" }}
      />

      {/* 钱包连接按钮占位符 */}
      <Skeleton
        width={{ base: "80px", md: "100px" }}
        height={{ base: "36px", md: "40px" }}
        borderRadius="md"
        flexShrink={0}
        startColor={skeletonBg} 
        endColor="rgba(255, 255, 255, 0.3)" 
      />
    </Stack>
  )
}

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const pathname = usePathname()

  // 确保所有钩子都在顶部调用，避免条件渲染导致钩子顺序变化
  const { t } = useTranslation()
  const { network, handleNetworkChange } = useNetwork()
  const {
    publicKey,
    setPublicKey,
    disconnectWallet,
    isConnecting,
    reconnectWallet,
    autoConnected,
  } = useSolana()
  const { language, changeLanguage } = useI18n()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.user)

  // 判断是否在 XPI 页面，如果是则使用深色模式
  const isXpiPage = pathname === "/xpi"
  
  // 所有useColorModeValue调用都放在这里，不要在下面的逻辑中调用
  const xpiBgColorLight = useColorModeValue("rgba(0, 0, 0, 0.36)", "rgba(0, 0, 0, 0.36)")
  const normalBgColorLight = useColorModeValue("rgba(255,255,255,0.4)", "rgba(0, 0, 0, 0.36)")
  const normalTextColor = useColorModeValue("gray.600", "gray.200")
  const xpiBorderColorLight = useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.2)")
  const normalBorderColorLight = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)")
  const boxShadowNone = useColorModeValue("none", "none")
  const boxShadowSm = useColorModeValue("sm", "none")
  const menuBgColorValue = useColorModeValue("white", "gray.800")
  const menuBorderColorValue = useColorModeValue("gray.200", "gray.700")
  const buttonBgColorValue = useColorModeValue("brand.primary", "brand.dark")
  const buttonHoverBgColorValue = useColorModeValue("brand.light", "brand.primary")
  const buttonActiveBgColorValue = useColorModeValue("brand.primary", "brand.dark")
  
  // 连接钱包按钮样式 - 移到顶部
  const walletButtonBgColor = useColorModeValue("brand.primary", "brand.dark")
  const walletButtonHoverBgColor = useColorModeValue("brand.light", "brand.primary")
  const walletButtonActiveBgColor = useColorModeValue("brand.primary", "brand.dark")

  // 提前计算所有颜色值，避免在条件渲染中使用useColorModeValue
  const bgColor = isXpiPage ? xpiBgColorLight : normalBgColorLight
  const textColor = isXpiPage ? "white" : normalTextColor
  // 在XPI页面或深色模式下使用更接近xpi-web-frontend的边框颜色
  const borderColor = isXpiPage ? xpiBorderColorLight : normalBorderColorLight
  const buttonBgColor = isXpiPage ? "brand.primary" : "brand.primary"
  const buttonTextColor = isXpiPage ? "black" : "white"
  const buttonHoverBgColor = isXpiPage ? "brand.light" : "brand.light"
  const iconButtonColor = isXpiPage ? "white" : "inherit"
  const boxShadowValue = isXpiPage ? boxShadowNone : boxShadowSm
  const menuBgColor = menuBgColorValue
  const menuBorderColor = menuBorderColorValue
  const buttonColorProps = {
    bg: isXpiPage ? "brand.primary" : buttonBgColorValue,
    color: buttonTextColor,
    _hover: {
      bg: isXpiPage ? "brand.light" : buttonHoverBgColorValue,
    },
    _active: {
      bg: isXpiPage ? "brand.primary" : buttonActiveBgColorValue,
    },
  }

  // 添加钱包连接弹窗状态
  const {
    isOpen: isWalletModalOpen,
    onOpen: onWalletModalOpen,
    onClose: onWalletModalClose,
  } = useDisclosure()

  // 添加客户端渲染状态检测
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      localStorage.removeItem("userId")
      localStorage.removeItem("nickname")
      localStorage.removeItem("avatar_url")
      localStorage.removeItem("token")

      toast({
        title: t("disconnected"),
        description: t("disconnectSuccess"),
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    } catch (error) {
      console.error("断开连接失败:", error)
      toast({
        title: t("error"),
        description: t("disconnectFailed"),
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    }
  }

  const handleReconnect = async () => {
    try {
      await reconnectWallet()
      toast({
        title: t("reconnected"),
        description: t("reconnectSuccess"),
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    } catch (error) {
      console.error("重新连接失败:", error)
      toast({
        title: t("error"),
        description: t("reconnectFailed"),
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    }
  }

  // 处理连接按钮点击事件
  const handleConnectButtonClick = () => {
    // 打开钱包选择弹窗
    onWalletModalOpen()
  }

  // 处理钱包连接成功
  const handleWalletConnected = (newPublicKey: string) => {
    // 设置公钥
    setPublicKey(newPublicKey)
  }

  // 组件加载时检查路径，确保网络选择器已同步
  useEffect(() => {
    // 逻辑已移至NetworkContext中处理
  }, [pathname, handleNetworkChange])

  // 渲染前显示占位符
  if (!mounted) {
    return <NavbarPlaceholder />
  }

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
      boxShadow={boxShadowValue}
      style={{
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)",
        transition: "all 0.3s ease-out",
      }}
      height="60px" // 固定导航栏高度
    >
      <Container maxW="container.xl" height="100%">
        <Flex
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 0, xl: 4 }}
          alignItems="center"
          height="100%"
          justify="space-between" // 确保两端对齐
          position="relative" // 添加相对定位，作为绝对定位的基准
        >
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", xl: "none" }}
            alignItems="center">
            <IconButton
              onClick={onToggle}
              aria-label="Toggle Navigation"
              variant="ghost"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              color={iconButtonColor}
            />
            {/* 移动端显示Logo */}
            <NextLink href="/" passHref>
              <Flex align="center" cursor="pointer" ml={2} display="contents">
                <ClientSideOnly fallback={<MobileLogoSkeletonPlaceholder />}>
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

          {/* 左侧Logo */}
          <Flex
            flex={{ base: 1, xl: "auto" }}
            alignItems="center"
            justify={{ base: "space-between", xl: "start" }}
            width={{ xl: "30%" }}>
            <NextLink href="/" passHref>
              <Flex
                align="center"
                cursor="pointer"
                display={{ base: "none", xl: "flex" }}
                minWidth="120px" // 确保固定最小宽度，防止跳动
              >
                <ClientSideOnly fallback={<LogoSkeletonPlaceholder />}>
                  <LogoWithName />
                </ClientSideOnly>
              </Flex>
            </NextLink>
          </Flex>

          {/* 导航TAB组，作为一个整体居中 */}
          <Flex
            display={{ base: "none", xl: "flex" }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            width="auto">
            <DesktopNav />
          </Flex>

          {/* 右侧语言选择器和钱包按钮 */}
          <ClientSideOnly fallback={<NavButtonsPlaceholder />}>
            <Stack
              flex={{ base: 0, xl: 1 }}
              justify="flex-end"
              direction="row"
              spacing={{ base: 2, md: 1 }}
              align="center"
              ml={{ base: 2, md: 0 }}
              width={{ xl: "30%" }}>
              {/* 语言选择 */}
              <LanguageSelector isXpiPage={isXpiPage} />

              {/* 网络选择 */}
              <Box display="none">
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="outline"
                    colorScheme="purple"
                    size={{ base: "sm", md: "md" }}
                    rightIcon={<ChevronDownIcon />}
                    fontWeight={600}
                    borderWidth="2px"
                    h={{ base: "36px", md: "40px" }}
                    minW={{ base: "80px", md: "100px" }}
                    width="auto">
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
                      onClick={() => handleNetworkChange("SOL")}
                      bg={network === "SOL" ? "purple.50" : undefined}
                      _dark={{
                        bg: network === "SOL" ? "purple.900" : undefined,
                      }}>
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
                      onClick={() => handleNetworkChange("PI")}
                      bg={network === "PI" ? "purple.50" : undefined}
                      _dark={{
                        bg: network === "PI" ? "purple.900" : undefined,
                      }}>
                      PI
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>

              {/* 连接钱包按钮 或 已连接钱包的下拉菜单 */}
              {network === "SOL" && !isLoggedIn && (
                <Button
                  display={{ base: "inline-flex", md: "inline-flex" }}
                  variant="solid"
                  bg={isXpiPage ? "brand.primary" : walletButtonBgColor}
                  color="white"
                  _hover={{
                    bg: isXpiPage ? "brand.light" : walletButtonHoverBgColor,
                  }}
                  _active={{
                    bg: isXpiPage ? "brand.primary" : walletButtonActiveBgColor,
                  }}
                  size={{ base: "sm", md: "md" }}
                  fontWeight={600}
                  h={{ base: "36px", md: "40px" }}
                  minW={{ base: "80px", md: "100px" }}
                  onClick={handleConnectButtonClick}
                  isLoading={isConnecting}
                  loadingText={t("connecting")}>
                  {t("connect")}
                </Button>
              )}

              {/* 已登录状态 */}
              {network === "SOL" && isLoggedIn && (
                <Menu>
                  <MenuButton
                    as={Button}
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight={600}
                    variant="solid"
                    bg={isXpiPage ? "brand.primary" : walletButtonBgColor}
                    color="white"
                    _hover={{
                      bg: isXpiPage ? "brand.light" : walletButtonHoverBgColor,
                    }}
                    _active={{
                      bg: isXpiPage ? "brand.primary" : walletButtonActiveBgColor,
                    }}
                    h={{ base: "36px", md: "40px" }}
                    px={{ base: 3, md: 4 }}
                    size={{ base: "sm", md: "md" }}
                    rightIcon={<ChevronDownIcon />}>
                    {formatWalletAddress(publicKey || "")}
                  </MenuButton>
                  <MenuList
                    minW="120px"
                    bg={menuBgColor}
                    borderColor={menuBorderColor}>
                    <MenuItem onClick={handleDisconnect} fontWeight="500">
                      {t("disconnect")}
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}

              {/* PI网络测试网已连接 */}
              {network === "PI" && publicKey && (
                <Button
                  display={{ base: "inline-flex", md: "inline-flex" }}
                  variant="solid"
                  bg={isXpiPage ? "brand.primary" : walletButtonBgColor}
                  color="white"
                  _hover={{
                    bg: isXpiPage ? "brand.light" : walletButtonHoverBgColor,
                  }}
                  _active={{
                    bg: isXpiPage ? "brand.primary" : walletButtonActiveBgColor,
                  }}
                  size={{ base: "sm", md: "md" }}
                  fontWeight={600}
                  h={{ base: "36px", md: "40px" }}
                  minW={{ base: "80px", md: "100px" }}
                  onClick={handleReconnect}
                  isLoading={isConnecting}
                  loadingText={t("reconnecting")}>
                  {formatWalletAddress(publicKey)}
                </Button>
              )}
            </Stack>
          </ClientSideOnly>
        </Flex>

        <Box>
          {isOpen && (
            <MobileNav
              onClose={onToggle}
              connectWallet={handleConnectButtonClick}
              isXpiPage={isXpiPage}
            />
          )}
        </Box>
      </Container>

      {/* 钱包连接弹窗 */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={onWalletModalClose}
        onConnect={handleWalletConnected}
      />
    </Box>
  )
}

const DesktopNav = () => {
  const pathname = usePathname()
  const { t } = useTranslation()

  // 判断是否在 XPI 页面，如果是则使用深色模式
  const isXpiPage = pathname === "/xpi"
  
  // 所有useColorModeValue调用移到顶部
  const desktopLinkColorValue = useColorModeValue("gray.600", "gray.200")
  const desktopLinkHoverColorValue = useColorModeValue("brand.primary", "white")
  const desktopActiveLinkColorValue = useColorModeValue("brand.primary", "brand.light")
  const desktopActiveBgColorValue = useColorModeValue("brand.background", "gray.700")
  const desktopHoverBgColorValue = useColorModeValue("gray.50", "gray.700")
  
  const linkColor = isXpiPage ? "gray.200" : desktopLinkColorValue
  const linkHoverColor = isXpiPage ? "white" : desktopLinkHoverColorValue
  const activeLinkColor = isXpiPage ? "brand.light" : desktopActiveLinkColorValue
  const activeBgColor = desktopActiveBgColorValue
  const hoverBgColor = desktopHoverBgColorValue

  return (
    <HStack spacing={4} width="auto">
      {NAV_ITEMS.map((navItem) => {
        const isActive = pathname === navItem.href

        return (
          <Box key={navItem.label}>
            {navItem.children ? (
              <Menu>
                <MenuButton
                  as={Link}
                  p={2}
                  href={navItem.href ?? "#"}
                  fontSize="sm"
                  fontWeight={600}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}>
                  {t(navItem.label)} <ChevronDownIcon />
                </MenuButton>
                <MenuList>
                  {navItem.children.map((child) => (
                    <MenuItem
                      key={child.label}
                      as={NextLink}
                      href={child.href ?? "#"}>
                      <Text>{t(child.label)}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {t(child.subLabel || "")}
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
                href={navItem.href ?? "#"}
                fontSize="sm"
                fontWeight={isActive ? 700 : 600}
                color={isActive ? activeLinkColor : linkColor}
                // bg={isActive ? activeBgColor : "transparent"}
                bg="transparent"
                borderRadius="md"
                position="relative"
                _after={
                  isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        bottom: "-1px",
                        left: "0",
                        right: "0",
                        height: "2px",
                        bg: "brand.primary",
                      }
                    : {}
                }
                _hover={{
                  textDecoration: "none",
                  color: isActive ? activeLinkColor : linkHoverColor,
                  // bg: isActive ? activeBgColor : hoverBgColor,
                }}>
                {t(navItem.label)}
              </Link>
            )}
          </Box>
        )
      })}
    </HStack>
  )
}

const MobileNav = ({
  onClose,
  connectWallet,
  isXpiPage = false,
}: {
  onClose: () => void
  connectWallet: () => void
  isXpiPage?: boolean
}) => {
  const pathname = usePathname()
  const { network, handleNetworkChange } = useNetwork()
  const { publicKey, disconnectWallet, isConnecting } = useSolana()
  const { t } = useTranslation()
  const { language, changeLanguage } = useI18n()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const { isLoggedIn } = useAppSelector((state) => state.user)
  // 确保所有useColorModeValue调用都在这里，而不是在条件逻辑中
  const whiteBgColor = useColorModeValue("white", "gray.900")
  const primaryBgColor = useColorModeValue("brand.primary", "brand.dark")
  const lightHoverBgColor = useColorModeValue("brand.light", "brand.primary")
  const brandBgColor = useColorModeValue("brand.background", "gray.700")
  const primaryColor = useColorModeValue("brand.primary", "white")
  const primaryBorderColor = useColorModeValue("brand.primary", "gray.600")
  const brandHoverBgColor = useColorModeValue("brand.background", "gray.600")
  const disconnectUndefinedColor = useColorModeValue(undefined, "red.300") 
  const grayBorderColor = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)")

  // 提前计算所有颜色值，避免在条件渲染中使用useColorModeValue
  const navBgColor = isXpiPage ? "gray.900" : whiteBgColor
  const buttonBgColor = isXpiPage ? "brand.primary" : primaryBgColor
  // 定义一个统一的按钮选中背景色，确保在所有模式下一致
  const activeButtonBgColor = "brand.primary" // 始终使用品牌主色，无论XPI模式与否
  const buttonTextColor = "white"
  const buttonHoverBgColor = isXpiPage ? "brand.light" : lightHoverBgColor

  const walletBgColor = isXpiPage ? "gray.700" : brandBgColor
  const walletTextColor = isXpiPage ? "white" : primaryColor
  const walletBorderColor = isXpiPage ? "gray.600" : primaryBorderColor
  const walletHoverBgColor = isXpiPage ? "gray.600" : brandHoverBgColor

  const disconnectColor = isXpiPage ? "red.300" : disconnectUndefinedColor
  const disconnectBorderColor = isXpiPage ? "red.300" : disconnectUndefinedColor

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      dispatch(clearUser())
      toast({
        title: t("disconnected"),
        description: t("disconnectSuccess"),
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
      onClose() // 关闭移动菜单
    } catch (error) {
      console.error("断开连接失败:", error)
      toast({
        title: t("error"),
        description: t("disconnectFailed"),
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    }
  }

  return (
    <Stack
      bg={navBgColor}
      p={4}
      display={{ xl: "none" }}
      borderLeft="1px"
      borderColor={grayBorderColor}
      style={{
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)",
        transition: "all 0.3s ease-out",
      }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          {...navItem}
          isActive={pathname === navItem.href}
          onClose={onClose}
          isXpiPage={isXpiPage}
        />
      ))}

      {/* 移动端语言选择 */}
      <LanguageSelector isMobile onClose={onClose} isXpiPage={isXpiPage} />

      {/* 移动端网络选择 */}
      <Box pt={4} pb={2} display="none"></Box>

      {/* 移动端钱包连接/断开 */}
      <Box pt={4}>
        {network === "SOL" && isLoggedIn && publicKey ? (
          <Stack spacing={2}>
            <Button
              w="full"
              bg={walletBgColor}
              color={walletTextColor}
              borderWidth="1px"
              borderColor={walletBorderColor}
              _hover={{ bg: walletHoverBgColor }}
              size="md">
              {formatWalletAddress(publicKey)}
            </Button>
            <Button
              w="full"
              variant="outline"
              colorScheme="red"
              onClick={handleDisconnect}
              size="md"
              color={disconnectColor}
              borderColor={disconnectBorderColor}>
              {t("disconnect")}
            </Button>
          </Stack>
        ) : (
          <Button
            w="full"
            bg={buttonBgColor}
            color={buttonTextColor}
            _hover={{ bg: buttonHoverBgColor }}
            _active={{ bg: buttonBgColor }}
            size="md"
            onClick={() => {
              connectWallet() // 打开钱包选择弹窗
              onClose() // 关闭移动菜单
            }}
            isLoading={isConnecting}>
            {t("connect")}
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
  isXpiPage = false,
}: NavItem & {
  isActive?: boolean
  onClose: () => void
  isXpiPage?: boolean
}) => {
  const { isOpen, onToggle } = useDisclosure()
  const { t } = useTranslation()
  // 确保所有useColorModeValue调用都在这里
  const primaryLightColor = useColorModeValue("brand.primary", "brand.light")
  const grayTextColor = useColorModeValue("gray.600", "gray.200")
  const lightBgColor = useColorModeValue("gray.50", "gray.800")
  const lightBorderColor = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)")

  // 提前计算所有颜色值
  const activeLinkColor = isXpiPage ? "brand.light" : primaryLightColor
  const linkColor = isXpiPage ? "gray.200" : grayTextColor
  const submenuBgColor = isXpiPage ? "gray.800" : lightBgColor
  const submenuBorderColor = isXpiPage ? "rgba(255, 255, 255, 0.2)" : lightBorderColor

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
          textDecoration: "none",
        }}>
        <Link
          as={NextLink}
          href={href ?? "#"}
          fontWeight={isActive ? 700 : 600}
          color={isActive ? activeLinkColor : linkColor}
          position="relative"
          display="flex"
          alignItems="center"
          _before={
            isActive
              ? {
                  content: '""',
                  position: "absolute",
                  left: "-10px",
                  width: "4px",
                  height: "100%",
                  bg: isXpiPage ? "brand.light" : "brand.primary",
                  borderRadius: "sm",
                }
              : {}
          }
          onClick={(e) => {
            if (children) {
              e.preventDefault() // 阻止链接导航，只触发onToggle
            }
          }}>
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
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
            color={linkColor}
          />
        )}
      </Flex>

      <Box display={isOpen ? "block" : "none"}>
        <Stack
          mt={2}
          pl={4}
          borderLeft="1px"
          borderStyle="solid"
          borderColor={submenuBorderColor}
          align="start"
          p={2}
          bg={submenuBgColor}
          borderRadius="md"
          style={{
            backdropFilter: "saturate(180%) blur(8px)",
            WebkitBackdropFilter: "saturate(180%) blur(8px)",
          }}>
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                as={NextLink}
                py={2}
                href={child.href ?? "#"}
                color={linkColor}
                _hover={{
                  color: activeLinkColor,
                  textDecoration: "none",
                }}>
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
    label: "nav.mint",
    href: "/",
  },
  {
    label: "nav.deploy",
    href: "/deploy",
  },
  {
    label: "nav.XPI",
    href: "/xpi",
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
