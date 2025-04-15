'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Box, Container, Heading, Text, VStack, Stack } from '@chakra-ui/react'
import { useNetwork } from '@/contexts/NetworkContext'
import { useTranslation } from 'react-i18next'

export default function TokenDetailRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const { network } = useNetwork()
  const address = params.address as string
  const { t } = useTranslation()

  useEffect(() => {
    // 根据当前网络自动重定向到对应网络的详情页
    if (network === 'Solana') {
      router.push(`/mint/sol/${address}`)
    } else {
      router.push(`/mint/pi/${address}`)
    }
  }, [network, address, router])

  // 显示加载状态，直到重定向完成
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={10} align="center" justify="center" minH="60vh">
        <Stack spacing={6} align="center">
          <Heading as="h2" size="lg" textAlign="center">
            {t('loadingTokenDetails')}
          </Heading>
          <Text color="gray.500" textAlign="center">
            {t('redirectingToNetwork')}
          </Text>
        </Stack>
      </VStack>
    </Container>
  )
}
