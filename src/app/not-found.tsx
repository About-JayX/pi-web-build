'use client'

import React from 'react';
import { Box, Heading, Text, Button, Icon, VStack, Container, useColorModeValue } from '@chakra-ui/react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function NotFound() {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('purple.100', 'purple.700');

  return (
    <Container maxW="container.xl" py={20}>
      <Box
        p={8}
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
        maxW="lg"
        mx="auto"
      >
        <VStack spacing={6}>
          <Icon as={FaExclamationTriangle} boxSize={16} color="purple.500" />
          
          <Heading as="h1" size="xl" color="purple.500">
            404
          </Heading>
          
          <Heading as="h2" size="md">
            {t('pageNotFound')}
          </Heading>
          
          <Text color="gray.500">
            {t('pageNotFoundMessage')}
          </Text>
          
          <Button
            as={Link}
            href="/"
            leftIcon={<FaHome />}
            size="lg"
            colorScheme="purple"
            variant="solid"
            mt={4}
          >
            {t('backToHome')}
          </Button>
        </VStack>
      </Box>
    </Container>
  );
} 