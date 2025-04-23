import React from 'react';
import {
  Box,
  Container,
  Skeleton,
  VStack,
  Stack,
  Grid,
  GridItem,
  useColorModeValue
} from '@chakra-ui/react';

interface SkeletonLoadingProps {
  /**
   * 自定义容器最大宽度
   * @default 'container.xl'
   */
  maxW?: string;
  
  /**
   * 自定义上下内边距
   * @default 12
   */
  py?: number | string;
  
  /**
   * 自定义最小高度
   * @default '100vh'
   */
  minH?: string;
}

/**
 * 通用骨架加载组件
 * 用于显示详情页的骨架加载状态
 */
const SkeletonLoading = ({
  maxW = 'container.xl',
  py = 12,
  minH = '100vh'
}: SkeletonLoadingProps) => {
  const softBg = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box bg={softBg} minH={minH} w="100%" pb={10} overflowX="hidden">
      <Container maxW={maxW} py={py}>
        <VStack spacing={10} align="stretch">
          <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }}>
            <Box>
              <Skeleton height="32px" width="180px" mb={2} />
              <Skeleton height="16px" width="240px" />
            </Box>
            <Skeleton height="32px" width="120px" />
          </Stack>
          
          <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={8} width="100%">
            <GridItem width="100%" overflow="hidden">
              <Box
                bg={cardBg}
                borderRadius="lg"
                boxShadow="md"
                height={{ base: "320px", md: "400px" }}
                width="100%"
              >
                <Skeleton height="100%" width="100%" />
              </Box>
            </GridItem>

            <GridItem width="100%" overflow="hidden">
              <Box
                bg={cardBg}
                borderRadius="lg"
                boxShadow="md"
                p={{ base: 4, md: 6 }}
                height={{ base: "300px", md: "400px" }}
                width="100%"
              >
                <VStack spacing={6} align="stretch">
                  <Skeleton height="24px" />
                  <Skeleton height="16px" width="80%" />
                  <Skeleton height="40px" borderRadius="md" />
                  <Skeleton height="24px" width="60%" />
                  <Skeleton height="100px" borderRadius="md" />
                  <Skeleton height="40px" borderRadius="md" />
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default SkeletonLoading; 