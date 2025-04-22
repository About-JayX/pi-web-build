'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Flex,
  Collapse,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useMintingCalculations } from '@/hooks/useMintingCalculations';

interface MintingInstructionsProps {
  token: {
    symbol: string;
    mintRate?: string;
    currencyUnit?: string;
    network?: string;
    totalSupply?: string;
    target?: string;
  };
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function MintingInstructions({ token, isModal = false, isOpen, onClose }: MintingInstructionsProps) {
  const softBg = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { t } = useTranslation();
  
  // 设置货币单位，默认使用通用货币单位
  const currencyUnit = token.currencyUnit || 'SOL';
  
  // 使用自定义Hook处理铸造计算
  const { 
    mintingRatio, 
    mintingPrice,
    parseMintingPrice 
  } = useMintingCalculations({
    totalSupply: token.totalSupply,
    target: token.target,
    mintRate: token.mintRate,
    currencyUnit,
    tokenDecimals: 6
  });
  
  // 获取铸造价格 - 使用计算结果
  const getMintingPrice = (displayMode: 'price' | 'ratio' = 'price') => {
    if (displayMode === 'ratio') {
      return mintingRatio;
    } else {
      return mintingPrice;
    }
  };
  
  // 设置初始移动端状态和监听窗口大小变化
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 992); // lg breakpoint
    };
    
    // 设置初始状态
    checkIsMobile();
    
    // 添加监听器
    window.addEventListener('resize', checkIsMobile);
    
    // 移除监听器
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // 如果是弹窗模式但不是移动端，需要触发一个关闭效果
  useEffect(() => {
    if (isModal && !isMobile && isOpen && onClose) {
      onClose();
    }
  }, [isModal, isMobile, isOpen, onClose]);
  
  const toggleInstructions = () => setInstructionsOpen(!instructionsOpen);
  
  const renderContent = () => (
    <Box 
      bg={cardBg}
      borderRadius={isModal ? "xl" : "lg"} 
      boxShadow={isModal ? "none" : "md"}
      p={{ base: 3, md: 5 }}
    >
      <Flex 
        justify="space-between" 
        align="center" 
        onClick={toggleInstructions}
        cursor="pointer"
        _hover={{ color: 'brand.primary' }}
        transition="all 0.2s"
      >
        <HStack spacing={{ base: 1, md: 2 }}>
          <Icon as={FaInfoCircle} color="brand.primary" boxSize={{ base: "14px", md: "16px" }} />
          <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>{t('mintingInstructions')}</Text>
        </HStack>
        <IconButton
          aria-label={instructionsOpen ? t('hideInstructions') : t('showInstructions')}
          icon={instructionsOpen ? <FaChevronUp /> : <FaChevronDown />}
          size="sm"
          variant="ghost"
          color="gray.500"
          onClick={e => {
            e.stopPropagation();
            toggleInstructions();
          }}
        />
      </Flex>
      
      <Collapse in={instructionsOpen}>
        <Box 
          bg={softBg} 
          p={{ base: 3, md: 4 }} 
          borderRadius="md" 
          fontSize={{ base: "xs", md: "sm" }}
          mt={{ base: 2, md: 3 }}
        >
          <VStack spacing={{ base: 2, md: 3 }} align="start">
            <Text>
              • {t('minParticipationAmount').replace('{currency}', currencyUnit)}
            </Text>
            <Text>
              • {t('cancelFeeNote').replace('{currency}', currencyUnit)}
            </Text>
            <Text>
              • {t('tokenDeliveryNote')}
            </Text>
            <Text>
              • {t('tradingNote')}
            </Text>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
  
  // 如果是弹窗模式，使用Modal组件包装内容
  if (isModal) {
    // 如果不是移动端，则跳过弹窗，返回空
    if (!isMobile) {
      return null;
    }
    
    return (
      <Modal 
        isOpen={!!isOpen} 
        onClose={onClose || (() => {})} 
        size={{ base: "sm", md: "md" }}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent 
          borderRadius="xl" 
          mx={4} 
          maxH={{ base: "90vh", md: "auto" }}
          overflow="hidden"
        >
          <ModalHeader 
            fontWeight="bold" 
            fontSize={{ base: "lg", md: "xl" }} 
            textAlign="center" 
            pt={4} pb={2}
            bg="brand.primary"
            color="white"
          >
            {token.symbol} {t('mintingInstructions')}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6} px={{ base: 2, md: 3 }} pt={4}>
            {/* 在弹窗模式下自动展开说明内容 */}
            <Box 
              bg={softBg} 
              p={{ base: 3, md: 4 }} 
              borderRadius="md" 
              fontSize={{ base: "xs", md: "sm" }}
            >
              <VStack spacing={{ base: 2, md: 3 }} align="start">
                <Text>
                  • {t('minParticipationAmount').replace('{currency}', currencyUnit)}
                </Text>
                <Text>
                  • {t('cancelFeeNote').replace('{currency}', currencyUnit)}
                </Text>
                <Text>
                  • {t('tokenDeliveryNote')}
                </Text>
                <Text>
                  • {t('tradingNote')}
                </Text>
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  
  // 不是弹窗模式，直接返回内容
  return renderContent();
} 