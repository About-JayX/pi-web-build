"use client"

import { useState, useEffect } from "react"
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
  Card,
  CardBody,
  Badge,
  Input,
  Grid,
  GridItem,
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
} from "@chakra-ui/react"
import {
  FaXTwitter,
  FaTelegram,
  FaGift,
  FaGem,
  FaHistory,
  FaCheck,
  FaCopy,
  FaUserPlus,
  FaWallet,
  FaTrophy,
  FaCoins,
  FaLink,
} from "react-icons/fa"
import { useTranslation } from "react-i18next"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { UserAPI } from "@/api"
import type {
  RankItem,
  RankResponse,
  SignInInfoResponse,
  HistoryResponse,
  PointsItem,
} from "@/api/types"
import { setSignInInfo, setUserInfo } from "@/store/slices/userSlice"
import { useWss } from "@/contexts/WssContext"

// 从模拟数据文件导入
import { REWARDS } from "@/mock/pointsData"

export default function PointsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const dispatch = useAppDispatch()
  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const accentColor = useColorModeValue("purple.500", "purple.300")
  const highlightBg = useColorModeValue("purple.50", "purple.900")
  const tableHeadBg = useColorModeValue("gray.50", "gray.700")

  const { userInfo, authToken, signInInfo } = useAppSelector(
    (state) => state.user
  )

  const [WssUserData, setWssUserData] = useState<any>({
    code: "",
    token: 0,
    telegramId: "",
    twitterId: "",
  })

  const [rankList, setRankList] = useState<RankItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenData, setTokenData] = useState<any[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure() // 用于控制积分历史模态框

  // 使用WebSocket上下文
  const { socket } = useWss()

  // 发送WebSocket消息的方法
  const sendWssMessage = (mode: string, data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ mode, data: data })
      socket.send(message)
      console.log("发送WebSocket消息:", message)
    } else {
      console.warn("WebSocket未连接")
    }
  }

  const [pointsHistory, setPointsHistory] = useState<PointsItem[]>([])
  const [pointsTotal, setPointsTotal] = useState<number>(0)
  const [pointsPage, setPointsPage] = useState<number>(1)
  const [pointsLimit, setPointsLimit] = useState<number>(50)

  // 获取积分历史
  const fetchPointsHistory = async () => {
    const result = (await UserAPI.getPointsHistory(
      pointsPage,
      pointsLimit
    )) as HistoryResponse
    if (result.success) {
      console.log("历史记录", result.data.data)
      setPointsTotal(Number(result.data.total))
      setPointsPage(pointsPage + 1)
      setPointsHistory(result.data.data)
    }
  }

  // 监听WebSocket消息
  useEffect(() => {
    if (!socket) return

    const handleMessage = async (event: MessageEvent) => {
      try {
        const response = JSON.parse(event.data)
        console.log("收到WebSocket消息:", response)

        if (response.mode === "user_info") {
          //更新用户信息
          // dispatch(setUserInfo(response.data))
          setWssUserData(response.data)
        }

        if (response.mode === "bind_telegram_code") {
          window.location.href = response.data.code
        }
      } catch (error) {
        console.error("解析WebSocket消息失败:", error)
      }
    }

    // 添加消息监听器
    socket.addEventListener("message", handleMessage)

    // 清理函数
    return () => {
      socket.removeEventListener("message", handleMessage)
    }
  }, [socket, toast, t])

  // 示例：在组件挂载时发送ping消息
  useEffect(() => {
    const sendAuthMessage = async () => {
      //等待两秒
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log(socket, userInfo, "in")

      if (socket && userInfo?.solana_wallet) {
        await sendWssMessage("auth_user", {
          publicKey: userInfo.solana_wallet,
          token: localStorage.getItem("token"),
        })
      }
    }
    sendAuthMessage()
  }, [socket, userInfo])

  // 获取签到信息
  useEffect(() => {
    const fetchSignInInfo = async () => {
      try {
        const result = (await UserAPI.getSignInInfo()) as SignInInfoResponse
        if (result.success) {
          dispatch(setSignInInfo(result.data))
        }
      } catch (error) {
        console.error("获取签到信息失败:", error)
      }
    }

    const sendAuthMessage = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (userInfo && authToken) {
        await sendWssMessage("edit_auth_user", {
          publicKey: userInfo.solana_wallet,
          token: localStorage.getItem("token"),
        })
      }
    }

    if (userInfo && authToken) {
      fetchSignInInfo()
      fetchPointsHistory()
      // console.log("切换钱包了")
      sendAuthMessage()
    }
  }, [userInfo, authToken, dispatch])

  // 签到
  const handleCheckin = async () => {
    if (signInInfo?.todaySignedIn) {
      toast({
        title: t("今日已签到"),
        description: t("请明天再来"),
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
      return
    }

    try {
      const result = (await UserAPI.signin()) as SignInInfoResponse
      if (result.success) {
        // 签到成功后重新获取签到信息
        const signInResult =
          (await UserAPI.getSignInInfo()) as SignInInfoResponse
        if (signInResult.success) {
          dispatch(setSignInInfo(signInResult.data))
        }

        toast({
          title: t("签到成功"),
          description: result.msg,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        })
        await sendWssMessage("get_user_info", {})
      } else {
        toast({
          title: t("签到失败"),
          description: result.msg,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        })
      }
    } catch (error) {
      toast({
        title: t("签到失败"),
        description: error instanceof Error ? error.message : "请稍后重试",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    }
  }

  // 获取活动描述
  const getActivityDescription = (activity: string) => {
    return t(activity)
  }

  // 复制邀请链接
  const handleCopyInviteLink = () => {
    if (!WssUserData?.code) return
    const baseUrl = window.location.origin
    const inviteLink = `${baseUrl}/points?code=${WssUserData.code}`
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        title: t("copySuccess"),
        status: "success",
        duration: 2000,
      })
    })
  }

  // 分享到Telegram
  const handleShareToTelegram = () => {
    if (!WssUserData?.code) return
    const baseUrl = window.location.origin
    const inviteLink = `${baseUrl}/points?code=${WssUserData.code}`
    const text = encodeURIComponent(
      `${t("inviteSuccessReward")}\n${inviteLink}`
    )
    window.open(`https://t.me/share/url?url=${text}`, "_blank")
  }

  // 分享到Twitter/X
  const handleShareToX = () => {
    if (!WssUserData?.code) return
    const baseUrl = window.location.origin
    const inviteLink = `${baseUrl}?code=${WssUserData.code}`
    const text = encodeURIComponent(
      `${t("inviteSuccessReward")}\n${inviteLink}`
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  // 连接社交账号
  const handleConnectSocial = (platform: "telegram" | "twitter") => {
    if (!userInfo) return
    const isConnected =
      platform === "telegram" ? WssUserData.telegramId : WssUserData.twitterId

    if (isConnected) return

    if (socket) {
      socket.send(
        JSON.stringify({
          mode: "bind_telegram",
        })
      )
    }

    toast({
      title: platform === "telegram" ? t("socialBound") : t("socialBound"),
      description: t("connectReward", { points: REWARDS.connectSocial }),
      status: platform === "telegram" ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    })
  }

  // 在钱包地址显示部分为SOL格式缩短处理函数
  const formatSolAddress = (address: string | undefined, length = 6) => {
    if (!address) return "-"
    if (address.length > 12) {
      return `${address.substring(0, length)}...${address.substring(
        address.length - length
      )}`
    }
    return address
  }

  // 获取排行榜数据
  useEffect(() => {
    const fetchRankList = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = (await UserAPI.getRank()) as { data: RankResponse }
        if (result.data) {
          setRankList(result.data.data || [])
        } else {
          setError(t("获取排行榜失败"))
          setRankList([])
        }
      } catch (error) {
        console.error("获取排行榜失败:", error)
        setError(t("获取排行榜失败"))
        setRankList([])
      } finally {
        setIsLoading(false)
      }
    }

    // if (userInfo && authToken) {
    //   fetchRankList()
    // }
    fetchRankList()
  }, [userInfo, authToken, t])

  // 渲染排行榜
  const RenderRankList = ({
    rank = 0,
    nickname,
    token,
    avatar_url,
  }: RankItem) => {
    return (
      <GridItem
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}>
        <Avatar
          name={nickname}
          src={avatar_url}
          w={
            rank === 1
              ? { base: "80px", sm: "110px" }
              : { base: "60px", sm: "90px" }
          }
          h={
            rank === 1
              ? { base: "80px", sm: "110px" }
              : { base: "60px", sm: "90px" }
          }
        />
        <Center
          boxSize={{ base: "26px", sm: "30px" }}
          bg={
            rank === 1
              ? "yellow.400"
              : rank === 2
              ? "gray.300"
              : rank === 3
              ? "orange.300"
              : "gray.300"
          }
          borderRadius="full"
          color="white"
          fontWeight="bold"
          mt={{ base: "-26px", sm: "-30px" }}
          zIndex={1}>
          {rank}
        </Center>
        <Text
          fontSize="sm"
          fontFamily="mono"
          fontWeight="medium"
          mt={-1.5}
          maxW={{ base: "90px", sm: "100px" }}
          className="ellipsis">
          {nickname || <span style={{ opacity: 0 }}>-</span>}
        </Text>
        <Text fontWeight="bold" color="gray.600" mt={-2}>
          {token ? (
            Number(token).toLocaleString()
          ) : (
            <span style={{ opacity: 0 }}>-</span>
          )}
        </Text>
      </GridItem>
    )
  }
  return (
    <Container maxW="container.xl" py={8}>
      {!userInfo ? (
        <VStack spacing={4} align="center">
          <Heading size="lg">{t("请先登录")}</Heading>
          <Text color="gray.500">{t("登录后查看您的积分信息")}</Text>
        </VStack>
      ) : (
        <VStack spacing={8} align="stretch">
          {/* 个人积分概览（突出显示）- 紫色卡片 */}
          <Box
            bgGradient="linear(to-r, purple.600, purple.700)"
            borderRadius="xl"
            p={{ base: 4, md: 8 }}
            color="white">
            <Grid
              templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
              gap={{ base: 4, md: 6 }}
              height="auto">
              {/* 左侧：用户信息和积分 */}
              <GridItem display="flex" flexDirection="column">
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  alignItems={{ base: "center", sm: "flex-start" }}
                  mb={{ base: 3, md: 4 }}>
                  {/* 用户头像和名称 */}
                  <Avatar
                    size={{ base: "lg", md: "xl" }}
                    name={
                      WssUserData.nickname ? WssUserData.nickname : "loading..."
                    }
                    src={WssUserData.avatar_url}
                    bg="white"
                    color="purple.500"
                    borderWidth="3px"
                    borderColor="purple.300"
                    mb={{ base: 2, sm: 0 }}
                    mr={{ base: 0, sm: 4 }}
                  />

                  <VStack
                    align={{ base: "center", sm: "flex-start" }}
                    spacing={0}
                    w="full">
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="bold"
                      color="white"
                      textShadow="0 1px 2px rgba(0,0,0,0.2)"
                      textAlign={{ base: "center", sm: "left" }}>
                      {WssUserData.nickname
                        ? WssUserData.nickname
                        : "loading..."}
                    </Text>

                    {/* 钱包地址显示 - 调整颜色和格式 */}
                    <Flex
                      mt={1}
                      direction="row"
                      flexWrap="wrap"
                      gap={{ base: 3, sm: 2, md: 2 }}
                      justifyContent={{ base: "center", sm: "flex-start" }}
                      alignItems="center"
                      width="100%">
                      <HStack
                        bg="whiteAlpha.300"
                        p={1.5}
                        px={3}
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor="whiteAlpha.400"
                        mr={{ base: 0, md: 2 }}>
                        <Icon as={FaWallet} color="yellow.300" boxSize={4} />
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="white"
                          fontFamily="mono">
                          {formatSolAddress(userInfo.solana_wallet)}
                        </Text>
                      </HStack>

                      <Flex
                        direction={{ base: "row", md: "row" }}
                        flexWrap="wrap"
                        justify={{ base: "center", sm: "flex-start" }}
                        gap={2}>
                        {/* 绑定电报按钮 */}
                        <HStack
                          bg={
                            WssUserData.telegramId
                              ? "whiteAlpha.400"
                              : "blue.600"
                          }
                          p={1.5}
                          px={3}
                          borderRadius="full"
                          borderWidth="1px"
                          borderColor={
                            WssUserData.telegramId
                              ? "whiteAlpha.400"
                              : "blue.500"
                          }
                          cursor={
                            WssUserData.telegramId ? "default" : "pointer"
                          }
                          onClick={() =>
                            !WssUserData.telegramId &&
                            handleConnectSocial("telegram")
                          }
                          opacity={WssUserData.telegramId ? 0.8 : 1}
                          _hover={
                            !WssUserData.telegramId
                              ? {
                                  bg: "blue.500",
                                }
                              : {}
                          }>
                          <Icon as={FaTelegram} color="white" boxSize={4} />
                          <Text fontSize="sm" fontWeight="medium" color="white">
                            {WssUserData.telegramId
                              ? t("socialBound")
                              : t("bind")}
                          </Text>
                          {WssUserData.telegramId && (
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
                            WssUserData.twitterId
                              ? "whiteAlpha.400"
                              : "twitter.600"
                          }
                          p={1.5}
                          px={3}
                          borderRadius="full"
                          borderWidth="1px"
                          borderColor={
                            WssUserData.twitterId
                              ? "whiteAlpha.400"
                              : "twitter.500"
                          }
                          cursor={userInfo.twitterId ? "default" : "pointer"}
                          onClick={() =>
                            !WssUserData.twitterId &&
                            handleConnectSocial("twitter")
                          }
                          opacity={WssUserData.twitterId ? 0.8 : 1}
                          _hover={
                            !WssUserData.twitterId
                              ? {
                                  bg: "twitter.500",
                                }
                              : {}
                          }>
                          <Icon as={FaXTwitter} color="white" boxSize={4} />
                          <Text fontSize="sm" fontWeight="medium" color="white">
                            {userInfo.twitterId ? t("socialBound") : t("bind")}
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
                  minHeight={{ base: "100px", md: "120px" }}
                  direction={{ base: "column", sm: "row" }}>
                  <HStack mb={{ base: 3, sm: 0 }}>
                    <Icon as={FaCoins} boxSize={7} color="yellow.300" mr={3} />
                    <Box>
                      <Text fontSize="sm" opacity={0.8} color="white">
                        {t("totalPoints")}
                      </Text>
                      <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        lineHeight="1.2"
                        color="white"
                        textShadow="0 1px 3px rgba(0,0,0,0.3)">
                        {WssUserData.token}
                      </Text>
                    </Box>
                  </HStack>

                  <VStack spacing={2} w={{ base: "100%", sm: "auto" }}>
                    {/* 积分历史按钮 */}
                    <Button
                      onClick={onOpen}
                      leftIcon={<Icon as={FaHistory} />}
                      size="sm"
                      colorScheme="yellow"
                      variant="solid"
                      fontWeight="bold"
                      px={4}
                      bg="yellow.400"
                      color="black"
                      boxShadow="0px 2px 4px rgba(0,0,0,0.2)"
                      _hover={{ bg: "yellow.500" }}
                      w="full">
                      {t("pointsHistory")}
                    </Button>

                    {/* 积分用途按钮 */}
                    <Button
                      leftIcon={<Icon as={FaGem} />}
                      size="sm"
                      colorScheme="purple"
                      variant="solid"
                      fontWeight="bold"
                      px={4}
                      bg="purple.500"
                      color="white"
                      boxShadow="0px 2px 4px rgba(0,0,0,0.2)"
                      _hover={{ bg: "purple.600" }}
                      w="full">
                      {t("pointsUsage")}
                    </Button>
                  </VStack>
                </Flex>
              </GridItem>

              {/* 积分历史模态框 */}
              <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay backdropFilter="blur(2px)" />
                <ModalContent borderRadius="xl">
                  <ModalHeader
                    bg={accentColor}
                    color="white"
                    borderTopRadius="xl"
                    py={4}>
                    <HStack>
                      <Icon as={FaHistory} mr={2} />
                      <Text>{t("pointsHistory")}</Text>
                    </HStack>
                  </ModalHeader>
                  <ModalCloseButton color="white" />
                  <ModalBody p={4}>
                    <Box overflowX="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>{t("activity")}</Th>
                            <Th isNumeric>{t("pointsEarned")}</Th>
                            <Th>{t("date")}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {pointsHistory.map((entry, index) => (
                            <Tr key={index}>
                              <Td>
                                <HStack>
                                  {entry.title === "SignIn Reward" && (
                                    <Icon as={FaCheck} color="green.500" />
                                  )}
                                  {entry.title === "Create Reward" && (
                                    <Icon as={FaLink} color="purple.500" />
                                  )}
                                  {/* {entry.activity === "inviteAccepted" && (
                                    <Icon as={FaUserPlus} color="blue.500" />
                                  )}
                                  {entry.activity === "inviteSent" && (
                                    <Icon as={FaLink} color="purple.500" />
                                  )}
                                  {entry.activity === "telegramConnected" && (
                                    <Icon as={FaTelegram} color="blue.500" />
                                  )}
                                  {entry.activity === "twitterConnected" && (
                                    <Icon as={FaXTwitter} color="twitter.500" />
                                  )} */}
                                  <Text>
                                    {getActivityDescription(entry.title)}
                                  </Text>
                                </HStack>
                              </Td>
                              <Td isNumeric>
                                <Text
                                  color={
                                    entry.type === 1 ? "green.500" : "red.500"
                                  }
                                  fontWeight="bold">
                                  +{entry.amount}
                                </Text>
                              </Td>
                              <Td>{entry.time}</Td>
                              {/* <Td>{formatDate(entry.time)}</Td> */}
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="purple" onClick={onClose}>
                      {t("close")}
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>

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
                  spacing={4}>
                  <HStack mb={1}>
                    <Icon as={FaGift} boxSize={5} color="yellow.300" />
                    <Text fontWeight="bold" fontSize="lg" color="white">
                      {t("dailyCheckin")}
                    </Text>
                    <Badge
                      ml="auto"
                      bg="yellow.400"
                      color="black"
                      px={2}
                      borderRadius="full"
                      fontWeight="bold">
                      +{Number(signInInfo?.Dailyrewards)}
                    </Badge>
                  </HStack>

                  {/* <Text fontSize="sm" opacity={0.9} mb={3} color="white"></Text> */}
                  {/* 签到状态周一到周日 */}
                  <Flex
                    justifyContent="center"
                    gap={{ base: 1.5, md: 2.5 }}
                    flexWrap="wrap">
                    {[
                      {
                        day: "周一",
                        reward: 1,
                        signedIn: true,
                      },
                      {
                        day: "周二",
                        reward: 10,
                        signedIn: false,
                      },
                      {
                        day: "周三",
                        reward: 15,
                        signedIn: false,
                      },
                      {
                        day: "周四",
                        reward: 20,
                        signedIn: false,
                      },
                      {
                        day: "周五",
                        reward: 25,
                        signedIn: false,
                      },
                      {
                        day: "周六",
                        reward: 30,
                        signedIn: false,
                      },
                      {
                        day: "周日",
                        reward: 40,
                        signedIn: false,
                      },
                    ].map((itme, index) => (
                      <Grid key={index}>
                        <GridItem
                          display="grid"
                          justifyItems="center"
                          gap={1.5}>
                          <HStack
                            w={{ base: 8, md: 9 }}
                            h={{ base: 8, md: 9 }}
                            bg={
                              itme.signedIn
                                ? "rgba(230, 179, 37,0.85)"
                                : "whiteAlpha.400"
                            }
                            borderRadius="full"
                            p={1}>
                            <HStack
                              w="100%"
                              h="100%"
                              bg={
                                itme.signedIn
                                  ? "rgba(230, 179, 37, 0.7)"
                                  : "whiteAlpha.400"
                              }
                              borderRadius="full"
                              justifyContent="center"
                              alignItems="center">
                              <Text
                                fontSize={9}
                                fontWeight="bold"
                                color={itme.signedIn ? "white" : "gray.300"}
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                {itme.signedIn ? (
                                  <Icon
                                    as={FaCheck}
                                    color="white"
                                    boxSize={3}
                                    ml={1}
                                    m={0}
                                  />
                                ) : (
                                  "+" + Number(signInInfo?.Dailyrewards)
                                )}
                              </Text>
                            </HStack>
                          </HStack>
                          <Text
                            fontSize={12}
                            color="white"
                            fontWeight="bold"
                            opacity={itme.signedIn ? 1 : 0.5}>
                            {itme.day}
                          </Text>
                        </GridItem>
                      </Grid>
                    ))}
                  </Flex>
                  {/* 签到按钮 */}
                  <Button
                    colorScheme="yellow"
                    onClick={handleCheckin}
                    leftIcon={<FaCheck />}
                    mt="auto"
                    bg="yellow.400"
                    color="black"
                    fontWeight="bold"
                    size="lg"
                    _hover={{ bg: "yellow.500" }}
                    isDisabled={signInInfo?.todaySignedIn}>
                    {signInInfo?.todaySignedIn ? t("今日已签到") : t("checkin")}
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
            boxShadow="none"
            bg={bgColor}>
            <CardBody p={{ base: 0, sm: 6 }}>
              <VStack spacing={5} align="stretch">
                <Flex
                  justifyContent="space-between"
                  alignItems={{ base: "flex-start", md: "center" }}
                  flexDirection={{ base: "column", md: "row" }}>
                  <HStack spacing={3} mb={{ base: 3, md: 0 }}>
                    <Icon as={FaUserPlus} color={accentColor} boxSize={5} />
                    <Heading size="md">{t("inviteFriendsTitle")}</Heading>
                    <Badge
                      colorScheme="purple"
                      fontSize="sm"
                      px={2}
                      py={1}
                      borderRadius="full">
                      +{REWARDS.inviteFriend}
                    </Badge>
                  </HStack>
                  <HStack
                    spacing={2}
                    flexWrap="wrap"
                    justifyContent={{ base: "flex-start", md: "flex-end" }}
                    w={{ base: "100%", md: "auto" }}>
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
                      _hover={{ bg: "gray.300" }}
                      _dark={{
                        bg: "gray.700",
                        borderColor: "gray.600",
                        _hover: { bg: "gray.600" },
                      }}
                      mb={{ base: 2, md: 0 }}>
                      <Icon
                        as={FaCopy}
                        color="gray.600"
                        boxSize={4}
                        _dark={{ color: "gray.300" }}
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.700"
                        _dark={{ color: "white" }}>
                        {t("copyInviteLink")}
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
                      _hover={{ bg: "blue.700" }}
                      mb={{ base: 2, md: 0 }}>
                      <Icon as={FaTelegram} color="white" boxSize={4} />
                      <Text fontSize="sm" fontWeight="bold" color="white">
                        {t("share")}
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
                      _hover={{ bg: "#0d8bd9" }}
                      mb={{ base: 2, md: 0 }}>
                      <Icon as={FaXTwitter} color="white" boxSize={4} />
                      <Text fontSize="sm" fontWeight="bold" color="white">
                        {t("share")}
                      </Text>
                    </HStack>
                  </HStack>
                </Flex>

                <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}>
                  {t("inviteSuccessReward")}
                </Text>

                <Box>
                  <Text
                    fontWeight="medium"
                    mb={2}
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: "gray.300" }}>
                    {t("yourInviteLink")}
                  </Text>
                  <Input
                    value={`${
                      WssUserData.code
                        ? `${window.location.origin}/points?code=${WssUserData.code}`
                        : "loading..."
                    }`}
                    readOnly
                    bg="white"
                    borderColor={borderColor}
                    borderRadius="md"
                    _dark={{ bg: "gray.800" }}
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
            boxShadow="none"
            p={{ base: 0, sm: 8 }}>
            <Box bg={accentColor} p={4} color="white">
              <HStack>
                <Icon
                  as={FaTrophy}
                  color="white"
                  boxSize={{ base: 5, sm: 6 }}
                />
                <Heading size={{ base: "sm", sm: "md" }} color="white">
                  {t("leaderboard")}
                </Heading>
              </HStack>
            </Box>
            <CardBody p={0}>
              <Box>
                {/* 前三名排行榜 */}
                <Flex
                  w="100%"
                  justifyContent="center"
                  gap={6}
                  my={6}
                  textAlign="center">
                  <Grid
                    templateColumns="repeat(3, 1fr)"
                    gap={{ base: 2, sm: 6 }}
                    alignItems="flex-end"
                    justifyContent={{ base: "space-between", sm: "center" }}
                    m={0}>
                    {/* 第二名 */}
                    <RenderRankList
                      {...rankList.filter((item) => item.rank === 2)[0]}
                      rank={2}
                    />
                    {/* 第一名 */}
                    <RenderRankList
                      {...rankList.filter((item) => item.rank === 1)[0]}
                      rank={1}
                    />
                    {/* 第三名 */}
                    <RenderRankList
                      {...rankList.filter((item) => item.rank === 3)[0]}
                      rank={3}
                    />
                  </Grid>
                </Flex>
                {/* 排行榜 */}
                <Box overflowX="auto">
                  <Grid p={{ base: 4, sm: 0 }} py={6}>
                    {rankList.slice(3, rankList.length).map((entry) => (
                      <GridItem key={entry.userId} py={2}>
                        <Card
                          p={4}
                          transition="transform 0.3s"
                          _hover={{ transform: "translateY(-5px)" }}>
                          <CardBody
                            display="flex"
                            alignItems="center"
                            p={0}
                            gap={{ base: 1, md: 2 }}>
                            <Text w={4} fontSize={{ base: "sm", sm: "md" }}>
                              {entry.rank}
                            </Text>
                            <HStack w={{ base: "auto", md: 160 }}>
                              <Avatar
                                size="sm"
                                name={entry.nickname}
                                src={entry.avatar_url}
                              />
                              <Grid gap={0}>
                                <GridItem>
                                  <Text
                                    fontWeight={
                                      entry.userId === userInfo?.userId
                                        ? "bold"
                                        : "normal"
                                    }>
                                    {entry.nickname}
                                    {entry.userId === userInfo?.userId && (
                                      <Text
                                        as="span"
                                        fontSize="xs"
                                        color={accentColor}>
                                        ({t("you")})
                                      </Text>
                                    )}
                                  </Text>
                                </GridItem>
                                <GridItem
                                  display={{ base: "flex", md: "none" }}>
                                  <HStack>
                                    <Icon
                                      as={FaWallet}
                                      color="gray.500"
                                      boxSize={3}
                                    />
                                    <Text
                                      fontSize="sm"
                                      fontFamily="mono"
                                      fontWeight="medium">
                                      {entry.solana_wallet
                                        ? formatSolAddress(
                                            entry.solana_wallet,
                                            3
                                          )
                                        : "-"}
                                    </Text>
                                  </HStack>
                                </GridItem>
                              </Grid>
                            </HStack>
                            <HStack display={{ base: "none", md: "flex" }}>
                              <Icon
                                as={FaWallet}
                                color="gray.500"
                                boxSize={3}
                              />
                              <Text
                                fontSize="sm"
                                fontFamily="mono"
                                fontWeight="medium">
                                {entry.solana_wallet
                                  ? formatSolAddress(entry.solana_wallet, 4)
                                  : "-"}
                              </Text>
                            </HStack>
                            <HStack flex={1} />
                            <Text
                              color={
                                entry.userId === userInfo?.userId
                                  ? accentColor
                                  : "gray.600"
                              }
                              fontWeight="bold"
                              _dark={{
                                color:
                                  entry.userId === userInfo?.userId
                                    ? "purple.300"
                                    : "gray.300",
                              }}>
                              {Number(entry.token).toLocaleString()}
                            </Text>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </VStack>
      )}
    </Container>
  )
}
