import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  useToast,
  useColorModeValue,
  Box,
  Input,
  IconButton,
  Divider,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaTwitter, FaTelegram, FaCopy, FaLink } from 'react-icons/fa';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: string;
  url: string;
  tokenTicker?: string;
  tokenName?: string;
  contractAddress?: string;
  hashtags?: string[];
}

const ShareModal = ({
  isOpen,
  onClose,
  title = '分享',
  content,
  url,
  tokenTicker,
  tokenName,
  contractAddress,
  hashtags = [],
}: ShareModalProps) => {
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');
  const iconButtonBgColor = useColorModeValue('gray.100', 'gray.700');
  
  // 生成完整的分享内容
  const generateFullContent = () => {
    let fullContent = '';
    
    // 首先添加代币信息
    if (tokenTicker && tokenName) {
      fullContent = `${tokenTicker} - ${tokenName}`;
    }
    
    // 只有在content不为空时才添加content
    if (content && content.trim() !== '') {
      if (fullContent) fullContent += '\n\n';
      fullContent += content;
    }
    
    // 添加CA
    if (contractAddress) {
      if (fullContent) fullContent += '\n\n';
      fullContent += `CA: ${contractAddress}`;
    }
    
    // 添加URL
    if (url) {
      if (fullContent) fullContent += '\n\n';
      fullContent += url;
    }
    
    // 添加Hashtag和$Ticker
    if (hashtags && hashtags.length > 0) {
      if (fullContent) fullContent += '\n\n';
      fullContent += hashtags.map(tag => `#${tag}`).join(' ');
      
      // 在Hashtag后面添加$Ticker
      if (tokenTicker) {
        fullContent += ` $${tokenTicker}`;
      }
    } else if (tokenTicker) {
      // 如果没有Hashtag但有Ticker，也添加$Ticker
      if (fullContent) fullContent += '\n\n';
      fullContent += `$${tokenTicker}`;
    }
    
    return fullContent;
  };
  
  // 生成推特专用的分享内容
  const generateTwitterContent = () => {
    let twitterContent = '';
    
    // 首先添加代币信息
    if (tokenTicker && tokenName) {
      twitterContent = `${tokenTicker} - ${tokenName}`;
    }
    
    // 只有在content不为空时才添加content
    if (content && content.trim() !== '') {
      if (twitterContent) twitterContent += '\n\n';
      twitterContent += content;
    }
    
    // 添加CA
    if (contractAddress) {
      if (twitterContent) twitterContent += '\n\n';
      twitterContent += `CA: ${contractAddress}`;
    }
    
    // 添加URL
    if (url) {
      if (twitterContent) twitterContent += '\n\n';
      twitterContent += url;
    }
    
    // 添加Hashtag和$Ticker
    if (hashtags && hashtags.length > 0) {
      if (twitterContent) twitterContent += '\n\n';
      twitterContent += hashtags.map(tag => `#${tag}`).join(' ');
      
      // 在Hashtag后面添加$Ticker
      if (tokenTicker) {
        twitterContent += ` $${tokenTicker}`;
      }
    } else if (tokenTicker) {
      // 如果没有Hashtag但有Ticker，也添加$Ticker
      if (twitterContent) twitterContent += '\n\n';
      twitterContent += `$${tokenTicker}`;
    }
    
    return twitterContent;
  };
  
  const fullContent = generateFullContent();
  
  // 分享到推特
  const shareToTwitter = () => {
    const twitterContent = generateTwitterContent();
    // 使用完整的文本内容，不再通过URL参数添加hashtags和url
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterContent)}`;
    window.open(twitterUrl, '_blank');
  };
  
  // 分享到电报
  const shareToTelegram = () => {
    // 创建不包含URL的内容，这样在电报中显示时不会在顶部重复显示URL
    let telegramContent = '';
    
    // 首先添加代币信息
    if (tokenTicker && tokenName) {
      telegramContent = `${tokenTicker} - ${tokenName}`;
    }
    
    // 只有在content不为空时才添加content
    if (content && content.trim() !== '') {
      if (telegramContent) telegramContent += '\n\n';
      telegramContent += content;
    }
    
    // 添加CA
    if (contractAddress) {
      if (telegramContent) telegramContent += '\n\n';
      telegramContent += `CA: ${contractAddress}`;
    }
    
    // 添加URL
    if (url) {
      if (telegramContent) telegramContent += '\n\n';
      telegramContent += url;
    }
    
    // 添加Hashtag和$Ticker
    if (hashtags && hashtags.length > 0) {
      if (telegramContent) telegramContent += '\n\n';
      telegramContent += hashtags.map(tag => `#${tag}`).join(' ');
      
      // 在Hashtag后面添加$Ticker
      if (tokenTicker) {
        telegramContent += ` $${tokenTicker}`;
      }
    } else if (tokenTicker) {
      // 如果没有Hashtag但有Ticker，也添加$Ticker
      if (telegramContent) telegramContent += '\n\n';
      telegramContent += `$${tokenTicker}`;
    }
    
    // 使用空字符串作为URL参数，这样Telegram不会在顶部显示它
    const telegramUrl = `https://t.me/share/url?url= &text=${encodeURIComponent(telegramContent)}`;
    window.open(telegramUrl, '_blank');
  };
  
  // 复制分享内容
  const copyContent = () => {
    navigator.clipboard.writeText(fullContent)
      .then(() => {
        toast({
          title: '复制成功',
          description: '内容已复制到剪贴板',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      })
      .catch(() => {
        toast({
          title: '复制失败',
          description: '请手动复制内容',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      });
  };
  
  // 复制分享链接
  const copyLink = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: '复制成功',
          description: '链接已复制到剪贴板',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      })
      .catch(() => {
        toast({
          title: '复制失败',
          description: '请手动复制链接',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      });
  };
  
  // 复制CA
  const copyContractAddress = () => {
    if (!contractAddress) return;
    
    navigator.clipboard.writeText(contractAddress)
      .then(() => {
        toast({
          title: '复制成功',
          description: 'CA已复制到剪贴板',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      })
      .catch(() => {
        toast({
          title: '复制失败',
          description: '请手动复制CA',
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent
        borderRadius="xl"
        boxShadow="0px 8px 24px rgba(0, 0, 0, 0.15)"
        overflow="hidden"
        mx={4}
      >
        <ModalHeader
          fontSize="lg"
          fontWeight="bold"
          py={4}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          {tokenTicker ? `分享 $${tokenTicker}` : '分享'}
        </ModalHeader>
        <ModalCloseButton top={4} />
        
        <ModalBody py={5} px={5}>
          <VStack spacing={5} align="stretch">
            
            <Box>
              <Text fontWeight="medium" fontSize="md" mb={2} color={textColor}>
                复制内容：
              </Text>
              <Flex>
                <Input 
                  value={fullContent.replace(/\n+/g, ' ').length > 80 ? fullContent.replace(/\n+/g, ' ').substring(0, 80) + '...' : fullContent.replace(/\n+/g, ' ')}
                  isReadOnly 
                  bg={inputBgColor}
                  borderColor={borderColor}
                  borderRadius="md"
                  borderRightRadius="0"
                  fontSize="sm"
                />
                <IconButton
                  aria-label="复制内容"
                  icon={<FaCopy />}
                  borderLeftRadius="0"
                  bg="brand.primary"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  onClick={copyContent}
                />
              </Flex>
            </Box>
            
            <Box>
              <Text fontWeight="medium" fontSize="md" mb={2} color={textColor}>
                代币链接：
              </Text>
              <Flex>
                <Input 
                  value={url} 
                  isReadOnly 
                  bg={inputBgColor}
                  borderColor={borderColor}
                  borderRadius="md"
                  borderRightRadius="0"
                  fontSize="sm"
                />
                <IconButton
                  aria-label="复制链接"
                  icon={<FaLink />}
                  borderLeftRadius="0"
                  bg="brand.primary"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  onClick={copyLink}
                />
              </Flex>
            </Box>
            
            <Divider borderColor={borderColor} my={1} />
            
            <Box>
              <Text fontWeight="medium" fontSize="md" mb={3} color={textColor}>
                分享到：
              </Text>
              <HStack spacing={3} justify="center">
                <Button 
                  leftIcon={<Icon as={FaTwitter} />}
                  bg="#1DA1F2"
                  color="white"
                  _hover={{ bg: "#0d8bd9" }}
                  onClick={shareToTwitter}
                  size="md"
                  borderRadius="md"
                  px={6}
                  minW="120px"
                >
                  推特
                </Button>
                <Button 
                  leftIcon={<Icon as={FaTelegram} />} 
                  bg="#0088cc"
                  color="white"
                  _hover={{ bg: "#0077b3" }}
                  onClick={shareToTelegram}
                  size="md"
                  borderRadius="md"
                  px={6}
                  minW="120px"
                >
                  电报
                </Button>
              </HStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal; 