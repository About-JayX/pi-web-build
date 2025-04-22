'use client';

import {
  Box,
  Container,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const linkColor = useColorModeValue('gray.500', 'gray.400');
  const hoverColor = useColorModeValue('gray.700', 'gray.300');
  
  return (
    <Box
      bg={useColorModeValue('black', 'gray.900')}
      color={useColorModeValue('gray.400', 'gray.400')}
      py={4}>
      <Container maxW='container.xl'>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'center' }}
          gap={{ base: 4, md: 0 }}>
          <Text>{t('copyright')}</Text>
          <Flex gap={4} flexWrap="wrap" justify={{ base: 'center', md: 'flex-end' }}>
            <Link 
              as={NextLink} 
              href='/docs/api'
              color={linkColor}
              _hover={{ color: hoverColor, textDecoration: 'none' }}>
              {t('apiDocs')}
            </Link>
            <Link 
              as={NextLink} 
              href='/docs/tutorials'
              color={linkColor}
              _hover={{ color: hoverColor, textDecoration: 'none' }}>
              {t('tutorials')}
            </Link>
            <Link 
              as={NextLink} 
              href='/docs/disclaimer'
              color={linkColor}
              _hover={{ color: hoverColor, textDecoration: 'none' }}>
              {t('disclaimer')}
            </Link>
            <Link 
              as={NextLink} 
              href='/docs/privacy'
              color={linkColor}
              _hover={{ color: hoverColor, textDecoration: 'none' }}>
              {t('privacy')}
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
} 