"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import {
  ChakraProvider,
  ColorModeScript,
  createLocalStorageManager,
  Box,
  useColorModeValue,
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
import { fetchTokenList } from "@/store/slices/tokenSlice";
import { WssProvider } from "@/contexts/WssContext";
import AuthRestorer from "@/contexts/AuthRestorer";

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
  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="1000"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="sm"
      height="60px"
      width="100%"
    />
  );
}

// 创建本地存储管理器 - 仅在客户端使用
const localStorageManager = createLocalStorageManager("pi-sale-color-mode");

// 解决Chakra UI的SSR问题的ClientOnly组件
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

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
        {/* ColorModeScript 应该在 ClientOnly 之外，以便在服务器端渲染 */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        {/* 使用 CacheProvider 在客户端和服务器端之间共享样式 */}
        <CacheProvider>
          {/* 使用 ClientOnly 确保 ChakraProvider 仅在客户端渲染 */}
          <ClientOnly>
            <ChakraProvider
              theme={theme}
              resetCSS
              colorModeManager={localStorageManager}
            >
              <NetworkProvider>
                <SolanaProvider>
                  <I18nProvider>
                    <AuthRestorer />
                    <Navbar />
                    <main style={{ minHeight: "calc(100vh - 60px)" }}>
                      {children}
                    </main>
                    <Footer />
                    <Announcement />
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
