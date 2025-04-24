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

// 格式化钱包地址，显示前4位和后4位
const formatWalletAddress = (address: string) => {
  if (!address) return ""
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// 优化LogoSkeletonPlaceholder组件
const LogoSkeletonPlaceholder = () => {
  return (
    <Flex align="center" width="auto" minWidth="120px">
      <Skeleton
        boxSize={{ base: "36px", xl: "40px" }}
        borderRadius="full"
        mr={2}
      />
      <Skeleton height="24px" width="80px" borderRadius="md" />
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
  return <Skeleton boxSize="32px" borderRadius="full" />
}

// 添加一个在客户端渲染前显示的占位符组件
const NavbarPlaceholder = () => {
  const bgColor = useColorModeValue(
    "rgba(255,255,255,0.4)",
    "rgba(0, 0, 0, 0.36)"
  )
  const borderColor = useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)")
  const isXpiMode = false // 因为是占位符，无法获取实际路径，假设非XPI页面
  const boxShadowValue = useColorModeValue(isXpiMode ? "none" : "sm", "none") // 深色模式下不显示阴影

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
        >
          {/* 移动端Logo占位符 */}
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", xl: "none" }}
            alignItems="center">
            <Skeleton width="24px" height="24px" borderRadius="md" mr={2} />
            <Skeleton boxSize="32px" borderRadius="full" ml={2} />
          </Flex>

          {/* 桌面端Logo和导航占位符 */}
          <Flex
            flex={{ base: 1, xl: "auto" }}
            alignItems="center"
            justify={{ base: "space-between", xl: "start" }}
            width="100%">
            {/* Logo占位符 */}
            <Flex minWidth="120px">
              <LogoSkeletonPlaceholder />
            </Flex>

            {/* 桌面导航占位符 */}
            <Flex
              display={{ base: "none", xl: "flex" }}
              ml={{ base: 10, xl: 6 }}
              flex="1">
              <Skeleton height="24px" width="300px" borderRadius="md" />
            </Flex>
          </Flex>

          {/* 右侧按钮占位符 */}
          <Flex justify="flex-end" width="auto" flexShrink={0}>
            <NavButtonsPlaceholder />
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

// 添加完整的钱包和语言选择器占位符
const NavButtonsPlaceholder = () => {
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
      {/* 语言选择器占位符 */}
      <Skeleton width="36px" height="36px" borderRadius="md" flexShrink={0} />

      {/* 钱包连接按钮占位符 */}
      <Skeleton
        width={{ base: "80px", md: "100px" }}
        height="40px"
        borderRadius="md"
        flexShrink={0}
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

  // 提前计算所有颜色值，避免在条件渲染中使用useColorModeValue
  const bgColor = useColorModeValue(
    isXpiPage ? "rgba(0, 0, 0, 0.36)" : "rgba(255,255,255,0.4)",
    "rgba(0, 0, 0, 0.36)" // 更改深色模式背景为半透明黑色，与xpi-web-frontend一致
  )
  const textColor = isXpiPage
    ? "white"
    : useColorModeValue("gray.600", "gray.200")
  // 在XPI页面或深色模式下使用更接近xpi-web-frontend的边框颜色
  const borderColor = useColorModeValue(
    isXpiPage ? "rgba(255, 255, 255, 0.2)" : "gray.200",
    "rgba(255, 255, 255, 0.2)"
  )
  const buttonBgColor = isXpiPage ? "white" : "brand.primary"
  const buttonTextColor = isXpiPage ? "black" : "white"
  const buttonHoverBgColor = isXpiPage ? "gray.200" : "brand.light"
  const iconButtonColor = isXpiPage ? "white" : "inherit"
  const boxShadowValue = useColorModeValue(isXpiPage ? "none" : "sm", "none")
  const menuBgColor = useColorModeValue("white", "gray.800")
  const menuBorderColor = useColorModeValue("gray.200", "gray.700")
  const buttonColorProps = {
    bg: isXpiPage
      ? "brand.primary"
      : useColorModeValue("brand.primary", "brand.dark"),
    color: buttonTextColor,
    _hover: {
      bg: isXpiPage
        ? "brand.light"
        : useColorModeValue("brand.light", "brand.primary"),
    },
    _active: {
      bg: isXpiPage
        ? "brand.primary"
        : useColorModeValue("brand.primary", "brand.dark"),
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

  // 添加更多预计算的样式常量
  const languageButtonProps = {
    color: isXpiPage ? "white" : useColorModeValue("gray.700", "white"),
    borderWidth: "2px",
    borderColor: isXpiPage
      ? "whiteAlpha.400"
      : useColorModeValue("gray.200", "whiteAlpha.400"),
    bg: isXpiPage
      ? "transparent"
      : useColorModeValue("transparent", "transparent"),
    _hover: {
      borderColor: isXpiPage
        ? "whiteAlpha.600"
        : useColorModeValue("gray.300", "whiteAlpha.600"),
      bg: isXpiPage
        ? "whiteAlpha.200"
        : useColorModeValue("gray.50", "whiteAlpha.100"),
    },
    _active: {
      bg: isXpiPage
        ? "whiteAlpha.300"
        : useColorModeValue("gray.100", "whiteAlpha.200"),
    },
  }

  // 预先计算所有语言选项的样式，而不是使用函数
  const enLanguageMenuItemProps = {
    bg:
      language === "en"
        ? useColorModeValue("purple.50", "brand.dark")
        : undefined,
    color:
      language === "en"
        ? useColorModeValue("brand.primary", "white")
        : useColorModeValue("gray.700", "gray.300"),
    _hover: {
      bg: useColorModeValue(
        language === "en" ? "purple.100" : "gray.100",
        language === "en" ? "brand.primary" : "whiteAlpha.200"
      ),
    },
    _active: {
      bg:
        language === "en"
          ? useColorModeValue("brand.primary", "white")
          : useColorModeValue("gray.800", "white"),
    },
  }

  const koLanguageMenuItemProps = {
    bg:
      language === "ko"
        ? useColorModeValue("purple.50", "brand.dark")
        : undefined,
    color:
      language === "ko"
        ? useColorModeValue("brand.primary", "white")
        : useColorModeValue("gray.700", "gray.300"),
    _hover: {
      bg: useColorModeValue(
        language === "ko" ? "purple.100" : "gray.100",
        language === "ko" ? "brand.primary" : "whiteAlpha.200"
      ),
    },
    _active: {
      bg:
        language === "ko"
          ? useColorModeValue("brand.primary", "white")
          : useColorModeValue("gray.800", "white"),
    },
  }

  const zhLanguageMenuItemProps = {
    bg:
      language === "zh"
        ? useColorModeValue("purple.50", "brand.dark")
        : undefined,
    color:
      language === "zh"
        ? useColorModeValue("brand.primary", "white")
        : useColorModeValue("gray.700", "gray.300"),
    _hover: {
      bg: useColorModeValue(
        language === "zh" ? "purple.100" : "gray.100",
        language === "zh" ? "brand.primary" : "whiteAlpha.200"
      ),
    },
    _active: {
      bg:
        language === "zh"
          ? useColorModeValue("brand.primary", "white")
          : useColorModeValue("gray.800", "white"),
    },
  }

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
              <Menu>
                <MenuButton
                  as={Button}
                  variant="outline"
                  {...languageButtonProps}
                  size={{ base: "sm", md: "md" }}
                  fontWeight={600}
                  h={{ base: "36px", md: "40px" }}
                  minW={{ base: "80px", md: "100px" }}
                  width="auto"
                  rightIcon={<ChevronDownIcon />}>
                  {t("language")}
                </MenuButton>
                <MenuList
                  minW="140px"
                  bg={menuBgColor}
                  borderColor={menuBorderColor}
                  boxShadow="lg">
                  <MenuItem
                    fontWeight="500"
                    onClick={() => changeLanguage("en")}
                    {...enLanguageMenuItemProps}>
                    {t("english")}
                  </MenuItem>
                  <MenuItem
                    fontWeight="500"
                    onClick={() => changeLanguage("ko")}
                    {...koLanguageMenuItemProps}>
                    {t("korean")}
                  </MenuItem>
                  <MenuItem
                    fontWeight="500"
                    onClick={() => changeLanguage("zh")}
                    {...zhLanguageMenuItemProps}>
                    {t("chinese")}
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
                  bg={
                    isXpiPage
                      ? "brand.primary"
                      : useColorModeValue("brand.primary", "brand.dark")
                  }
                  color="white"
                  _hover={{
                    bg: isXpiPage
                      ? "brand.light"
                      : useColorModeValue("brand.light", "brand.primary"),
                  }}
                  _active={{
                    bg: isXpiPage
                      ? "brand.primary"
                      : useColorModeValue("brand.primary", "brand.dark"),
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
                    bg={
                      isXpiPage
                        ? "brand.primary"
                        : useColorModeValue("brand.primary", "brand.dark")
                    }
                    color="white"
                    _hover={{
                      bg: isXpiPage
                        ? "brand.light"
                        : useColorModeValue("brand.light", "brand.primary"),
                    }}
                    _active={{
                      bg: isXpiPage
                        ? "brand.primary"
                        : useColorModeValue("brand.primary", "brand.dark"),
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
                  bg={
                    isXpiPage
                      ? "brand.primary"
                      : useColorModeValue("brand.primary", "brand.dark")
                  }
                  color="white"
                  _hover={{
                    bg: isXpiPage
                      ? "brand.light"
                      : useColorModeValue("brand.light", "brand.primary"),
                  }}
                  _active={{
                    bg: isXpiPage
                      ? "brand.primary"
                      : useColorModeValue("brand.primary", "brand.dark"),
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
  const linkColor = isXpiPage
    ? "gray.200"
    : useColorModeValue("gray.600", "gray.200")

  const linkHoverColor = isXpiPage
    ? "white"
    : useColorModeValue("brand.primary", "white")

  const activeLinkColor = isXpiPage
    ? "brand.light"
    : useColorModeValue("brand.primary", "brand.light")

  const activeBgColor = useColorModeValue("brand.background", "gray.700")
  const hoverBgColor = useColorModeValue("gray.50", "gray.700")

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

  // 提前计算所有颜色值，避免在条件渲染中使用useColorModeValue
  const navBgColor = isXpiPage
    ? "gray.900"
    : useColorModeValue("white", "gray.900")
  const buttonBgColor = isXpiPage
    ? "brand.primary"
    : useColorModeValue("brand.primary", "brand.dark")
  // 定义一个统一的按钮选中背景色，确保在所有模式下一致
  const activeButtonBgColor = "brand.primary" // 始终使用品牌主色，无论XPI模式与否
  const buttonTextColor = "white"
  const buttonHoverBgColor = isXpiPage
    ? "brand.light"
    : useColorModeValue("brand.light", "brand.primary")

  // 专门为深色模式定义固定的颜色值
  const darkModeActiveBg = "#5235E8" // 手动设置为brand.primary的颜色值

  // 使用固定的十六进制颜色值代替主题变量，确保一致性
  const activeButtonHexColor = "#5235E8" // 固定为brand.primary的值

  // 提前计算语言按钮的颜色
  const borderColor = isXpiPage
    ? "rgba(255, 255, 255, 0.2)"
    : useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)")
  const languageLabelColor = isXpiPage
    ? "gray.300"
    : useColorModeValue("gray.500", "gray.300")

  const inactiveTextColor = isXpiPage
    ? "gray.200"
    : useColorModeValue("gray.700", "gray.300")
  const inactiveBorderColor = isXpiPage
    ? "whiteAlpha.400"
    : useColorModeValue("gray.200", "whiteAlpha.400")
  const inactiveBgColor = isXpiPage
    ? "transparent"
    : useColorModeValue("white", "transparent")

  const hoverBorderColor = isXpiPage
    ? "whiteAlpha.600"
    : useColorModeValue("gray.300", "whiteAlpha.500")
  const inactiveHoverBgColor = isXpiPage
    ? "whiteAlpha.200"
    : useColorModeValue("gray.50", "whiteAlpha.200")
  const hoverTextColor = useColorModeValue("gray.800", "white")

  const inactiveActiveBgColor = isXpiPage
    ? "whiteAlpha.300"
    : useColorModeValue("gray.100", "whiteAlpha.300")

  const walletBgColor = isXpiPage
    ? "gray.700"
    : useColorModeValue("brand.background", "gray.700")
  const walletTextColor = isXpiPage
    ? "white"
    : useColorModeValue("brand.primary", "white")
  const walletBorderColor = isXpiPage
    ? "gray.600"
    : useColorModeValue("brand.primary", "gray.600")
  const walletHoverBgColor = isXpiPage
    ? "gray.600"
    : useColorModeValue("brand.background", "gray.600")

  const disconnectColor = isXpiPage
    ? "red.300"
    : useColorModeValue(undefined, "red.300")
  const disconnectBorderColor = isXpiPage
    ? "red.300"
    : useColorModeValue(undefined, "red.300")

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
      borderColor={borderColor}
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
      <Box pt={4} pb={2}>
        <Text fontWeight="600" mb={2} color={languageLabelColor} fontSize="sm">
          {t("language")}
        </Text>
        <Stack spacing={2}>
          <Button
            size="sm"
            variant="outline"
            justifyContent="flex-start"
            onClick={() => changeLanguage("en")}
            h="36px"
            color={language === "en" ? "white" : inactiveTextColor}
            borderColor={
              language === "en" ? activeButtonHexColor : inactiveBorderColor
            }
            borderWidth={language === "en" ? "1px" : "1px"}
            bg={language === "en" ? activeButtonHexColor : inactiveBgColor}
            _hover={{
              borderColor:
                language === "en" ? activeButtonHexColor : hoverBorderColor,
              bg: language === "en" ? buttonHoverBgColor : inactiveHoverBgColor,
              color: language === "en" ? "white" : hoverTextColor,
            }}
            _active={{
              bg:
                language === "en"
                  ? activeButtonHexColor
                  : inactiveActiveBgColor,
            }}
            _dark={{
              borderColor:
                language === "en" ? darkModeActiveBg : "whiteAlpha.400",
              color: language === "en" ? "white" : "gray.300",
              bg: language === "en" ? darkModeActiveBg : "transparent",
              opacity: 1,
            }}>
            {t("english")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            justifyContent="flex-start"
            onClick={() => changeLanguage("ko")}
            h="36px"
            color={language === "ko" ? "white" : inactiveTextColor}
            borderColor={
              language === "ko" ? activeButtonHexColor : inactiveBorderColor
            }
            borderWidth={language === "ko" ? "1px" : "1px"}
            bg={language === "ko" ? activeButtonHexColor : inactiveBgColor}
            _hover={{
              borderColor:
                language === "ko" ? activeButtonHexColor : hoverBorderColor,
              bg: language === "ko" ? buttonHoverBgColor : inactiveHoverBgColor,
              color: language === "ko" ? "white" : hoverTextColor,
            }}
            _active={{
              bg:
                language === "ko"
                  ? activeButtonHexColor
                  : inactiveActiveBgColor,
            }}
            _dark={{
              borderColor:
                language === "ko" ? darkModeActiveBg : "whiteAlpha.400",
              color: language === "ko" ? "white" : "gray.300",
              bg: language === "ko" ? darkModeActiveBg : "transparent",
              opacity: 1,
            }}>
            {t("korean")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            justifyContent="flex-start"
            onClick={() => changeLanguage("zh")}
            h="36px"
            color={language === "zh" ? "white" : inactiveTextColor}
            borderColor={
              language === "zh" ? activeButtonHexColor : inactiveBorderColor
            }
            borderWidth={language === "zh" ? "1px" : "1px"}
            bg={language === "zh" ? activeButtonHexColor : inactiveBgColor}
            _hover={{
              borderColor:
                language === "zh" ? activeButtonHexColor : hoverBorderColor,
              bg: language === "zh" ? buttonHoverBgColor : inactiveHoverBgColor,
              color: language === "zh" ? "white" : hoverTextColor,
            }}
            _active={{
              bg:
                language === "zh"
                  ? activeButtonHexColor
                  : inactiveActiveBgColor,
            }}
            _dark={{
              borderColor:
                language === "zh" ? darkModeActiveBg : "whiteAlpha.400",
              color: language === "zh" ? "white" : "gray.300",
              bg: language === "zh" ? darkModeActiveBg : "transparent",
              opacity: 1,
            }}>
            {t("chinese")}
          </Button>
        </Stack>
      </Box>

      {/* 移动端网络选择 */}
      <Box pt={4} pb={2} display="none"></Box>

      {/* 钱包连接/断开 */}
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

  // 提前计算所有颜色值
  const activeLinkColor = isXpiPage
    ? "brand.light"
    : useColorModeValue("brand.primary", "brand.light")

  const linkColor = isXpiPage
    ? "gray.200"
    : useColorModeValue("gray.600", "gray.200")

  const submenuBgColor = isXpiPage
    ? "gray.800"
    : useColorModeValue("gray.50", "gray.800")

  const submenuBorderColor = isXpiPage
    ? "rgba(255, 255, 255, 0.2)"
    : useColorModeValue("gray.200", "rgba(255, 255, 255, 0.2)")

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
