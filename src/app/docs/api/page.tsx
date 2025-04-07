'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  Divider,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
} from '@chakra-ui/react';
import { FaHome, FaCode, FaArrowLeft } from 'react-icons/fa';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

export default function ApiDocsPage() {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={10}>
        {/* 面包屑导航 */}
        <Breadcrumb mb={6} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href="/">
              <HStack spacing={1}>
                <FaHome />
                <Text>{t('home')}</Text>
              </HStack>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>{t('apiDocs')}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* 返回按钮 */}
        <Button
          as={NextLink}
          href="/"
          size="sm"
          leftIcon={<FaArrowLeft />}
          mb={6}
          variant="outline"
          colorScheme="purple"
        >
          {t('backToHome')}
        </Button>

        {/* 页面标题 */}
        <Heading
          as="h1"
          size="2xl"
          mb={10}
          bgGradient="linear(to-r, purple.600, brand.primary)"
          bgClip="text"
          fontWeight="bold"
        >
          {t('apiDocs')}
        </Heading>

        {/* API文档内容 */}
        <VStack spacing={8} align="stretch">
          {/* 简介部分 */}
          <Card bg={cardBg} shadow="md" borderRadius="lg">
            <CardBody>
              <Heading size="lg" mb={4} color="brand.primary">
                {t('apiIntroduction')}
              </Heading>
              <Text mb={4}>
                {t('apiDescriptionText', 'Pi.Sale API 允许开发者与 Pi.Sale 平台交互，获取代币数据、部署代币合约，以及访问市场信息。本文档提供了所有可用 API 的详细信息。')}
              </Text>
              <HStack mb={4}>
                <Badge colorScheme="green" fontSize="sm">
                  {t('apiVersion')}: v1.0.0
                </Badge>
                <Badge colorScheme="blue" fontSize="sm">
                  {t('apiStatus', '状态')}: {t('apiStatusStable', '稳定')}
                </Badge>
              </HStack>
              <Text fontWeight="medium">
                {t('baseUrl')}: <Code>https://api.pi.sale/v1</Code>
              </Text>
            </CardBody>
          </Card>

          {/* API选项卡 */}
          <Card bg={cardBg} shadow="md" borderRadius="lg">
            <CardBody>
              <Tabs colorScheme="purple" isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>{t('authentication')}</Tab>
                  <Tab>{t('tokenEndpoints')}</Tab>
                  <Tab>{t('marketEndpoints')}</Tab>
                  <Tab>{t('deployEndpoints')}</Tab>
                </TabList>
                <TabPanels>
                  {/* 认证部分 */}
                  <TabPanel>
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md" color="brand.primary">
                        {t('authentication')}
                      </Heading>
                      <Text>
                        {t('authDescription')}
                      </Text>
                      <Box bg="gray.50" p={4} borderRadius="md" fontFamily="mono">
                        <Text>
                          Authorization: Bearer YOUR_API_KEY
                        </Text>
                      </Box>
                      <Heading size="sm" mt={4}>
                        {t('rateLimit')}
                      </Heading>
                      <Text>
                        {t('rateLimitDescription', 'API 请求限制为每分钟 60 次。如果超过限制，您将收到 429 响应状态码。')}
                      </Text>
                    </VStack>
                  </TabPanel>

                  {/* 代币端点 */}
                  <TabPanel>
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <Heading size="md" color="brand.primary" mb={2}>
                          GET /tokens
                        </Heading>
                        <Text mb={2}>{t('listTokensEndpoint')}</Text>
                        <Divider my={2} />
                        <Text fontWeight="medium" mt={4} mb={2}>
                          {t('requestParameters')}:
                        </Text>
                        <Box bg="gray.50" p={4} borderRadius="md" fontFamily="mono">
                          <Text>page: {t('pageParamDesc', '页码 (默认: 1)')}</Text>
                          <Text>limit: {t('limitParamDesc', '每页数量 (默认: 20, 最大: 100)')}</Text>
                          <Text>sort: {t('sortParamDesc', '排序字段 (可选: created_at, name, symbol, market_cap)')}</Text>
                          <Text>order: {t('orderParamDesc', '排序方向 (可选: asc, desc)')}</Text>
                        </Box>
                      </Box>

                      <Box>
                        <Heading size="md" color="brand.primary" mb={2}>
                          GET /tokens/:id
                        </Heading>
                        <Text mb={2}>{t('getTokenDetailsEndpoint')}</Text>
                        <Divider my={2} />
                        <Text fontWeight="medium" mt={4}>
                          {t('responseExample')}:
                        </Text>
                        <Box bg="gray.50" p={4} borderRadius="md" fontFamily="mono" fontSize="sm" overflowX="auto">
                          <pre>
{`{
  "id": "1",
  "name": "Example Token",
  "symbol": "EXT",
  "contract_address": "0x1234...",
  "total_supply": "1000000",
  "decimals": 18,
  "network": "Pi",
  "created_at": "2023-10-15T08:30:00Z",
  "icon_url": "https://pi.sale/icons/ext.png",
  "description": "${t('exampleTokenDesc', '示例代币描述')}",
  "website": "https://example.com",
  "social_links": {
    "twitter": "https://twitter.com/example",
    "telegram": "https://t.me/example"
  },
  "market_data": {
    "price_usd": "0.05",
    "market_cap": "50000",
    "volume_24h": "12500",
    "change_24h": "3.5"
  }
}`}
                          </pre>
                        </Box>
                      </Box>
                    </VStack>
                  </TabPanel>

                  {/* 市场端点 */}
                  <TabPanel>
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <Heading size="md" color="brand.primary" mb={2}>
                          GET /market/stats
                        </Heading>
                        <Text mb={2}>{t('getMarketOverviewEndpoint')}</Text>
                        <Divider my={2} />
                        <Text fontWeight="medium" mt={4}>
                          {t('responseExample')}:
                        </Text>
                        <Box bg="gray.50" p={4} borderRadius="md" fontFamily="mono" fontSize="sm" overflowX="auto">
                          <pre>
{`{
  "total_tokens": 256,
  "total_market_cap": "15000000",
  "volume_24h": "1250000",
  "active_users": 8700,
  "trending_tokens": ["TOKEN1", "TOKEN2", "TOKEN3"]
}`}
                          </pre>
                        </Box>
                      </Box>

                      <Box>
                        <Heading size="md" color="brand.primary" mb={2}>
                          GET /market/trades
                        </Heading>
                        <Text mb={2}>{t('getMarketTradesEndpoint', '获取最近交易记录')}</Text>
                        <Divider my={2} />
                        <Text fontWeight="medium" mt={4} mb={2}>
                          {t('requestParameters')}:
                        </Text>
                        <Box bg="gray.50" p={4} borderRadius="md" fontFamily="mono">
                          <Text>token_id: {t('tokenIdParamDesc', '代币ID (可选)')}</Text>
                          <Text>limit: {t('limitParamDesc', '每页数量 (默认: 20, 最大: 100)')}</Text>
                        </Box>
                      </Box>
                    </VStack>
                  </TabPanel>

                  {/* 部署端点 */}
                  <TabPanel>
                    <VStack align="stretch" spacing={6}>
                      <Box>
                        <Heading size="md" color="brand.primary" mb={2}>
                          POST /deploy/token
                        </Heading>
                        <Text mb={2}>{t('createTokenEndpoint')}</Text>
                        <Divider my={2} />
                        <Text fontWeight="medium" mt={4} mb={2}>
                          {t('requestBodyTitle', '请求体')}:
                        </Text>
                        <Box bg="gray.50" p={4} borderRadius="md" fontFamily="mono" fontSize="sm" overflowX="auto">
                          <pre>
{`{
  "name": "${t('exampleTokenName', '示例代币')}",
  "symbol": "EXT",
  "total_supply": "1000000",
  "decimals": 18,
  "description": "${t('exampleTokenDesc', '这是一个示例代币')}",
  "icon_url": "https://example.com/icon.png",
  "website": "https://example.com",
  "social_links": {
    "twitter": "https://twitter.com/example",
    "telegram": "https://t.me/example"
  }
}`}
                          </pre>
                        </Box>
                      </Box>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>

          {/* SDK部分 */}
          <Card bg={cardBg} shadow="md" borderRadius="lg">
            <CardBody>
              <Heading size="lg" mb={4} color="brand.primary">
                {t('sdkIntegration', 'SDK & 集成')}
              </Heading>
              <Text mb={4}>
                {t('sdkDescription', 'Pi.Sale 提供了多种编程语言的SDK，方便开发者集成我们的API：')}
              </Text>
              <VStack align="stretch" spacing={3}>
                <Button size="md" leftIcon={<FaCode />} colorScheme="purple" variant="outline">
                  {t('javascriptSdk', 'JavaScript SDK')}
                </Button>
                <Button size="md" leftIcon={<FaCode />} colorScheme="purple" variant="outline">
                  {t('pythonSdk', 'Python SDK')}
                </Button>
                <Button size="md" leftIcon={<FaCode />} colorScheme="purple" variant="outline">
                  {t('javaSdk', 'Java SDK')}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
} 