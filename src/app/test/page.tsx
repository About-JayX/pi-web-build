"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  Stack,
  Divider,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  Center,
  Spinner,
  Button,
  Flex,
  SimpleGrid,
  Avatar,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Image,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectTokenByAddress,
  fetchTokenList,
} from "@/store/slices/tokenSlice";
import { useTranslation } from "react-i18next";
import {
  FaCoins,
  FaUsers,
  FaChartPie,
  FaSync,
  FaArrowLeft,
  FaGlobe,
  FaTelegram,
  FaFileContract,
  FaArrowRight,
  FaAngleRight,
} from "react-icons/fa";
import MintingForm from "@/components/token-detail/MintingForm";
import { useSolana } from "@/contexts/solanaProvider";
import { useFairCurve } from "@/web3/fairMint/hooks/useFairCurve";
import { formatFairCurveState } from "@/web3/fairMint/utils/format";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { LoadingSpinner } from "@/components";
import { MintingInstructions } from "@/components/token-detail";
import { FaXTwitter } from "react-icons/fa6";
import ProgressBox from "@/components/Progress";

export default function TokenMintPage() {
  const { t } = useTranslation();

  const toast = useToast();

  // 缩略显示合约地址
  const formatContractAddress = (address: string) => {
    if (!address) return "";
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };

  // 复制合约地址
  function copyContractAddress(address: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          toast({
            title: t("copySuccess"),
            status: "success",
            duration: 2000,
          });
        })
        .catch((error) => {
          console.error("复制失败:", error);
          toast({
            title: t("copyFailed"),
            description: t("pleaseTryAgain"),
            status: "error",
            duration: 2000,
          });
        });
    } else {
      // 回退方案：使用旧的 document.execCommand('copy') 方法
      const textarea = document.createElement("textarea");
      textarea.value = address;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        toast({
          title: t("copySuccess"),
          status: "success",
          duration: 2000,
        });
      } catch (error) {
        console.error("复制失败:", error);
        toast({
          title: t("copyFailed"),
          description: t("pleaseTryAgain"),
          status: "error",
          duration: 2000,
        });
      }
      document.body.removeChild(textarea);
    }
  }

  const [isMobile, setIsMobile] = useState(false);

  // 监听窗口大小变化
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 992); // lg breakpoint
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const TopHolders = () => {
    const [isOpen, setIsOpen] = useState(true);
    useEffect(() => {
      if (isMobile) {
        setIsOpen(false);
      }
    }, [isMobile]);
    return (
      <GridItem>
        <Card borderWidth={2} borderColor="#EFEDFD" shadow="none">
          <Accordion
            defaultIndex={[0]}
            index={isOpen ? 0 : -1}
            allowToggle
            allowMultiple
            onChange={() => setIsOpen(!isOpen)}
          >
            <AccordionItem borderWidth={0} border="none">
              <h2>
                <AccordionButton
                  px={0}
                  bg="transparent"
                  _hover={{ bg: "transparent" }}
                  py={{ base: 0, md: 1 }}
                >
                  <Box
                    as={Text}
                    flex="1"
                    textAlign="left"
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="bold"
                    color="#131316"
                  >
                    Top Holders
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel px={0} mt={2}>
                <Table>
                  <Thead bg="#F9F9FA" p={0}>
                    <Tr>
                      <Th
                        textAlign="left"
                        roundedLeft="md"
                        border="none"
                        px={3}
                        color="gray.500"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        # Address
                      </Th>
                      <Th
                        textAlign="right"
                        roundedRight="md"
                        border="none"
                        px={3}
                        color="gray.500"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        Holding Ratio
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td
                        textAlign="left"
                        p={3}
                        borderColor="#F9F9FA"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="medium"
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        color="#131316"
                      >
                        <Text color="gray.500">1.</Text>
                        {formatContractAddress(
                          "0x0000000000000000000000000000000000000000"
                        )}
                      </Td>
                      <Td
                        p={{ base: 2, md: 3 }}
                        textAlign="right"
                        px={3}
                        borderColor="#F9F9FA"
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="medium"
                        color="brand.primary"
                      >
                        100%
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Card>
      </GridItem>
    );
  };

  return (
    <Box>
      <Container maxW="container.xl" py={12}>
        <Grid gap={4}>
          {/* 返回按钮 */}
          <Flex
            justify="flex-start"
            align="center"
            gap={1}
            as={Link}
            href="/"
            w="fit-content"
          >
            <FaArrowLeft />
            <Divider orientation="vertical" height="20px" mx={2} />
            <Text>{t("backToMintingHome")}</Text>
          </Flex>
          <Flex
            justify="space-between"
            gap={4}
            flexDirection={{ base: "column-reverse", lg: "row" }}
          >
            {/* 左侧卡片 */}
            <GridItem w="100%" flex={1}>
              <Card borderWidth={2} borderColor="#EFEDFD" shadow="none">
                <CardBody py={2} as={Grid} gap={{ base: 1, md: 4 }} p={0}>
                  {/* 头像及链接 */}
                  <Flex
                    justify={{ base: "", md: "space-between" }}
                    align="center"
                    flexDirection={{ base: "column", md: "row" }}
                    gap={{ base: 4, md: 0 }}
                  >
                    <Flex gap={4} w="100%">
                      {/* 头像 */}
                      <Avatar
                        src="https://bit.ly/tioluwani-kola"
                        name="T"
                        boxSize={{ base: "50px", md: "72px" }}
                      />
                      {/* 代币名称及符号 */}
                      <Grid h="fit-content">
                        {/* 代币名称 */}
                        <Flex display="flex" flexDirection="row" gap={1}>
                          <Text
                            fontSize={{ base: "2xl", md: "3xl" }}
                            fontWeight="bold"
                          >
                            Delta Pi
                          </Text>
                          <Text
                            fontSize={{ base: "xs", md: "sm" }}
                            color="gray.500"
                            mt={1.5}
                            ml={1.5}
                          >
                            DPI
                          </Text>
                        </Flex>
                        {/* 代币符号 */}
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          color="gray.500"
                        >
                          Deployed: 2024-02-06 23:54
                        </Text>
                      </Grid>
                    </Flex>
                    <Flex
                      gap={4}
                      w={{ base: "100%", md: "auto" }}
                      justifyContent={{ base: "flex-start", md: "" }}
                    >
                      {/* 网站链接 */}
                      <Box
                        as="a"
                        // href={token.WebSite}
                        target="_blank"
                        rel="noopener noreferrer"
                        color={"#C8C8D0"}
                        transition="color 0.2s"
                      >
                        <Icon as={FaGlobe} boxSize="16px" />
                      </Box>
                      {/* 推特链接 */}
                      <Box
                        as="a"
                        // href={token.Twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        color={"#C8C8D0"}
                        transition="color 0.2s"
                      >
                        <Icon as={FaXTwitter} boxSize="16px" />
                      </Box>
                      {/* 电报链接 */}
                      <Box
                        as="a"
                        // href={token.Telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        color={"#C8C8D0"}
                        transition="color 0.2s"
                      >
                        <Icon as={FaTelegram} boxSize="16px" />
                      </Box>
                    </Flex>
                  </Flex>
                  <Divider my={{ base: 2, md: 4 }} />
                  {/* 进度 */}
                  <Grid gap={{ base: 2, md: 4 }} maxW="480px">
                    <Text fontSize="xs" color="gray.500">
                      Progress
                    </Text>
                    <ProgressBox value={50}  borderRadius="sm" size={{ base: "sm", md: "md" }}/>
                    <Flex justify="space-between" align="center">
                      <Grid gap={0.5}>
                        <Text fontSize="xs" fontWeight="bold">
                          Raised Amount
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          10,000 SOL
                        </Text>
                      </Grid>

                      <Text fontSize="lg" fontWeight="bold">
                        72%
                      </Text>
                    </Flex>
                    
                  </Grid>
                  {/*  */}
                  <Flex
                    gap={{ base: 2, md: 3, xl: 10 }}
                    my={{ base: 2, md: 6 }}
                    flexDirection={{ base: "column", xl: "row" }}
                  >
                    <Card
                      flex={1}
                      shadow="0px 0px 20px 0px rgba(82, 53, 232, 0.10)"
                      p={{ base: 3, md: 4 }}
                    >
                      <Flex
                        w="100%"
                        align="center"
                        gap={{ base: 2, md: 3 }}
                        justifyContent={{
                          base: "space-between",
                          md: "flex-start",
                        }}
                      >
                        <Image
                          src="/mint/holders.png"
                          alt="sol-1"
                          boxSize={{ base: "26px", md: "32px", xl: "43px" }}
                        />
                        <Flex
                          gap={0}
                          textAlign="left"
                          h="fit-content"
                          alignItems={{ base: "center", xl: "flex-start" }}
                          justifyContent={{
                            base: "space-between",
                            xl: "flex-start",
                          }}
                          flexDirection={{ base: "row-reverse", xl: "column" }}
                          w={{ base: "100%", xl: "auto" }}
                        >
                          <Text
                            fontSize={{ base: "sm", md: "xl", xl: "2xl" }}
                            fontWeight="bold"
                          >
                            234
                          </Text>
                          <Text
                            color="gray.500"
                            fontSize="xs"
                            mt={{ base: 0, xl: -1.5 }}
                          >
                            Holders
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                    <Card
                      flex={1}
                      shadow="0px 0px 20px 0px rgba(82, 53, 232, 0.10)"
                      p={{ base: 3, md: 4 }}
                    >
                      <Flex
                        w="100%"
                        align="center"
                        gap={{ base: 2, md: 3 }}
                        justifyContent={{
                          base: "space-between",
                          md: "flex-start",
                        }}
                      >
                        <Image
                          src="/mint/raisedAmount.png"
                          alt="sol-1"
                          boxSize={{ base: "26px", md: "32px", xl: "43px" }}
                        />
                        <Flex
                          gap={0}
                          textAlign="left"
                          h="fit-content"
                          alignItems={{ base: "center", xl: "flex-start" }}
                          justifyContent={{
                            base: "space-between",
                            xl: "flex-start",
                          }}
                          flexDirection={{ base: "row-reverse", xl: "column" }}
                          w={{ base: "100%", xl: "auto" }}
                        >
                          <Text
                            fontSize={{ base: "sm", md: "xl", xl: "2xl" }}
                            fontWeight="bold"
                          >
                            200 Pi
                          </Text>
                          <Text
                            color="gray.500"
                            fontSize="xs"
                            mt={{ base: 0, xl: -1.5 }}
                          >
                            Target Amount
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                    <Card
                      flex={1}
                      shadow="0px 0px 20px 0px rgba(82, 53, 232, 0.10)"
                      p={{ base: 3, md: 4 }}
                    >
                      <Flex
                        w="100%"
                        align="center"
                        gap={{ base: 2, md: 3 }}
                        justifyContent={{
                          base: "space-between",
                          md: "flex-start",
                        }}
                      >
                        <Image
                          src="/mint/targetAmount.png"
                          alt="sol-1"
                          boxSize={{ base: "26px", md: "32px", xl: "43px" }}
                        />
                        <Flex
                          gap={0}
                          textAlign="left"
                          h="fit-content"
                          alignItems={{ base: "center", xl: "flex-start" }}
                          justifyContent={{
                            base: "space-between",
                            xl: "flex-start",
                          }}
                          flexDirection={{ base: "row-reverse", xl: "column" }}
                          w={{ base: "100%", xl: "auto" }}
                        >
                          <Text
                            fontSize={{ base: "sm", md: "xl", xl: "2xl" }}
                            fontWeight="bold"
                          >
                            178 Pi
                          </Text>
                          <Text
                            color="gray.500"
                            fontSize="xs"
                            mt={{ base: 0, xl: -1.5 }}
                          >
                            Raised Amount
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                  </Flex>
                  {/* 代币详情 */}
                  <Grid gap={{ base: 4, md: 6 }} mt={{ base: 2, md: 4 }}>
                    <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                      Token Details
                    </Text>
                    <Grid
                      gap={{ base: 3, md: 4 }}
                      templateColumns={{
                        base: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        xl: "repeat(3, 1fr)",
                      }}
                    >
                      <GridItem
                        display="flex"
                        flexDirection={{ base: "row", sm: "column" }}
                        gap={1}
                        alignItems={{ base: "center", sm: "flex-start" }}
                        justifyContent="space-between"
                      >
                        <Text
                          fontSize={{ base: "sm", md: "xs" }}
                          color="gray.500"
                        >
                          Supply
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          1000.0M
                        </Text>
                      </GridItem>
                      <GridItem
                        display="flex"
                        flexDirection={{ base: "row", sm: "column" }}
                        gap={1}
                        alignItems={{ base: "center", sm: "flex-start" }}
                        justifyContent="space-between"
                      >
                        <Text
                          fontSize={{ base: "sm", md: "xs" }}
                          color="gray.500"
                        >
                          Price
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          0.0000002 Pi
                        </Text>
                      </GridItem>
                      <GridItem
                        display="flex"
                        flexDirection={{ base: "row", sm: "column" }}
                        alignItems={{ base: "center", sm: "flex-start" }}
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Text
                          fontSize={{ base: "sm", md: "xs" }}
                          color="gray.500"
                        >
                          Rate
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          1 Pi = 5,000,000 Delta Pi
                        </Text>
                      </GridItem>
                      <GridItem
                        display="flex"
                        flexDirection={{ base: "row", sm: "column" }}
                        alignItems={{ base: "center", sm: "flex-start" }}
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Text
                          fontSize={{ base: "sm", md: "xs" }}
                          color="gray.500"
                        >
                          Minted
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          890,000,000 DiamondPi
                        </Text>
                      </GridItem>
                      <GridItem
                        display="flex"
                        flexDirection={{ base: "row", sm: "column" }}
                        alignItems={{ base: "center", sm: "flex-start" }}
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Text
                          fontSize={{ base: "sm", md: "xs" }}
                          color="gray.500"
                        >
                          Progress
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          72%
                        </Text>
                      </GridItem>
                      <GridItem
                        display="flex"
                        flexDirection={{ base: "row", sm: "column" }}
                        alignItems={{ base: "center", sm: "flex-start" }}
                        justifyContent="space-between"
                        gap={1}
                      >
                        <Text
                          fontSize={{ base: "sm", md: "xs" }}
                          color="gray.500"
                        >
                          Ca
                        </Text>
                        <Box
                          as="button"
                          onClick={() => copyContractAddress("0x00...000")}
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-end"
                          fontSize="xs"
                          fontWeight="medium"
                          fontFamily="mono"
                          color="brand.primary"
                          bg="gray.50"
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          px={2}
                          py={0.5}
                          mr={{ base: 0, sm: "auto" }}
                          _hover={{
                            bg: "gray.100",
                            borderColor: "brand.primary",
                          }}
                          transition="all 0.2s"
                          title={t("clickToCopyFullAddress")}
                        >
                          <Icon as={FaFileContract} mr={1} fontSize="10px" />
                          {formatContractAddress("0x000000000")}
                        </Box>
                      </GridItem>
                    </Grid>
                  </Grid>
                  <Divider my={4} />
                  {/* 代币描述 */}
                  <Grid gap={{ base: 2, md: 3 }}>
                    <Text
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="bold"
                      mb={{ base: 2, md: 3 }}
                    >
                      Minting Instructions
                    </Text>
                    {[
                      "• Minimum participation amount: 0.01 Pi",
                      "• Canceling minting will incur a 2% fee, refunding 98% of Pi",
                      "• After successful minting, tokens will be automatically sent to your wallet address",
                      "• After minting completes, tokens can be transferred and freely traded on DEX",
                    ].map((item, index) => (
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="medium"
                        color="gray.500"
                        key={index}
                      >
                        {item}
                      </Text>
                    ))}
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>
            {/* 右侧卡片 */}
            <GridItem
              as={Grid}
              gap={{ base: 4, xl: 6 }}
              templateRows={{ base: "1fr", md: "auto 1fr" }}
            >
              {/* 购买及退还 */}
              <GridItem>
                <Card
                  borderWidth={2}
                  borderColor="#EFEDFD"
                  shadow="none"
                  w={{ base: "100%", lg: "400px" }}
                >
                  <CardBody p={0} py={{ base: 0, md: 2 }} pt={2}>
                    <Tabs variant="soft-rounded">
                      <TabList
                        bg="#EEE"
                        p={1}
                        rounded="lg"
                        w={{ base: "100%", md: "fit-content" }}
                      >
                        <Tab
                          rounded="lg"
                          _selected={{ color: "white", bg: "white" }}
                          fontSize={{ base: "12px", md: "14px" }}
                          w={{ base: "100%", md: "fit-content" }}
                        >
                          <Text>Minting</Text>
                        </Tab>
                        <Tab
                          rounded="lg"
                          _selected={{ color: "white", bg: "white" }}
                          fontSize={{ base: "12px", md: "14px" }}
                          w={{ base: "100%", md: "fit-content" }}
                        >
                          <Text>Refund</Text>
                        </Tab>
                      </TabList>
                      {/* 铸造、退还 */}
                      <TabPanels mt={{ base: 0, md: 1 }}>
                        {/* 铸造 */}
                        <TabPanel px={0} as={Grid} gap={{ base: 3, md: 4 }}>
                          {/* 输入框 */}
                          <Flex>
                            <Input
                              placeholder="0.00"
                              fontSize={{ base: "3xl", md: "4xl" }}
                              fontWeight="bold"
                              variant="unstyled"
                            />
                            <Image
                              src="/mint/sol.png"
                              alt="sol"
                              boxSize={{ base: "36px", md: "48px" }}
                              objectFit="cover"
                              style={{ borderRadius: "100%" }}
                            />
                          </Flex>
                          {/* 余额 */}
                          <Text
                            fontSize={{ base: "12px", md: "14px" }}
                            color="gray.500"
                          >
                            Your Balance: $25,000
                          </Text>
                          {/* 选择数量 */}
                          <Flex gap={{ base: 1.5, md: 2 }} flexWrap="wrap">
                            {[0.1, 0.2, 0.5, 1].map((item, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size={{ base: "sm", md: "lg" }}
                                px={1}
                                bg={item === 0.1 ? "#F7F6FE" : "#F9F9FA"}
                                borderColor={
                                  item === 0.1 ? "#E7E3FC" : "#E3E3E8"
                                }
                                color={
                                  item === 0.1 ? "brand.primary" : "#9C9CAB"
                                }
                                fontSize={{ base: "12px", md: "14px" }}
                                flex={1}
                              >
                                {item} SOL
                              </Button>
                            ))}
                          </Flex>
                          {/* 领取代币 */}
                          <Flex
                            justify="space-between"
                            align="center"
                            fontSize={{ base: "12px", md: "14px" }}
                            fontWeight="medium"
                          >
                            <Flex gap={2} alignItems="center">
                              <Text color="gray.500">Claim Tokens</Text>
                              <Divider
                                orientation="vertical"
                                height="20px"
                                display={{ base: "none", md: "block" }}
                              />
                              <Text
                                display={{ base: "none", md: "flex" }}
                                gap={1}
                                alignItems="center"
                              >
                                <Avatar
                                  src="https://bit.ly/tioluwani-kola"
                                  name="T"
                                  boxSize="16px"
                                  fontSize="10px"
                                />
                                Claim SOL
                              </Text>
                            </Flex>
                            <Text display="flex" gap={1} alignItems="center">
                              <Text color="brand.primary">100,000,000</Text>
                              <Icon as={FaAngleRight} />
                            </Text>
                          </Flex>
                          {/* Minting按钮 */}
                          <Button
                            bg="brand.primary"
                            color="white"
                            w="100%"
                            mt={{ base: 0, md: 2 }}
                            _hover={{
                              bg: "brand.light",
                            }}
                          >
                            Minting
                          </Button>
                        </TabPanel>
                        {/* 退还 */}
                        <TabPanel
                          px={0}
                          as={Grid}
                          gap={{ base: 3, md: 4 }}
                        ></TabPanel>
                      </TabPanels>
                    </Tabs>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Top Holders */}
              <TopHolders />
            </GridItem>
          </Flex>
        </Grid>
      </Container>
    </Box>
  );
}
