'use client';

import { Text, Box } from '@chakra-ui/react';

// 简化LogoText组件，去掉不必要的客户端检测
const LogoText = () => {
  return (
    <Box height="24px" width="80px" display="flex" alignItems="center" minWidth="80px" flexShrink={0}>
      <Text
        fontFamily="heading"
        fontWeight="bold"
        fontSize="xl"
        color="brand.primary"
        lineHeight="1"
        whiteSpace="nowrap">
        Pi.Sale
      </Text>
    </Box>
  );
};

export default LogoText; 