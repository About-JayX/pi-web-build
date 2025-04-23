import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Code,
  Heading,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  errorDetails?: any;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  errorDetails
}) => {
  // 仅在开发环境中显示
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    return null;
  }

  const bgColor = useColorModeValue('red.50', 'red.900');
  const borderColor = useColorModeValue('red.500', 'red.600');
  const headerColor = useColorModeValue('red.700', 'red.300');
  
  let errorDetailsText = '';
  
  if (errorDetails) {
    if (typeof errorDetails === 'string') {
      errorDetailsText = errorDetails;
    } else if (errorDetails instanceof Error) {
      errorDetailsText = errorDetails.stack || errorDetails.message;
    } else {
      try {
        errorDetailsText = JSON.stringify(errorDetails, null, 2);
      } catch (e) {
        errorDetailsText = String(errorDetails);
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent 
        borderWidth="2px" 
        borderColor={borderColor}
        bg={bgColor}
      >
        <ModalHeader 
          display="flex" 
          alignItems="center" 
          color={headerColor}
          borderBottomWidth="1px"
          borderBottomColor={borderColor}
          pb={3}
        >
          <Icon as={FaExclamationTriangle} mr={2} />
          <Heading size="md">严重错误</Heading>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={4}>
          <Text fontWeight="bold" fontSize="lg" mb={3}>
            {errorMessage}
          </Text>
          
          {errorDetailsText && (
            <Box mt={4}>
              <Text fontWeight="semibold" mb={2}>详细错误信息：</Text>
              <Code p={3} borderRadius="md" whiteSpace="pre-wrap" display="block" overflowX="auto" width="100%">
                {errorDetailsText}
              </Code>
            </Box>
          )}
          
          <Box mt={6} p={3} bg="blackAlpha.200" borderRadius="md">
            <Text fontSize="sm" color="gray.600">
              注意：此错误提示仅在开发环境中可见。请修复此问题以确保应用程序正常运行。
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" onClick={onClose}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal; 