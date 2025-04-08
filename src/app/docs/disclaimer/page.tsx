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
  Card,
  CardBody,
  Divider,
  UnorderedList,
  ListItem,
  Alert,
  AlertIcon,
  AlertTitle,
  useColorModeValue
} from '@chakra-ui/react';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

export default function DisclaimerPage() {
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
            <Text>{t('disclaimer')}</Text>
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
          {t('disclaimer')}
        </Heading>

        {/* 免责声明内容 */}
        <Card bg={cardBg} shadow="md" borderRadius="lg">
          <CardBody p={{base:0,sm:6}}>
            <VStack align="stretch" spacing={8}>
              {/* 重要提示 */}
              <Alert
                status="warning"
                variant="solid"
                borderRadius="md"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                py={4}
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  {t('readDisclaimerWarning')}
                </AlertTitle>
                <Text color="white">
                  {t('disclaimerAgreement')}
                </Text>
              </Alert>

              {/* 服务描述 */}
              <Box>
                <Heading size="lg" color="brand.primary" mb={4}>
                  {t('serviceDescription')}
                </Heading>
                <Text mb={4}>
                  {t('serviceDescriptionText1')}
                </Text>
                <Text>
                  {t('serviceDescriptionText2')}
                </Text>
              </Box>

              {/* 风险提示 */}
              <Box>
                <Heading size="lg" color="brand.primary" mb={4}>
                  {t('riskStatement')}
                </Heading>
                <Text mb={4}>
                  {t('riskStatementText1')}
                </Text>
                <UnorderedList spacing={2} pl={5} mb={4}>
                  <ListItem>{t('marketVolatility')}</ListItem>
                  <ListItem>{t('liquidityRisk')}</ListItem>
                  <ListItem>{t('technicalRisk')}</ListItem>
                  <ListItem>{t('regulatoryRisk')}</ListItem>
                  <ListItem>{t('projectRisk')}</ListItem>
                  <ListItem>{t('politicalRisk')}</ListItem>
                  <ListItem>{t('crossBorderRisk')}</ListItem>
                </UnorderedList>
                <Text fontWeight="bold">
                  {t('riskStatementText2')}
                </Text>
              </Box>

              {/* 责任限制 */}
              <Box>
                <Heading size="lg" color="brand.primary" mb={4}>
                  {t('liabilityLimitation')}
                </Heading>
                <Text mb={4}>
                  {t('liabilityLimitationText')}
                </Text>
                <UnorderedList spacing={2} pl={5} mb={4}>
                  <ListItem>{t('projectSuccessLiability')}</ListItem>
                  <ListItem>{t('financialLossLiability')}</ListItem>
                  <ListItem>{t('serviceLiability')}</ListItem>
                  <ListItem>{t('legalLiability')}</ListItem>
                  <ListItem>{t('thirdPartyLiability')}</ListItem>
                </UnorderedList>
                <Text>
                  {t('liabilityLimitationText2')}
                </Text>
              </Box>

              {/* 用户责任 */}
              <Box>
                <Heading size="lg" color="brand.primary" mb={4}>
                  {t('userResponsibility')}
                </Heading>
                <Text mb={4}>
                  {t('userResponsibilityText')}
                </Text>
                <UnorderedList spacing={2} pl={5} mb={4}>
                  <ListItem>{t('projectLegal')}</ListItem>
                  <ListItem>{t('accountSecurity')}</ListItem>
                  <ListItem>{t('riskAssessment')}</ListItem>
                  <ListItem>{t('intellectualProperty')}</ListItem>
                  <ListItem>{t('illegalActivities')}</ListItem>
                </UnorderedList>
                <Text fontWeight="medium">
                  {t('violationConsequences')}
                </Text>
              </Box>

              {/* 知识产权 */}
              <Box>
                <Heading size="lg" color="brand.primary" mb={4}>
                  {t('intellectualPropertyRights')}
                </Heading>
                <Text mb={4}>
                  {t('intellectualPropertyText1')}
                </Text>
                <Text>
                  {t('intellectualPropertyText2')}
                </Text>
              </Box>

              {/* 用户隐私 */}
              <Box>
                <Heading size="lg" color="brand.primary" mb={4}>
                  {t('privacyPolicy')}
                </Heading>
                <Text mb={4}>
                  {t('privacyPolicyText1')}
                </Text>
                <Text>
                  {t('privacyPolicyText2')}
                </Text>
              </Box>

              {/* 法律适用 */}
              <Box>
                <Heading size="lg" color="brand.primary" mb={4}>
                  {t('applicableLaw')}
                </Heading>
                <Text mb={4}>
                  {t('applicableLawText1')}
                </Text>
                <Text fontWeight="medium">
                  {t('applicableLawText2')}
                </Text>
              </Box>
              
              {/* 更新通知 */}
              <Box>
                <Heading size="lg" color="brand.primary" mb={4}>
                  {t('disclaimerUpdates')}
                </Heading>
                <Text mb={4}>
                  {t('disclaimerUpdatesText1')}
                </Text>
                <Text>
                  {t('disclaimerUpdatesText2')}
                </Text>
              </Box>
              
              <Divider />
              
              {/* 联系方式 */}
              <Box>
                <Text fontWeight="medium">
                  {t('contactInfo')}
                </Text>
                <Text mt={2}>
                  邮箱：team@pi.sale
                </Text>
              </Box>
              
              {/* 最后更新日期 */}
              <Text color="gray.500" fontSize="sm" mt={4}>
                {t('lastUpdated', { date: '2025年04月06日' })}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
} 