'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Button,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  AlertDescription,
  Heading,
  VStack,
  Icon,
  Center,
  Text,
  Stack,
} from '@chakra-ui/react';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { mintingTokensPi, getTokenHolders, TokenHolder } from '@/mock';
import NextLink from 'next/link';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { SkeletonLoading } from '@/components';

// 导入组件
import {
  TokenInfo,
  MintingForm,
  TokenHolders,
  MintingInstructions
} from '@/components/token-detail';

export default function PiTokenDetailPage() {
  const params = useParams();
  const address = params.address as string;
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const { t } = useTranslation();
  
  // 创建mintRef来引用铸造按钮
  const mintRef = useRef<HTMLButtonElement>(null) as React.MutableRefObject<HTMLButtonElement>;
  
  const softBg = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 使用Pi作为货币单位
  const currencyUnit = 'Pi';
  // 使用Pi网络
  const network = 'PI';
  
  useEffect(() => {
    // 模拟从API获取数据
    setLoading(true);
    
    // 从Pi网络的mock数据中查找匹配的代币
    const found = mintingTokensPi.find(t => 
      t.contractAddress === address || t.id.toString() === address
    );
    
    setTimeout(() => {
      setToken(found || null);
      // 获取持有人数据
      if (found?.contractAddress) {
        setHolders(getTokenHolders(found.contractAddress));
      }
      setLoading(false);
    }, 500); // 添加一点延迟以模拟加载
  }, [address]);
  
  // 返回按钮组件
  const BackButton = () => (
    <Link href="/" passHref>
      <Button
        mb={4}
        leftIcon={<ChevronLeftIcon />}
        variant="outline"
        colorScheme="purple"
        size="sm"
      >
        {t('backToMintingHome')}
      </Button>
    </Link>
  );
  
  // 加载状态UI
  if (loading) {
    return <SkeletonLoading />;
  }
  
  // 找不到代币的提示UI
  if (!token) {
    return (
      <Box bg={softBg} minH="100vh" w="100%" pb={10} overflowX="hidden">
        <Container maxW="container.xl" py={12}>
          <VStack spacing={10} align="stretch">
            <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }}>
              <Box>
                <Heading as="h2" size="lg" mb={2}>
                  {t('tokenInfoNetwork').replace('{network}', 'PI')}
                </Heading>
                <Text color="gray.500">{t('mintTokenCancel')}</Text>
              </Box>
              <BackButton />
            </Stack>
            
            <Center flexDirection="column" py={10} px={4} width="100%">
              <Icon as={FaExclamationTriangle} boxSize={12} color="yellow.500" mb={4} />
              <Heading as="h1" size="lg" textAlign="center" mb={4}>
                {t('tokenNotFound')}
              </Heading>
              <Alert status="warning" borderRadius="md" mb={6} width="100%" maxW="600px">
                <AlertIcon />
                <AlertDescription>
                  {t('tokenNotFoundDesc')}
                </AlertDescription>
              </Alert>
            </Center>
          </VStack>
        </Container>
      </Box>
    );
  }
  
  // 主内容UI
  return (
    <Box bg={softBg} minH="100vh" w="100%" pb={10} overflowX="hidden">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={10} align="stretch">
          <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }}>
            <Box>
              <Heading as="h2" size="lg" mb={2}>
                {t('tokenInfoNetwork').replace('{network}', 'PI')}
              </Heading>
              <Text color="gray.500">{t('mintTokenCancel')}</Text>
            </Box>
            <BackButton />
          </Stack>

          <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={8} width="100%">
            <GridItem width="100%" overflow="hidden">
              <TokenInfo token={token} mintRef={mintRef} currencyUnit={currencyUnit} />
              
              <Box width="100%" mt={6}>
                <TokenHolders holders={holders} tokenSymbol={token.symbol} />
              </Box>
            </GridItem>

            {/* PC端显示MintingForm，移动端隐藏 */}
            <GridItem width="100%" overflow="hidden" display={{ base: "none", lg: "block" }}>
              <MintingForm 
                token={{
                  symbol: token.symbol,
                  mintRate: token.mintRate || '0.000001',
                  network: network,
                  currencyUnit: currencyUnit
                }}
              />
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
} 