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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Flex,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Divider,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaHome, FaArrowLeft, FaPlayCircle, FaCheck, FaRocket, FaCoins, FaExchangeAlt, FaWallet } from 'react-icons/fa';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

export default function TutorialsPage() {
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
            <Text>{t('tutorials')}</Text>
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
          {t('tutorials')}
        </Heading>

        {/* 页面介绍 */}
        <Text fontSize="lg" mb={10}>
          {t('tutorialsDescription')}
        </Text>

        {/* 教程卡片 */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={8}>
          <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)' }}>
            <Box h="160px" bg="brand.primary" position="relative">
              <Flex 
                position="absolute" 
                top="0" 
                left="0" 
                w="100%" 
                h="100%" 
                align="center" 
                justify="center"
                flexDir="column"
                color="white"
              >
                <Icon as={FaRocket} w={12} h={12} mb={3} />
                <Text fontSize="xl" fontWeight="bold" color="white">
                  {t('deployTokenTutorial')}
                </Text>
              </Flex>
            </Box>
            <CardBody py={4}>
              <VStack align="stretch" spacing={3}>
                <Text fontSize="sm">{t('deployTokenDescription')}</Text>
                <Button 
                  rightIcon={<FaPlayCircle />} 
                  colorScheme="purple" 
                  variant="outline"
                  w="full"
                  size="sm"
                  onClick={() => {
                    const element = document.getElementById('deploy-tutorial');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('startLearning')}
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)' }}>
            <Box h="160px" bg="teal.500" position="relative">
              <Flex 
                position="absolute" 
                top="0" 
                left="0" 
                w="100%" 
                h="100%" 
                align="center" 
                justify="center"
                flexDir="column"
                color="white"
              >
                <Icon as={FaCoins} w={12} h={12} mb={3} />
                <Text fontSize="xl" fontWeight="bold" color="white">
                  {t('mintTokenTutorial')}
                </Text>
              </Flex>
            </Box>
            <CardBody py={4}>
              <VStack align="stretch" spacing={3}>
                <Text fontSize="sm">{t('mintTokenDescription')}</Text>
                <Button 
                  rightIcon={<FaPlayCircle />} 
                  colorScheme="teal" 
                  variant="outline"
                  w="full"
                  size="sm"
                  onClick={() => {
                    const element = document.getElementById('mint-tutorial');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('startLearning')}
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden" transition="transform 0.3s" _hover={{ transform: 'translateY(-5px)' }}>
            <Box h="160px" bg="orange.500" position="relative">
              <Flex 
                position="absolute" 
                top="0" 
                left="0" 
                w="100%" 
                h="100%" 
                align="center" 
                justify="center"
                flexDir="column"
                color="white"
              >
                <Icon as={FaExchangeAlt} w={12} h={12} mb={3} />
                <Text fontSize="xl" fontWeight="bold" color="white">
                  {t('tradeTokenTutorial')}
                </Text>
              </Flex>
            </Box>
            <CardBody py={4}>
              <VStack align="stretch" spacing={3}>
                <Text fontSize="sm">{t('tradeTokenDescription')}</Text>
                <Button 
                  rightIcon={<FaPlayCircle />} 
                  colorScheme="orange" 
                  variant="outline"
                  w="full"
                  size="sm"
                  onClick={() => {
                    const element = document.getElementById('trade-tutorial');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('startLearning')}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* 详细教程 - 部署代币 */}
        <Box id="deploy-tutorial" mt={16} mb={16} scrollMarginTop="100px">
          <Heading 
            as="h2" 
            size="xl" 
            mb={6} 
            p={4} 
            bg="brand.primary" 
            color="white" 
            borderRadius="lg"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaRocket} mr={4} /> {t('tutorialDeployTitle')}
          </Heading>
          
          <Accordion allowToggle defaultIndex={[0]}>
            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'brand.primary', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('preparationSteps')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('preparationDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('piWalletReq')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('minBalanceReq')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('tokenInfoReq')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('marketingMaterialsReq')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'brand.primary', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('additionalOptions')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('additionalOptionsDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('logoSetting')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('descriptionSetting')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('websiteSetting')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('socialMediaSetting')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'brand.primary', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('deploymentConfirmation')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('deploymentConfirmationDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('reviewInfoStep')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('approveTransactionStep')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('deploymentTimeNote')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('successfulDeploymentNote')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        {/* 详细教程 - 铸造代币 */}
        <Box id="mint-tutorial" mt={16} mb={16} scrollMarginTop="100px">
          <Heading 
            as="h2" 
            size="xl" 
            mb={6} 
            p={4} 
            bg="teal.500" 
            color="white" 
            borderRadius="lg"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaCoins} mr={4} /> {t('mintTitle')}
          </Heading>
          
          <Accordion allowToggle defaultIndex={[0]}>
            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'teal.500', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('mintPreparation')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('mintPreparationDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('activeWalletReq')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('researchSuggestion')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('understandTokenTerms')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'teal.500', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('mintStepsTitle')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('mintStepsDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('browseMintPage')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('viewTokenDetails')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('tutorialConnectWallet')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('enterMintAmount')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('confirmMintTx')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'teal.500', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('mintManagement')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('mintManagementDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('viewMintedTokens')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('trackProgressStep')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('refundOption')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('participateCommunity')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        {/* 详细教程 - 交易代币 */}
        <Box id="trade-tutorial" mt={16} mb={16} scrollMarginTop="100px">
          <Heading 
            as="h2" 
            size="xl" 
            mb={6} 
            p={4} 
            bg="orange.500" 
            color="white" 
            borderRadius="lg"
            display="flex"
            alignItems="center"
          >
            <Icon as={FaExchangeAlt} mr={4} /> {t('tradeTitle')}
          </Heading>
          
          <Accordion allowToggle defaultIndex={[0]}>
            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'orange.500', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('tradePreparation')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('tradePreparationDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('ensureWalletConnected')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('understandTrading')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('checkTokenLiquidity')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'orange.500', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('buyingTokens')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('buyingTokensDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('tutorialConnectWalletBuy')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('enterBuyAmount')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('confirmPriceDetails')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('clickBuyConfirm')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem mb={4} border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
              <h3>
                <AccordionButton p={4} _expanded={{ bg: 'orange.500', color: 'white' }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
                    {t('sellingTokens')}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h3>
              <AccordionPanel pb={4} bg={cardBg}>
                <VStack align="stretch" spacing={4}>
                  <Text>{t('sellingTokensDesc')}</Text>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('navigateToMarket')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('selectTokenToSell')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('enterSellAmount')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('reviewSaleTerms')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FaCheck} color="green.500" />
                      {t('confirmSaleTx')}
                    </ListItem>
                  </List>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        {/* 额外资源 */}
        <Box mt={16} mb={16}>
          <Heading 
            as="h2" 
            size="lg" 
            mb={6}
            color="purple.600"
          >
            {t('additionalResources')}
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box p={6} bg={cardBg} shadow="md" borderRadius="lg">
              <VStack align="stretch" spacing={4}>
                <Heading size="md" color="brand.primary">
                  {t('walletConnectionGuide')}
                </Heading>
                <Text>
                  {t('walletConnectionGuideDesc')}
                </Text>
                <Button as={NextLink} href="#" colorScheme="purple" variant="outline">
                  {t('readGuide')}
                </Button>
              </VStack>
            </Box>
            
            <Box p={6} bg={cardBg} shadow="md" borderRadius="lg">
              <VStack align="stretch" spacing={4}>
                <Heading size="md" color="brand.primary">
                  {t('tokenEconomicsGuide')}
                </Heading>
                <Text>
                  {t('tokenEconomicsGuideDesc')}
                </Text>
                <Button as={NextLink} href="#" colorScheme="purple" variant="outline">
                  {t('readGuide')}
                </Button>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
} 