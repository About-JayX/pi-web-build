'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Text, Spinner, VStack, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

// 这是一个页面组件，而不是之前的功能性函数
export default function MintPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // 当组件加载时重定向到主页面
  useEffect(() => {
    router.push('/');
  }, [router]);

  // 返回一个加载状态，这个组件会被预渲染，但随后会立即重定向
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={6}>
        <Heading size="lg">{t('redirecting')}</Heading>
        <Spinner size="xl" color="brand.primary" thickness="4px" />
        <Text>{t('loadingTokenDetails')}</Text>
      </VStack>
    </Container>
  );
} 