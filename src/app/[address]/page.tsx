'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@chakra-ui/react'
import { useNetwork } from '@/contexts/NetworkContext'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components'

export default function TokenDetailRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const { network } = useNetwork()
  const address = params.address as string
  const { t } = useTranslation()

  useEffect(() => {
    // 根据当前网络自动重定向到对应网络的详情页
    if (network === 'SOL') {
      router.push(`/sol/${address}`)
    } else {
      router.push(`/pi/${address}`)
    }
  }, [network, address, router])

  // 显示加载状态，直到重定向完成，使用通用的LoadingSpinner组件
  return (
    <Container maxW="container.xl" py={12}>
      <LoadingSpinner />
    </Container>
  )
}
