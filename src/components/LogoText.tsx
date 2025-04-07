'use client';

import { Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const LogoText = () => {
  // 使用useState和useEffect来确保只在客户端渲染
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    // 返回一个固定的占位符，避免服务端与客户端渲染不一致
    return (
      <Text
        fontFamily="heading"
        fontWeight="bold"
        fontSize="xl"
        color="brand.primary">
        Pi.Sale
      </Text>
    );
  }
  
  return (
    <Text
      fontFamily="heading"
      fontWeight="bold"
      fontSize="xl"
      color="brand.primary">
      Pi.Sale
    </Text>
  );
};

export default LogoText; 