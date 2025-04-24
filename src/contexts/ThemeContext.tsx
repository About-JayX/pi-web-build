'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ThemeContextType {
  isDarkPage: boolean;
  isXpiPage: boolean;
  isSpacePiPage: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkPage: false,
  isXpiPage: false,
  isSpacePiPage: false
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  
  // 判断特殊页面路径
  const isXpiPage = pathname === "/xpi";
  const isSpacePiPage = pathname === "/spacepi";
  const isDarkPage = isXpiPage || isSpacePiPage;
  
  return (
    <ThemeContext.Provider value={{ isDarkPage, isXpiPage, isSpacePiPage }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义 hook，用于在组件中获取主题状态
export const useTheme = () => useContext(ThemeContext); 