"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import {
  ChakraProvider,
  ColorModeScript,
  createLocalStorageManager,
  Flex,
  Box,
  useColorModeValue,
  Container,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import theme from "@/theme";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { SolanaProvider } from "@/contexts/solanaProvider";
import { I18nProvider } from "@/contexts/I18nProvider";
import { Provider } from "react-redux";
import { store } from "../store";
import { WssProvider } from "@/contexts/WssContext";
import AuthRestorer from "@/contexts/AuthRestorer";
import { usePathname } from "next/navigation";

// 动态导入Navbar，避免SSR
const Navbar = dynamic(() => import("@/components/Navbar"), { 
  ssr: false,
  loading: NavbarPlaceholder,
});
// 动态导入公告组件，避免SSR
const Announcement = dynamic(() => import("@/components/Announcement"), {
  ssr: false,
});

// Navbar占位符，在Navbar加载前显示
function NavbarPlaceholder() {
  // 检测当前路径，确定是否在XPI页面
  const pathname = usePathname();
  const isXpiPage = pathname === "/xpi";
  
  // 为XPI页面使用深色背景，避免闪烁白色背景
  const bgColor = isXpiPage 
    ? "rgba(0, 0, 0, 0.36)" 
    : useColorModeValue('rgba(255,255,255,0.4)', 'rgba(0, 0, 0, 0.36)');
  
  const borderColor = isXpiPage 
    ? "rgba(255, 255, 255, 0.2)" 
    : useColorModeValue('gray.200', 'rgba(255, 255, 255, 0.2)');
  
  const boxShadowValue = isXpiPage 
    ? "none" 
    : "sm";
    
  // 骨架屏颜色
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
      borderBottom="1px"
      borderStyle="solid"
      borderColor={borderColor}
      height="60px"
      width="100%"
      style={{
        backdropFilter: "saturate(180%) blur(8px)",
        WebkitBackdropFilter: "saturate(180%) blur(8px)",
        transition: "all 0.3s ease-out",
      }}
    >
      <Container maxW="container.xl" height="100%">
        <Flex
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 0, xl: 4 }}
          alignItems="center"
          height="100%"
          justify="space-between"
          position="relative"
        >
          {/* 移动端Logo和汉堡菜单占位符 */}
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", xl: "none" }}
            alignItems="center"
          >
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
            width={{ xl: "30%" }}
          >
            <Flex 
              align="center" 
              display={{ base: "none", xl: "flex" }}
              minWidth="120px"
            >
              <Skeleton
                boxSize={{ base: "36px", xl: "40px" }}
                borderRadius="full"
                mr={2}
                startColor={skeletonBg} 
                endColor="rgba(255, 255, 255, 0.3)"
              />
              <Box height="24px" width="80px" display="flex" alignItems="center" minWidth="80px" flexShrink={0} />
            </Flex>
          </Flex>
          
          {/* 导航TAB组，作为一个整体居中 - 移除导航TAB骨架屏 */}
          <Flex
            display={{ base: "none", xl: "flex" }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            width="auto"
          >
            {/* 移除TAB骨架屏，保留空间 */}
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
            width={{ xl: "30%" }}
          >
            {/* 移除语言选择器骨架屏，保留空间 */}
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
        </Flex>
      </Container>
    </Box>
  );
}

// 创建本地存储管理器 - 仅在客户端使用
const localStorageManager = createLocalStorageManager("pi-sale-color-mode");

// 解决Chakra UI的SSR问题的ClientOnly组件
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 在服务器端或者客户端首次渲染前不显示Navbar占位符
  if (!hasMounted) {
    return (
      <>
        <NavbarPlaceholder />
        <main style={{ minHeight: "calc(100vh - 60px)" }}></main>
      </>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WssProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <CacheProvider>
          <ClientOnly>
            <ChakraProvider theme={theme} resetCSS colorModeManager={localStorageManager}>
              <NetworkProvider>
                <SolanaProvider>
                  <I18nProvider>
                    <Box position="relative" minHeight="100vh">
                      <Box
                        position="fixed"
                        top="60px"
                        left="0"
                        right={1}
                        bottom="0"
                        bgImage="/bg.png"
                        bgSize="cover"
                        bgPosition="center"
                        bgRepeat="no-repeat"
                        opacity="0.8"
                        zIndex="0"
                        pointerEvents="none"
                      />
                      
                      <Box position="relative">
                        <AuthRestorer />
                        <Navbar />
                        <main style={{ minHeight: "calc(100vh - 60px)" }}>
                          {children}
                        </main>
                        <Footer />
                        <Announcement />
                      </Box>
                    </Box>
                  </I18nProvider>
                </SolanaProvider>
              </NetworkProvider>
            </ChakraProvider>
          </ClientOnly>
        </CacheProvider>
      </WssProvider>
    </Provider>
  );
}
