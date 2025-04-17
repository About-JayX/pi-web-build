'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Flex,
  useColorModeValue,
  Image,
  Card,
  CardBody,
  Divider,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  Grid,
  GridItem,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Icon,
  Center,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FaTwitter,
  FaTelegram,
  FaLink,
  FaGift,
  FaVoteYea,
  FaGem,
  FaHistory,
  FaCheck,
  FaCopy,
  FaUserPlus,
  FaStar,
  FaWallet,
  FaTrophy,
  FaCoins,
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'

// 从模拟数据文件导入
import { leaderboardData, REWARDS } from '@/mock/pointsData'

export default function PointsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const accentColor = useColorModeValue('purple.500', 'purple.300')
  const highlightBg = useColorModeValue('purple.50', 'purple.900')

  const { isOpen, onOpen, onClose } = useDisclosure() // 用于控制积分历史模态框
  const {
    isOpen: isUsageOpen,
    onOpen: onUsageOpen,
    onClose: onUsageClose,
  } = useDisclosure() // 用于控制积分用途模态框

  const { userInfo } = useAppSelector(state => state.user)

  // 签到
  const handleCheckin = () => {
    toast({
      title: t('checkedIn'),
      description: t('checkedIn'),
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    })
  }

  // 复制邀请链接
  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(userInfo.code)
      .then(() => {
        toast({
          title: t('copySuccess'),
          description: t('copyLinkSuccess'),
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      })
      .catch(error => {
        toast({
          title: t('failed'),
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      })
  }

  // 分享到Telegram
  const handleShareToTelegram = () => {
    const text = encodeURIComponent(
      `${t('inviteSuccessReward')}\n${userInfo.code}`
    )
    window.open(`https://t.me/share/url?url=${text}`, '_blank')
  }

  // 分享到Twitter/X
  const handleShareToX = () => {
    const text = encodeURIComponent(
      `${t('inviteSuccessReward')}\n${userInfo.code}`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  // 通用分享
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: t('inviteFriendsTitle'),
          text: t('inviteSuccessReward'),
          url: userInfo.code,
        })
        .catch(error => {
          console.log('Share error:', error)
          toast({
            title: t('failed'),
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          })
        })
    } else {
      // 如果设备不支持分享API，则复制链接
      handleCopyInviteLink()
    }
  }

  // 连接社交账号
  const handleConnectSocial = (platform: 'telegram' | 'twitter') => {
    const isConnected =
      platform === 'telegram' ? userInfo.telegramId : userInfo.twitterId

    if (isConnected) return

    toast({
      title: platform === 'telegram' ? t('socialBound') : t('socialBound'),
      description: t('connectReward', { points: REWARDS.connectSocial }),
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    })
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // 获取活动描述
  const getActivityDescription = (activity: string) => {
    return t(activity)
  }

  // 在钱包地址显示部分为SOL格式缩短处理函数
  const formatSolAddress = (address: string) => {
    if (address.length > 12) {
      return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`
    }
    return address
  }

  if (!userInfo) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4} align="center">
          <Heading size="lg">{t('请先登录')}</Heading>
          <Text color="gray.500">{t('登录后查看您的积分信息')}</Text>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* 个人积分概览（突出显示）- 紫色卡片 */}
        <Box
          bgGradient="linear(to-r, purple.600, purple.700)"
          borderRadius="xl"
          p={{ base: 4, md: 8 }}
          color="white"
          boxShadow="lg"
        >
          <Grid
            templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
            gap={{ base: 4, md: 6 }}
            height="auto"
          >
            {/* 左侧：用户信息和积分 */}
            <GridItem display="flex" flexDirection="column">
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                alignItems={{ base: 'center', sm: 'flex-start' }}
                mb={{ base: 3, md: 4 }}
              >
                {/* 用户头像和名称 */}
                <Avatar
                  size={{ base: 'lg', md: 'xl' }}
                  name={userInfo.nickname}
                  src={userInfo.avatar_url}
                  bg="white"
                  color="purple.500"
                  borderWidth="3px"
                  borderColor="purple.300"
                  mb={{ base: 2, sm: 0 }}
                  mr={{ base: 0, sm: 4 }}
                />

                <VStack
                  align={{ base: 'center', sm: 'flex-start' }}
                  spacing={0}
                  w="full"
                >
                  <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="bold"
                    color="white"
                    textShadow="0 1px 2px rgba(0,0,0,0.2)"
                    textAlign={{ base: 'center', sm: 'left' }}
                  >
                    {userInfo.nickname}
                  </Text>

                  {/* 钱包地址显示 - 调整颜色和格式 */}
                  <Flex
                    mt={1}
                    direction="row"
                    flexWrap="wrap"
                    gap={{ base: 3, sm: 2, md: 2 }}
                    justifyContent={{ base: 'center', sm: 'flex-start' }}
                    alignItems="center"
                    width="100%"
                  >
                    <HStack
                      bg="whiteAlpha.300"
                      p={1.5}
                      px={3}
                      borderRadius="full"
                      borderWidth="1px"
                      borderColor="whiteAlpha.400"
                      mr={{ base: 0, md: 2 }}
                    >
                      <Icon as={FaWallet} color="yellow.300" boxSize={4} />
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="white"
                        fontFamily="mono"
                      >
                        {formatSolAddress(userInfo.solana_wallet)}
                      </Text>
                    </HStack>

                    <Flex
                      direction={{ base: 'row', md: 'row' }}
                      flexWrap="wrap"
                      justify={{ base: 'center', sm: 'flex-start' }}
                      gap={2}
                    >
                      {/* 绑定电报按钮 */}
                      <HStack
                        bg={userInfo.telegramId ? 'whiteAlpha.400' : 'blue.600'}
                        p={1.5}
                        px={3}
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor={
                          userInfo.telegramId ? 'whiteAlpha.400' : 'blue.500'
                        }
                        cursor={userInfo.telegramId ? 'default' : 'pointer'}
                        onClick={() =>
                          !userInfo.telegramId &&
                          handleConnectSocial('telegram')
                        }
                        opacity={userInfo.telegramId ? 0.8 : 1}
                        _hover={
                          !userInfo.telegramId
                            ? {
                                bg: 'blue.500',
                              }
                            : {}
                        }
                      >
                        <Icon as={FaTelegram} color="white" boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium" color="white">
                          {userInfo.telegramId ? t('socialBound') : t('bind')}
                        </Text>
                        {userInfo.telegramId && (
                          <Icon
                            as={FaCheck}
                            color="green.300"
                            boxSize={3}
                            ml={1}
                          />
                        )}
                      </HStack>

                      {/* 绑定推特按钮 */}
                      <HStack
                        bg={
                          userInfo.twitterId ? 'whiteAlpha.400' : 'twitter.600'
                        }
                        p={1.5}
                        px={3}
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor={
                          userInfo.twitterId ? 'whiteAlpha.400' : 'twitter.500'
                        }
                        cursor={userInfo.twitterId ? 'default' : 'pointer'}
                        onClick={() =>
                          !userInfo.twitterId && handleConnectSocial('twitter')
                        }
                        opacity={userInfo.twitterId ? 0.8 : 1}
                        _hover={
                          !userInfo.twitterId
                            ? {
                                bg: 'twitter.500',
                              }
                            : {}
                        }
                      >
                        <Icon as={FaTwitter} color="white" boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium" color="white">
                          {userInfo.twitterId ? t('socialBound') : t('bind')}
                        </Text>
                        {userInfo.twitterId && (
                          <Icon
                            as={FaCheck}
                            color="green.300"
                            boxSize={3}
                            ml={1}
                          />
                        )}
                      </HStack>
                    </Flex>
                  </Flex>
                </VStack>
              </Flex>

              {/* 积分显示 */}
              <Flex
                bg="whiteAlpha.200"
                p={{ base: 4, md: 5 }}
                borderRadius="lg"
                mb={0}
                align="center"
                justify="space-between"
                height="auto"
                flex="1"
                mt="auto"
                minHeight={{ base: '100px', md: '120px' }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <HStack mb={{ base: 3, sm: 0 }}>
                  <Icon as={FaCoins} boxSize={7} color="yellow.300" mr={3} />
                  <Box>
                    <Text fontSize="sm" opacity={0.8} color="white">
                      {t('totalPoints')}
                    </Text>
                    <Text
                      fontSize="3xl"
                      fontWeight="bold"
                      lineHeight="1.2"
                      color="white"
                      textShadow="0 1px 3px rgba(0,0,0,0.3)"
                    >
                      {userInfo.token}
                    </Text>
                  </Box>
                </HStack>

                <VStack spacing={2} w={{ base: '100%', sm: 'auto' }}>
                  {/* 积分历史按钮 */}
                  <Button
                    leftIcon={<Icon as={FaHistory} />}
                    size="sm"
                    colorScheme="yellow"
                    variant="solid"
                    onClick={onOpen}
                    fontWeight="bold"
                    px={4}
                    bg="yellow.400"
                    color="black"
                    boxShadow="0px 2px 4px rgba(0,0,0,0.2)"
                    _hover={{ bg: 'yellow.500' }}
                    w="full"
                  >
                    {t('pointsHistory')}
                  </Button>

                  {/* 积分用途按钮 */}
                  <Button
                    leftIcon={<Icon as={FaGem} />}
                    size="sm"
                    colorScheme="purple"
                    variant="solid"
                    onClick={onUsageOpen}
                    fontWeight="bold"
                    px={4}
                    bg="purple.500"
                    color="white"
                    boxShadow="0px 2px 4px rgba(0,0,0,0.2)"
                    _hover={{ bg: 'purple.600' }}
                    w="full"
                  >
                    {t('pointsUsage')}
                  </Button>
                </VStack>
              </Flex>
            </GridItem>

            {/* 右侧：签到 */}
            <GridItem display="flex">
              <VStack
                bg="whiteAlpha.200"
                p={5}
                borderRadius="lg"
                align="stretch"
                h="full"
                justify="flex-end"
                boxShadow="sm"
                width="100%"
                spacing={4}
              >
                <HStack mb={1}>
                  <Icon as={FaGift} boxSize={5} color="yellow.300" />
                  <Text fontWeight="bold" fontSize="lg" color="white">
                    {t('dailyCheckin')}
                  </Text>
                  <Badge
                    ml="auto"
                    bg="yellow.400"
                    color="black"
                    px={2}
                    borderRadius="full"
                    fontWeight="bold"
                  >
                    +{REWARDS.dailyCheckin}
                  </Badge>
                </HStack>

                <Text fontSize="sm" opacity={0.9} mb={3} color="white"></Text>

                <Button
                  colorScheme="yellow"
                  onClick={handleCheckin}
                  leftIcon={<FaCheck />}
                  mt="auto"
                  bg="yellow.400"
                  color="black"
                  fontWeight="bold"
                  size="lg"
                  _hover={{ bg: 'yellow.500' }}
                >
                  {t('checkin')}
                </Button>
              </VStack>
            </GridItem>
          </Grid>
        </Box>

        {/* 邀请好友卡片 - 重构设计 */}
        <Card
          variant="outline"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="sm"
          bg={bgColor}
        >
          <CardBody p={{ base: 0, sm: 6 }}>
            <VStack spacing={5} align="stretch">
              <Flex
                justifyContent="space-between"
                alignItems={{ base: 'flex-start', md: 'center' }}
                flexDirection={{ base: 'column', md: 'row' }}
              >
                <HStack spacing={3} mb={{ base: 3, md: 0 }}>
                  <Icon as={FaUserPlus} color={accentColor} boxSize={5} />
                  <Heading size="md">{t('inviteFriendsTitle')}</Heading>
                  <Badge
                    colorScheme="purple"
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    +{REWARDS.inviteFriend}
                  </Badge>
                </HStack>
                <HStack
                  spacing={2}
                  flexWrap="wrap"
                  justifyContent={{ base: 'flex-start', md: 'flex-end' }}
                  w={{ base: '100%', md: 'auto' }}
                >
                  {/* 复制链接按钮 */}
                  <HStack
                    bg="gray.200"
                    p={1.5}
                    px={3}
                    borderRadius="full"
                    borderWidth="1px"
                    borderColor="gray.300"
                    cursor="pointer"
                    onClick={handleCopyInviteLink}
                    _hover={{ bg: 'gray.300' }}
                    _dark={{
                      bg: 'gray.700',
                      borderColor: 'gray.600',
                      _hover: { bg: 'gray.600' },
                    }}
                    mb={{ base: 2, md: 0 }}
                  >
                    <Icon
                      as={FaCopy}
                      color="gray.600"
                      boxSize={4}
                      _dark={{ color: 'gray.300' }}
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color="gray.700"
                      _dark={{ color: 'white' }}
                    >
                      {t('copyInviteLink')}
                    </Text>
                  </HStack>

                  {/* 分享到电报按钮 */}
                  <HStack
                    bg="blue.600"
                    p={1.5}
                    px={3}
                    borderRadius="full"
                    borderWidth="1px"
                    borderColor="blue.500"
                    cursor="pointer"
                    onClick={handleShareToTelegram}
                    _hover={{ bg: 'blue.700' }}
                    mb={{ base: 2, md: 0 }}
                  >
                    <Icon as={FaTelegram} color="white" boxSize={4} />
                    <Text fontSize="sm" fontWeight="bold" color="white">
                      {t('share')}
                    </Text>
                  </HStack>

                  {/* 分享到推特按钮 */}
                  <HStack
                    bg="#1DA1F2"
                    p={1.5}
                    px={3}
                    borderRadius="full"
                    borderWidth="1px"
                    borderColor="#0d8bd9"
                    cursor="pointer"
                    onClick={handleShareToX}
                    _hover={{ bg: '#0d8bd9' }}
                    mb={{ base: 2, md: 0 }}
                  >
                    <Icon as={FaTwitter} color="white" boxSize={4} />
                    <Text fontSize="sm" fontWeight="bold" color="white">
                      {t('share')}
                    </Text>
                  </HStack>
                </HStack>
              </Flex>

              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: 'gray.300' }}
              >
                {t('inviteSuccessReward')}
              </Text>

              <Box>
                <Text
                  fontWeight="medium"
                  mb={2}
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: 'gray.300' }}
                >
                  {t('yourInviteLink')}
                </Text>
                <Input
                  value={userInfo.code}
                  readOnly
                  bg="white"
                  borderColor={borderColor}
                  borderRadius="md"
                  _dark={{ bg: 'gray.800' }}
                  width="100%"
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* 排行榜 - 现在放在最下方 */}
        <Card
          variant="outline"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="md"
        >
          <Box bg={accentColor} p={4} color="white">
            <HStack>
              <Icon as={FaTrophy} color="white" boxSize={{ base: 5, sm: 6 }} />
              <Heading size={{ base: 'sm', sm: 'md' }} color="white">
                {t('leaderboard')}
              </Heading>
            </HStack>
          </Box>
          <CardBody p={0}>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                  <Tr>
                    <Th width="80px">{t('rank')}</Th>
                    <Th>{t('user')}</Th>
                    <Th>{t('walletAddress')}</Th>
                    <Th isNumeric>{t('pointsPoints')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {leaderboardData.map((entry, index) => (
                    <Tr
                      key={entry.id}
                      bg={entry.isCurrentUser ? highlightBg : undefined}
                    >
                      <Td>
                        {index < 3 ? (
                          <Center
                            boxSize="30px"
                            borderRadius="full"
                            bg={
                              index === 0
                                ? 'yellow.400'
                                : index === 1
                                ? 'gray.300'
                                : 'orange.300'
                            }
                            color="white"
                            fontWeight="bold"
                          >
                            {index + 1}
                          </Center>
                        ) : (
                          <Text
                            fontWeight={entry.isCurrentUser ? 'bold' : 'normal'}
                          >
                            {index + 1}
                          </Text>
                        )}
                      </Td>
                      <Td>
                        <HStack>
                          <Avatar
                            size="sm"
                            name={entry.username}
                            src={entry.avatar}
                          />
                          <Text
                            fontWeight={entry.isCurrentUser ? 'bold' : 'normal'}
                          >
                            {entry.username}
                            {entry.isCurrentUser && (
                              <Text as="span" fontSize="xs" color={accentColor}>
                                ({t('you')})
                              </Text>
                            )}
                          </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Icon as={FaWallet} color="gray.500" boxSize={3} />
                          <Text
                            fontSize="sm"
                            fontFamily="mono"
                            fontWeight="medium"
                          >
                            {formatSolAddress(entry.walletAddress)}
                          </Text>
                        </HStack>
                      </Td>
                      <Td isNumeric>
                        <Text
                          color={entry.isCurrentUser ? accentColor : 'gray.600'}
                          fontWeight="bold"
                          _dark={{
                            color: entry.isCurrentUser
                              ? 'purple.300'
                              : 'gray.300',
                          }}
                        >
                          {entry.points.toLocaleString()}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}
