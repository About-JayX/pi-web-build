import React from 'react';
import { Box, Text, Button, Icon, VStack, useColorModeValue } from '@chakra-ui/react';
import { IoMdRefresh } from 'react-icons/io';
import { FaSync } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  variant?: 'default' | 'compact';
}

/**
 * 美化的错误展示组件，显示错误信息和重试按钮
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  onRetry, 
  variant = 'default' 
}) => {
  const { t } = useTranslation();
  const errorColor = useColorModeValue('red.500', 'red.300');
  const buttonBgColor = useColorModeValue('purple.500', 'purple.400');
  const buttonHoverBgColor = useColorModeValue('purple.600', 'purple.500');
  
  if (variant === 'compact') {
    return (
      <VStack spacing={4} align="center" justify="center" py={6}>
        <Text
          color={errorColor}
          fontWeight="medium"
          fontSize="lg"
          textAlign="center"
        >
          {message || t('operationFailedTryAgain')}
        </Text>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            borderRadius="full"
            colorScheme="purple"
            bg={buttonBgColor}
            _hover={{ bg: buttonHoverBgColor }}
            leftIcon={<Icon as={IoMdRefresh} boxSize={5} />}
            boxShadow="md"
            px={6}
          >
            {t('tryAgain')}
          </Button>
        )}
      </VStack>
    );
  }
  
  // 默认变体 - 根据截图设计的样式
  return (
    <VStack 
      textAlign="center" 
      py={8} 
      px={4}
      spacing={6}
      maxWidth="400px"
      mx="auto"
    >
      <Text
        color={errorColor}
        fontWeight="bold"
        fontSize="3xl"
        lineHeight="1.2"
      >
        {t('rejected')}
      </Text>
      
      {message && (
        <Text 
          color="gray.600" 
          fontSize="md" 
          maxW="280px"
        >
          {message}
        </Text>
      )}
      
      {onRetry && (
        <Button
          onClick={onRetry}
          borderRadius="md"
          colorScheme="purple"
          bg={buttonBgColor}
          _hover={{ bg: buttonHoverBgColor }}
          leftIcon={<Icon as={FaSync} boxSize={4} />}
          boxShadow="md"
          py={6}
          px={8}
          height="auto"
          minH="52px"
          fontSize="md"
          fontWeight="semibold"
          w="auto"
        >
          {t('tryAgain')}
        </Button>
      )}
    </VStack>
  );
};

export default ErrorDisplay; 