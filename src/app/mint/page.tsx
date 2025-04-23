'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components';

// 这是一个页面组件，而不是之前的功能性函数
export default function MintPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // 当组件加载时重定向到主页面
  useEffect(() => {
    router.push('/');
  }, [router]);

  // 返回一个加载状态，使用通用的LoadingSpinner组件
  return (
    <Container maxW="container.xl" py={12}>
      <LoadingSpinner />
    </Container>
  );
} 