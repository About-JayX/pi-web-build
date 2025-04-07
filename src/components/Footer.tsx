'use client';

import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter, FaTelegram, FaGithub, FaMedium } from 'react-icons/fa';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight='500' fontSize='lg' mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded='full'
      w={8}
      h={8}
      cursor='pointer'
      as='a'
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display='inline-flex'
      alignItems='center'
      justifyContent='center'
      transition='background 0.3s ease'
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container as={Stack} maxW='container.xl' py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={8}>
          <Stack align='flex-start'>
            <ListHeader>{t('product')}</ListHeader>
            <Link as={NextLink} href='/mint'>{t('mint')}</Link>
            <Link as={NextLink} href='/market'>{t('market')}</Link>
            <Link as={NextLink} href='/deploy'>{t('deploy')}</Link>
          </Stack>

          <Stack align='flex-start'>
            <ListHeader>{t('platform')}</ListHeader>
            <Link href='https://x.com/X_Pi_S' target="_blank" rel="noopener noreferrer">{t('about')}</Link>
            <Link href='https://x.com/X_Pi_S' target="_blank" rel="noopener noreferrer">{t('team')}</Link>
            <Link href='https://x.com/X_Pi_S' target="_blank" rel="noopener noreferrer">{t('contact')}</Link>
          </Stack>

          <Stack align='flex-start'>
            <ListHeader>{t('support')}</ListHeader>
            <Link as={NextLink} href='/docs/api'>{t('apiDocs')}</Link>
            <Link as={NextLink} href='/docs/tutorials'>{t('tutorials')}</Link>
            <Link as={NextLink} href='/docs/disclaimer'>{t('disclaimer')}</Link>
            <Link as={NextLink} href='/docs/privacy'>{t('privacy')}</Link>
          </Stack>

          <Stack align='flex-start'>
            <ListHeader>{t('followUs')}</ListHeader>
            <Stack direction='row' gap={6}>
              <SocialButton label={t('twitter')} href='https://x.com/X_Pi_S'>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={t('telegram')} href='https://t.me/XPi_S'>
                <FaTelegram />
              </SocialButton>
              <SocialButton label={t('github')} href='https://x.com/X_Pi_S'>
                <FaGithub />
              </SocialButton>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle='solid'
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Container
          as={Stack}
          maxW='container.xl'
          py={4}
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}>
          <Text>{t('copyright')}</Text>
          <Text>{t('builtBy')}</Text>
        </Container>
      </Box>
    </Box>
  );
} 