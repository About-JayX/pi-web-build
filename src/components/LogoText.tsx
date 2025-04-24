'use client';

import { Text, Box, useColorModeValue } from '@chakra-ui/react';
import { useTheme } from '@/contexts/ThemeContext';

// 简化LogoText组件，去掉不必要的客户端检测和属性传递
const LogoText = () => {
  // 使用ThemeContext获取页面主题状态
  const { isDarkPage } = useTheme();
  
  // 深色页面强制使用白色
  const textColor = isDarkPage ? "white" : "brand.primary";

  return (
    <Box height="24px" width="80px" display="flex" alignItems="center" minWidth="80px" flexShrink={0}>
      <Text
        fontFamily="EDIX, sans-serif"
        fontWeight="bold"
        fontSize="xl"
        color={textColor}
        lineHeight="1"
        whiteSpace="nowrap">
        Pi.Sale
      </Text>
    </Box>
  );
};

export default LogoText; 