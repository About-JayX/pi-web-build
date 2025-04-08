'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Select,
  Flex,
  useColorModeValue,
  IconButton,
  Divider,
  Image,
  Card,
  CardBody,
  Switch,
  Tooltip,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  InputGroup,
  InputRightElement,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast
} from '@chakra-ui/react';
import { RepeatIcon, SettingsIcon, ChevronDownIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { FaExchangeAlt, FaCog, FaHistory, FaChartLine, FaInfoCircle, FaAngleDown } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// 模拟令牌数据
const tokens = [
  { id: 1, symbol: 'PI', name: 'Pi Network', logo: '/pi.png', balance: '1,245.32', value: 1243.21 },
  { id: 2, symbol: 'SOL', name: 'Solana', logo: '/sol.png', balance: '3.128', value: 984.00 }
];

export default function SwapPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonColorScheme = 'purple';
  
  // 状态
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [swapping, setSwapping] = useState(false);
  
  // 汇率计算 (模拟)
  const exchangeRate = 0.95; // 1 fromToken = 0.95 toToken
  
  // 当输入金额改变时更新输出金额
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const calculatedAmount = (parseFloat(fromAmount) * exchangeRate).toFixed(6);
      setToAmount(calculatedAmount);
    } else {
      setToAmount('');
    }
  }, [fromAmount, exchangeRate]);
  
  // 反转代币
  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // 重新计算金额
    if (fromAmount) {
      const newFromAmount = toAmount;
      const newToAmount = fromAmount;
      setFromAmount(newFromAmount);
      setToAmount(newToAmount);
    }
  };
  
  // 执行交换 (模拟)
  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: t('swapError'),
        description: t('enterValidAmount'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setSwapping(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      toast({
        title: t('swapSuccess'),
        description: t('swapCompleted', { 
          fromAmount, 
          fromSymbol: fromToken.symbol, 
          toAmount, 
          toSymbol: toToken.symbol 
        }),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // 重置表单
      setFromAmount('');
      setToAmount('');
      setSwapping(false);
    }, 2000);
  };
  
  // 选择最大金额
  const handleMaxAmount = () => {
    // 在实际应用中，这将从钱包余额中获取
    setFromAmount(fromToken.balance.replace(/,/g, ''));
  };
  
  // 渲染代币选择器
  const TokenSelector = ({ value, onChange, isFrom }: { 
    value: any, 
    onChange: (token: any) => void,
    isFrom: boolean
  }) => (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button 
          rightIcon={<ChevronDownIcon />}
          bg={useColorModeValue('gray.100', 'gray.700')}
          _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
          borderRadius="lg"
          px={3}
          py={2}
          height="40px"
          minW="auto"
          w="auto"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          iconSpacing={2}
        >
          <HStack spacing={2}>
            <Image 
              src={value.logo || '/pi.png'} 
              alt={value.symbol}
              fallbackSrc="https://via.placeholder.com/30"
              boxSize="24px"
              borderRadius="full"
            />
            <Text fontWeight="bold">{value.symbol}</Text>
          </HStack>
        </Button>
      </PopoverTrigger>
      <PopoverContent width="300px" borderRadius="lg" boxShadow="xl">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold" borderBottomWidth="1px" py={3} px={4}>{t('selectToken')}</PopoverHeader>
        <PopoverBody p={0}>
          <VStack align="stretch" spacing={0} maxH="300px" overflowY="auto">
            {tokens
              .filter(token => isFrom ? token.id !== toToken.id : token.id !== fromToken.id)
              .map(token => (
                <Button 
                  key={token.id}
                  variant="ghost"
                  justifyContent="flex-start"
                  p={4}
                  h="auto"
                  py={3}
                  onClick={() => onChange(token)}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  borderBottomWidth="1px"
                  borderColor={useColorModeValue('gray.100', 'gray.600')}
                  borderRadius="0"
                  transition="all 0.2s"
                >
                  <HStack spacing={4} width="100%">
                    <Box position="relative" minW="32px">
                      <Image 
                        src={token.logo || '/pi.png'}
                        fallbackSrc="https://via.placeholder.com/30"
                        alt={token.symbol}
                        boxSize="32px"
                        borderRadius="full"
                      />
                    </Box>
                    <VStack align="start" spacing={0} flex="1">
                      <Text fontWeight="bold">{token.symbol}</Text>
                      <Text fontSize="xs" color="gray.500">{token.name}</Text>
                    </VStack>
                    <Text fontSize="sm" fontWeight="medium" textAlign="right">
                      {token.balance}
                    </Text>
                  </HStack>
                </Button>
              ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
  
  // 渲染交易设置
  const SwapSettings = () => (
    <Card 
      bg={useColorModeValue('gray.50', 'gray.700')} 
      borderRadius="lg"
      mb={4}
      boxShadow="sm"
      display={showSettings ? 'block' : 'none'}
      p={0}
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Flex justify="space-between" align="center">
            <HStack>
              <Text fontWeight="medium">{t('slippageTolerance')}</Text>
              <Tooltip label={t('slippageTooltip')}>
                <Box as="span">
                  <QuestionOutlineIcon color="gray.500" />
                </Box>
              </Tooltip>
            </HStack>
            <Text fontWeight="bold">{slippage}%</Text>
          </Flex>
          
          <Slider 
            value={slippage} 
            min={0.1} 
            max={5} 
            step={0.1}
            onChange={(val) => setSlippage(val)}
          >
            <SliderTrack>
              <SliderFilledTrack bg="purple.500" />
            </SliderTrack>
            <SliderThumb boxSize={6} bg="white" border="2px solid" borderColor="purple.500" />
          </Slider>
          
          <HStack>
            {[0.1, 0.5, 1.0, 3.0].map(value => (
              <Button 
                key={value}
                size="xs"
                variant={slippage === value ? "solid" : "outline"}
                colorScheme="purple"
                onClick={() => setSlippage(value)}
              >
                {value}%
              </Button>
            ))}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
  
  // 汇率信息
  const RateInfo = () => (
    <Flex 
      justify="space-between" 
      px={2} 
      py={1} 
      fontSize="sm"
      color="gray.500"
    >
      <Text>{t('rate')}</Text>
      <Text>
        1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}
      </Text>
    </Flex>
  );
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading 
            as="h1" 
            size="xl" 
            mb={2}
            bgGradient="linear(to-r, purple.500, blue.500)"
            bgClip="text"
          >
            {t('swap')}
          </Heading>
          <Text color="gray.500">
            {t('swapDescription')}
          </Text>
        </Box>
        
        <Flex justify="center">
          <Card 
            bg={bgColor} 
            borderRadius="xl" 
            boxShadow="xl"
            w="full"
            maxW="500px"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
          >
            <CardBody p={0}>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" fontSize="lg">{t('swap')}</Text>
                  <IconButton
                    aria-label="Settings"
                    icon={<SettingsIcon w={4} h={4}/>}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    colorScheme="purple"
                  />
                </Flex>
                
                <SwapSettings />
                
                {/* 从代币输入 */}
                <Box 
                  borderWidth="1px" 
                  borderRadius="lg" 
                  p={4}
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.500">{t('from')}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {t('balance')}: {fromToken.balance}
                    </Text>
                  </Flex>
                  
                  <Flex>
                    <InputGroup flex="1" mr={2}>
                      <Input 
                        type="number"
                        placeholder="0.0"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        borderRadius="lg"
                        size="lg"
                        border="none"
                        fontSize="xl"
                        fontWeight="bold"
                        pl={0}
                        pr={16}
                        _focus={{
                          boxShadow: "none",
                        }}
                      />
                      <InputRightElement width="4.5rem" h="full">
                        <Button 
                          h="1.75rem" 
                          size="sm" 
                          onClick={handleMaxAmount}
                          colorScheme="purple"
                          variant="ghost"
                          ml={3}
                        >
                          {t('max')}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    
                    <Box>
                      <TokenSelector 
                        value={fromToken} 
                        onChange={setFromToken}
                        isFrom={true}
                      />
                    </Box>
                  </Flex>
                </Box>
                
                {/* 交换按钮 */}
                <Flex justify="center" my={-2} position="relative" zIndex={2}>
                  <IconButton
                    aria-label="Swap tokens"
                    icon={<RepeatIcon />}
                    onClick={handleSwapTokens}
                    size="md"
                    isRound
                    colorScheme="purple"
                    shadow="md"
                  />
                </Flex>
                
                {/* 目标代币输入 */}
                <Box 
                  borderWidth="1px" 
                  borderRadius="lg" 
                  p={4}
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.500">{t('to')}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {t('balance')}: {toToken.balance}
                    </Text>
                  </Flex>
                  
                  <Flex>
                    <Input 
                      type="number"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      borderRadius="lg"
                      size="lg"
                      border="none"
                      fontSize="xl"
                      fontWeight="bold"
                      flex="1"
                      mr={2}
                      px={0}
                      _focus={{
                        boxShadow: "none",
                      }}
                    />
                    
                    <Box>
                      <TokenSelector 
                        value={toToken} 
                        onChange={setToToken}
                        isFrom={false}
                      />
                    </Box>
                  </Flex>
                </Box>
                
                <Divider />
                
                <RateInfo />
                
                <Button
                  colorScheme={buttonColorScheme}
                  size="lg"
                  w="full"
                  isLoading={swapping}
                  loadingText={t('swapping')}
                  onClick={handleSwap}
                  isDisabled={!fromAmount || parseFloat(fromAmount) <= 0}
                >
                  {t('swapNow')}
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Flex>
        
        {/* 交易历史 */}
        <Box 
          bg={bgColor} 
          p={6} 
          borderRadius="xl" 
          boxShadow="md"
          borderWidth="1px"
          borderColor={borderColor}
          maxW="500px"
          mx="auto"
          w="full"
        >
          <Flex align="center" mb={4}>
            <FaHistory />
            <Heading size="md" ml={2}>
              {t('recentSwaps')}
            </Heading>
          </Flex>
          
          <VStack spacing={3} align="stretch">
            {/* 模拟历史记录 */}
            <Flex 
              p={3} 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor={borderColor}
              bg={useColorModeValue('gray.50', 'gray.700')}
              justify="space-between"
              align="center"
            >
              <HStack>
                <VStack align="start" spacing={0}>
                  <HStack>
                    <Image src="/pi.png" boxSize="16px" borderRadius="full" fallbackSrc="https://via.placeholder.com/16" />
                    <Text fontWeight="bold">12.5 PI</Text>
                    <FaExchangeAlt size="12px" />
                    <Image src="/sol.png" boxSize="16px" borderRadius="full" fallbackSrc="https://via.placeholder.com/16" />
                    <Text fontWeight="bold">12.0 SOL</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">2 {t('minutesAgo')}</Text>
                </VStack>
              </HStack>
              <Badge colorScheme="green">{t('completed')}</Badge>
            </Flex>
            
            <Flex 
              p={3} 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor={borderColor}
              bg={useColorModeValue('gray.50', 'gray.700')}
              justify="space-between"
              align="center"
            >
              <HStack>
                <VStack align="start" spacing={0}>
                  <HStack>
                    <Image src="/sol.png" boxSize="16px" borderRadius="full" fallbackSrc="https://via.placeholder.com/16" />
                    <Text fontWeight="bold">0.12 SOL</Text>
                    <FaExchangeAlt size="12px" />
                    <Image src="/pi.png" boxSize="16px" borderRadius="full" fallbackSrc="https://via.placeholder.com/16" />
                    <Text fontWeight="bold">120 PI</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">15 {t('minutesAgo')}</Text>
                </VStack>
              </HStack>
              <Badge colorScheme="green">{t('completed')}</Badge>
            </Flex>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 