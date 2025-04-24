'use client';

import { Text, Box, useColorModeValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

// 简化LogoText组件，去掉不必要的客户端检测
const LogoText = () => {
  const pathname = usePathname();
  // 判断是否在 XPI 页面，如果是则使用白色文本
  const isXpiPage = pathname === "/xpi";
  const textColor = isXpiPage ? "white" : "brand.primary";

  return (
    <Box height="24px" width="80px" display="flex" alignItems="center" minWidth="80px" flexShrink={0}>
      <Text
        fontFamily="EDIX, heading"
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