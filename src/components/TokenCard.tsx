'use client'

import {
  Box,
  Image,
  Text,
  Stack,
  Heading,
  Divider,
  HStack,
  Tag,
  Spacer,
  useColorModeValue,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Flex
} from '@chakra-ui/react'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
import NextLink from 'next/link'

interface TokenCardProps {
  token: {
    id: number
    name: string
    symbol: string
    totalSupply: string
    marketCap: string
    price: string
    image: string
    change24h: string
  }
}

export default function TokenCard({ token }: TokenCardProps) {
  const isPositiveChange = token.change24h.startsWith('+')
  
  return (
    <Card
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="md"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
    >
      <NextLink href={`/market/${token.id}`} passHref>
        <Box>
          <Image 
            src={token.image} 
            alt={token.name}
            width="100%"
            height="200px"
            objectFit="cover"
          />

          <CardBody>
            <Stack gap={4}>
              <Flex justify="space-between" align="center">
                <HStack>
                  <Heading as="h3" size="md">
                    {token.name}
                  </Heading>
                  <Tag colorScheme="purple" size="sm">
                    {token.symbol}
                  </Tag>
                </HStack>
                <Badge
                  colorScheme={isPositiveChange ? 'green' : 'red'}
                  display="flex"
                  alignItems="center"
                >
                  {isPositiveChange ? <FaArrowUp style={{ marginRight: '4px' }} /> : <FaArrowDown style={{ marginRight: '4px' }} />}
                  {token.change24h}
                </Badge>
              </Flex>

              <Text fontSize="sm" color="gray.500" mb={4} noOfLines={2}>
                总供应量: {token.totalSupply}
              </Text>

              <Divider my={3} />

              <Stack gap={0} mt={2}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">
                    市值
                  </Text>
                  <Text fontWeight="semibold">
                    {token.marketCap}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500">
                    价格
                  </Text>
                  <Text fontWeight="semibold">
                    {token.price}
                  </Text>
                </HStack>
              </Stack>
            </Stack>
          </CardBody>
        </Box>
      </NextLink>
    </Card>
  )
} 