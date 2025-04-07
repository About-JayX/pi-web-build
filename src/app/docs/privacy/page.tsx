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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaHome, FaArrowLeft, FaShieldAlt, FaUserSecret, FaDatabase, FaCookieBite, FaGlobe } from 'react-icons/fa';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const accordionBg = useColorModeValue('purple.50', 'purple.900');
  const accordionActiveBg = useColorModeValue('purple.100', 'purple.800');

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
            <Text>{t('privacy')}</Text>
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
          {t('privacy')}
        </Heading>

        {/* 简介 */}
        <Card bg={cardBg} shadow="md" borderRadius="lg" mb={8}>
          <CardBody>
            <HStack mb={6}>
              <Icon as={FaShieldAlt} boxSize={8} color="brand.primary" />
              <Heading size="lg">{t('privacySummary')}</Heading>
            </HStack>
            <Text fontSize="lg" mb={4}>
              {t('privacySummaryText')}
            </Text>
            <Text fontSize="md" fontStyle="italic">
              {t('lastUpdated')}
            </Text>
          </CardBody>
        </Card>

        {/* 隐私政策详细内容 */}
        <Accordion allowToggle defaultIndex={[0]} mb={8}>
          {/* 信息收集 */}
          <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <h2>
              <AccordionButton 
                p={4} 
                _expanded={{ bg: 'brand.primary', color: 'white' }}
                _hover={{ bg: accordionBg }}
              >
                <HStack flex="1" textAlign="left">
                  <Icon as={FaUserSecret} />
                  <Text fontWeight="semibold">{t('informationCollection')}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  {t('informationCollectionText')}
                </Text>
                <UnorderedList spacing={2} pl={5}>
                  <ListItem><strong>{t('accountInfo')}</strong></ListItem>
                  <ListItem><strong>{t('transactionInfo')}</strong></ListItem>
                  <ListItem><strong>{t('usageData')}</strong></ListItem>
                  <ListItem><strong>{t('deviceInfo')}</strong></ListItem>
                </UnorderedList>
                <Text fontWeight="medium">
                  {t('sensitiveDataNote')}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* 信息使用 */}
          <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <h2>
              <AccordionButton 
                p={4} 
                _expanded={{ bg: 'brand.primary', color: 'white' }}
                _hover={{ bg: accordionBg }}
              >
                <HStack flex="1" textAlign="left">
                  <Icon as={FaDatabase} />
                  <Text fontWeight="semibold">{t('informationUse')}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  {t('informationUseText')}
                </Text>
                <UnorderedList spacing={2} pl={5}>
                  <ListItem><strong>{t('serviceProvision')}</strong></ListItem>
                  <ListItem><strong>{t('serviceImprovement')}</strong></ListItem>
                  <ListItem><strong>{t('securityProtection')}</strong></ListItem>
                  <ListItem><strong>{t('communication')}</strong></ListItem>
                  <ListItem><strong>{t('complianceRequirements')}</strong></ListItem>
                </UnorderedList>
                <Text>
                  {t('dataRetention')}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* 信息共享 */}
          <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <h2>
              <AccordionButton 
                p={4} 
                _expanded={{ bg: 'brand.primary', color: 'white' }}
                _hover={{ bg: accordionBg }}
              >
                <HStack flex="1" textAlign="left">
                  <Icon as={FaGlobe} />
                  <Text fontWeight="semibold">{t('informationSharing')}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  {t('informationSharingText')}
                </Text>
                <UnorderedList spacing={2} pl={5}>
                  <ListItem><strong>{t('serviceProviders')}</strong></ListItem>
                  <ListItem><strong>{t('businessTransfer')}</strong></ListItem>
                  <ListItem><strong>{t('legalRequirements')}</strong></ListItem>
                  <ListItem><strong>{t('userConsent')}</strong></ListItem>
                </UnorderedList>
                <Text fontWeight="medium">
                  {t('blockchainNote')}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Cookie使用 */}
          <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <h2>
              <AccordionButton 
                p={4} 
                _expanded={{ bg: 'brand.primary', color: 'white' }}
                _hover={{ bg: accordionBg }}
              >
                <HStack flex="1" textAlign="left">
                  <Icon as={FaCookieBite} />
                  <Text fontWeight="semibold">{t('cookieUsage')}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  {t('cookieUsageText')}
                </Text>
                <UnorderedList spacing={2} pl={5}>
                  <ListItem>{t('rememberPreferences')}</ListItem>
                  <ListItem>{t('understandUsage')}</ListItem>
                  <ListItem>{t('optimizePerformance')}</ListItem>
                  <ListItem>{t('personalizeContent')}</ListItem>
                </UnorderedList>
                <Text>
                  {t('cookieManagement')}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* 安全措施 */}
          <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <h2>
              <AccordionButton 
                p={4} 
                _expanded={{ bg: 'brand.primary', color: 'white' }}
                _hover={{ bg: accordionBg }}
              >
                <HStack flex="1" textAlign="left">
                  <Icon as={FaShieldAlt} />
                  <Text fontWeight="semibold">{t('dataSecurity')}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  {t('dataSecurityText')}
                </Text>
                <UnorderedList spacing={2} pl={5}>
                  <ListItem>{t('encryptionTech')}</ListItem>
                  <ListItem>{t('accessControl')}</ListItem>
                  <ListItem>{t('securityAudits')}</ListItem>
                  <ListItem>{t('staffTraining')}</ListItem>
                </UnorderedList>
                <Text fontWeight="medium">
                  {t('securityLimitation')}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* 用户权利 */}
          <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <h2>
              <AccordionButton 
                p={4} 
                _expanded={{ bg: 'brand.primary', color: 'white' }}
                _hover={{ bg: accordionBg }}
              >
                <HStack flex="1" textAlign="left">
                  <Icon as={FaUserSecret} />
                  <Text fontWeight="semibold">{t('userRights')}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  {t('userRightsText')}
                </Text>
                <UnorderedList spacing={2} pl={5}>
                  <ListItem><strong>{t('accessRight')}</strong></ListItem>
                  <ListItem><strong>{t('correctionRight')}</strong></ListItem>
                  <ListItem><strong>{t('deletionRight')}</strong></ListItem>
                  <ListItem><strong>{t('restrictionRight')}</strong></ListItem>
                  <ListItem><strong>{t('portabilityRight')}</strong></ListItem>
                  <ListItem><strong>{t('objectionRight')}</strong></ListItem>
                </UnorderedList>
                <Text>
                  {t('rightsExercise')}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* 儿童隐私 */}
          <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <h2>
              <AccordionButton 
                p={4} 
                _expanded={{ bg: 'brand.primary', color: 'white' }}
                _hover={{ bg: accordionBg }}
              >
                <HStack flex="1" textAlign="left">
                  <Icon as={FaUserSecret} />
                  <Text fontWeight="semibold">{t('childrenPrivacy')}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  {t('childrenPrivacyText')}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* 政策更新 */}
          <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
            <h2>
              <AccordionButton 
                p={4} 
                _expanded={{ bg: 'brand.primary', color: 'white' }}
                _hover={{ bg: accordionBg }}
              >
                <HStack flex="1" textAlign="left">
                  <Icon as={FaDatabase} />
                  <Text fontWeight="semibold">{t('policyUpdates')}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg={cardBg}>
              <VStack align="stretch" spacing={4}>
                <Text>
                  {t('policyUpdatesText1')}
                </Text>
                <Text>
                  {t('policyUpdatesText2')}
                </Text>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* 联系我们 */}
        <Card bg={cardBg} shadow="md" borderRadius="lg">
          <CardBody>
            <Heading size="lg" color="brand.primary" mb={4}>{t('contactUs')}</Heading>
            <Text mb={4}>
              {t('contactUsText')}
            </Text>
            <VStack align="start" spacing={2} pl={5} mb={4}>
              <Text><strong>{t('emailContact')}</strong></Text>
            </VStack>
            <Text>
              {t('responseCommitment')}
            </Text>
            <Divider my={4} />
            <Text color="gray.500" fontSize="sm">
              {t('lastUpdated')}
            </Text>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
} 