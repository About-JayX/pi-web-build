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
  Icon,
  Flex,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

interface DeploySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenMint: string;
  tokenName: string;
  tokenSymbol: string;
}

const DeploySuccessModal: React.FC<DeploySuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  tokenMint, 
  tokenName, 
  tokenSymbol 
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleViewToken = () => {
    router.push(`/sol/${tokenMint}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent bg={bgColor} borderRadius="xl" p={2}>
        <ModalHeader textAlign="center" color={textColor}>
          {t('deploySuccess')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center flexDirection="column" py={4}>
            <Icon as={FaCheckCircle} color="green.500" boxSize={16} mb={4} />
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {t('tokenCreatedSuccessfully')}
            </Text>
            <Text textAlign="center" mb={4}>
              {t('yourTokenHasBeenDeployed', { name: tokenName, symbol: tokenSymbol })}
            </Text>
            <Box bg="gray.100" p={4} borderRadius="md" width="100%" mb={4}>
              <Text fontWeight="semibold" mb={1}>{t('tokenName')}: {tokenName}</Text>
              <Text fontWeight="semibold" mb={1}>{t('tokenSymbol')}: {tokenSymbol}</Text>
              <Flex alignItems="center">
                <Text fontWeight="semibold" mr={1}>{t('tokenContract')}:</Text>
                <Text isTruncated>{tokenMint}</Text>
              </Flex>
            </Box>
          </Center>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button 
            onClick={handleViewToken} 
            colorScheme="purple" 
            size="lg" 
            width="100%" 
            rightIcon={<FaExternalLinkAlt />}
          >
            {t('viewTokenDetails')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeploySuccessModal; 