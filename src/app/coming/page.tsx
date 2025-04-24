'use client';

import { Box, Container, Heading, Text, Button, VStack, Image, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ComingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Container maxW="container.xl" py={20}>
      <VStack 
        spacing={8} 
        align="center" 
        bg={bgColor} 
        p={10} 
        borderRadius="xl" 
        boxShadow="md"
      >
        <Image 
          src="/images/coming-soon.png" 
          alt="Coming Soon"
          boxSize="150px"
        />
        
        <Heading size="2xl" textAlign="center" color={textColor}>
          {t('common.coming_soon')}
        </Heading>
        
        <Text fontSize="xl" textAlign="center" color={textColor} maxW="600px">
          {t('common.coming_soon_message')}
        </Text>
        
        <Button 
          colorScheme="blue" 
          size="lg" 
          onClick={() => router.push('/')}
        >
          {t('common.back_to_home')}
        </Button>
      </VStack>
    </Container>
  );
} 