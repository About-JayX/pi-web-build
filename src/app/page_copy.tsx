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
  Progress,
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
  FaTwitter,
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
import Image from "next/image";

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
          console.error("Copy failed:", error);
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
        console.error("Copy failed:", error);
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
  return (
    <Box>
      <Container maxW="container.xl" py={12}>
        <Grid gap={4}>
          {/* 返回按钮 */}
          <Flex justify="flex-start" align="center" gap={1}>
            <FaArrowLeft />
            <Divider orientation="vertical" height="20px" mx={2} />
            <Text>{t("backToMintingHome")}</Text>
          </Flex>
          <Flex justify="space-between" gap={4}>
            {/* 左侧卡片 */}
            <GridItem w="100%" flex={1}>
              <Card borderWidth={2} borderColor="#EFEDFD" shadow="none">
                <CardBody py={4} as={Grid} gap={4}>
                  {/* 头像及链接 */}
                  <Flex justify="space-between" align="center">
                    <Flex gap={4}>
                      {/* 头像 */}
                      <Avatar
                        src="https://bit.ly/tioluwani-kola"
                        name="T"
                        boxSize="72px"
                      />
                      {/* 代币名称及符号 */}
                      <Grid h="fit-content">
                        {/* 代币名称 */}
                        <Flex display="flex" flexDirection="row" gap={1}>
                          <Text fontSize="3xl" fontWeight="bold">
                            Delta Pi
                          </Text>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            mt={1.5}
                            ml={1.5}
                          >
                            DPI
                          </Text>
                        </Flex>
                        {/* 代币符号 */}
                        <Text fontSize="xs" color="gray.500" mt={-1}>
                          Deployed: 2024-02-06 23:54
                        </Text>
                      </Grid>
                    </Flex>
                    <Flex gap={4}>
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
                        <Icon as={FaTwitter} boxSize="16px" />
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
                  <Divider my={4} />
                  {/* 进度 */}
                  <Grid gap={4} maxW="360px">
                    <Text fontSize="xs" color="gray.500">
                      Progress
                    </Text>
                    <Progress
                      value={50}
                      size="md"
                      borderRadius="sm"
                      bg="#E7E3FC"
                      sx={{
                        // 进度条颜色
                        "& > div:last-of-type": {
                          bg: "brand.primary !important",
                          transition: "width 0.5s ease-in-out",
                        },
                      }}
                    />
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
                  <Flex gap={10} my={6}>
                    <Card
                      flex={1}
                      shadow="0px 0px 20px 0px rgba(82, 53, 232, 0.10)"
                    >
                      <Flex w="100%" align="center" gap={3}>
                        <Image
                          src="/mint/holders.png"
                          alt="sol-1"
                          width={43}
                          height={43}
                        />
                        <Grid gap={0} textAlign="left" h="fit-content">
                          <Text fontSize="2xl" fontWeight="bold">
                            234
                          </Text>
                          <Text color="gray.500" fontSize="xs" mt={-1.5}>
                            Holders
                          </Text>
                        </Grid>
                      </Flex>
                    </Card>
                    <Card
                      flex={1}
                      shadow="0px 0px 20px 0px rgba(82, 53, 232, 0.10)"
                    >
                      <Flex w="100%" align="center" gap={3}>
                        <Image
                          src="/mint/raisedAmount.png"
                          alt="sol-1"
                          width={43}
                          height={43}
                        />
                        <Grid gap={0} textAlign="left" h="fit-content">
                          <Text fontSize="2xl" fontWeight="bold">
                            200 Pi
                          </Text>
                          <Text color="gray.500" fontSize="xs" mt={-1.5}>
                            Target Amount
                          </Text>
                        </Grid>
                      </Flex>
                    </Card>
                    <Card
                      flex={1}
                      shadow="0px 0px 20px 0px rgba(82, 53, 232, 0.10)"
                    >
                      <Flex w="100%" align="center" gap={3}>
                        <Image
                          src="/mint/targetAmount.png"
                          alt="sol-1"
                          width={43}
                          height={43}
                        />
                        <Grid gap={0} textAlign="left" h="fit-content">
                          <Text fontSize="2xl" fontWeight="bold">
                            178 Pi
                          </Text>
                          <Text color="gray.500" fontSize="xs" mt={-1.5}>
                            Raised Amount
                          </Text>
                        </Grid>
                      </Flex>
                    </Card>
                  </Flex>
                  {/* 代币详情 */}
                  <Grid gap={6}>
                    <Text fontSize="xl" fontWeight="bold">
                      Token Details
                    </Text>
                    <Grid gap={4} templateColumns="repeat(3, 1fr)">
                      <GridItem display="flex" flexDirection="column" gap={1}>
                        <Text fontSize="xs" color="gray.500">
                          Supply
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          1000.0M
                        </Text>
                      </GridItem>
                      <GridItem display="flex" flexDirection="column" gap={1}>
                        <Text fontSize="xs" color="gray.500">
                          Price
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          0.0000002 Pi
                        </Text>
                      </GridItem>
                      <GridItem display="flex" flexDirection="column" gap={1}>
                        <Text fontSize="xs" color="gray.500">
                          Rate
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          1 Pi = 5,000,000 Delta Pi
                        </Text>
                      </GridItem>
                      <GridItem display="flex" flexDirection="column" gap={1}>
                        <Text fontSize="xs" color="gray.500">
                          Minted
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          890,000,000 DiamondPi
                        </Text>
                      </GridItem>
                      <GridItem display="flex" flexDirection="column" gap={1}>
                        <Text fontSize="xs" color="gray.500">
                          Progress
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          72%
                        </Text>
                      </GridItem>
                      <GridItem display="flex" flexDirection="column" gap={1}>
                        <Text fontSize="xs" color="gray.500">
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
                          mr="auto"
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
                  <Grid gap={4}>
                    <Text fontSize="xl" fontWeight="bold">
                      Minting Instructions
                    </Text>
                    {[
                      "• Minimum participation amount: 0.01 Pi",
                      "• Canceling minting will incur a 2% fee, refunding 98% of Pi",
                      "• After successful minting, tokens will be automatically sent to your wallet address",
                      "• After minting completes, tokens can be transferred and freely traded on DEX",
                    ].map((item, index) => (
                      <Text
                        fontSize="sm"
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
            <GridItem as={Grid} gap={6} templateRows="auto 1fr">
              {/* 购买及退款 */}
              <Card
                borderWidth={2}
                borderColor="#EFEDFD"
                shadow="none"
                w="400px"
              >
                <CardBody p={0} py={2}>
                  <Tabs variant="soft-rounded">
                    <TabList bg="#EEE" p={1} rounded="lg" w="fit-content">
                      <Tab
                        rounded="lg"
                        _selected={{ color: "white", bg: "white" }}
                      >
                        <Text>Minting</Text>
                      </Tab>
                      <Tab
                        rounded="lg"
                        _selected={{ color: "white", bg: "white" }}
                      >
                        <Text>Refund</Text>
                      </Tab>
                    </TabList>
                    <TabPanels mt={1}>
                      <TabPanel px={0} as={Grid} gap={4}>
                        {/* 输入框 */}
                        <Flex>
                          <Input
                            placeholder="0.00"
                            fontSize="4xl"
                            fontWeight="bold"
                            variant="unstyled"
                          />
                          <Image
                            src="/mint/sol.png"
                            alt="sol"
                            width={48}
                            height={48}
                            objectFit="cover"
                            style={{ borderRadius: "100%" }}
                          />
                        </Flex>
                        {/* 余额 */}
                        <Text fontSize="sm" color="gray.500">
                          Your Balance: $25,000
                        </Text>
                        {/* 选择数量 */}
                        <Flex gap={2}>
                          {[0.1, 0.2, 0.5, 1].map((item, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="lg"
                              px={1}
                              bg="#F9F9FA"
                              borderColor="#E3E3E8"
                              color="#9C9CAB"
                              fontSize="sm"
                              flex={1}
                            >
                              {item} SOL
                            </Button>
                          ))}
                        </Flex>
                        {/*  */}
                        <Flex
                          justify="space-between"
                          align="center"
                          fontSize="sm"
                        >
                          <Flex gap={2} alignItems="center">
                            <Text color="gray.500">Claim Tokens</Text>
                            <Divider orientation="vertical" height="20px" />
                            <Text display="flex" gap={1} alignItems="center">
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
                          mt={2}
                          _hover={{
                            bg: "brand.light",
                          }}
                        >
                          Minting
                        </Button>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>
              {/* Top Holders */}
              <Card borderWidth={2} borderColor="#EFEDFD" shadow="none">
                <Accordion defaultIndex={[0]} allowMultiple>
                  <AccordionItem borderWidth={0} border="none">
                    <h2>
                      <AccordionButton
                        px={0}
                        bg="transparent"
                        _hover={{ bg: "transparent" }}
                      >
                        <Box
                          as={Text}
                          flex="1"
                          textAlign="left"
                          fontSize="lg"
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
                            >
                              # Address
                            </Th>
                            <Th
                              textAlign="right"
                              roundedRight="md"
                              border="none"
                              px={3}
                            >
                              Holding Ratio
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody >
                          <Tr>
                            <Td
                              textAlign="left"
                              p={3}
                              borderColor="#F9F9FA"
                              fontSize="sm"
                              fontWeight="medium"
                              display="flex"
                              alignItems="center"
                              gap={1.5}
                              color="#131316"
                            >
                              <Text color="gray.500">1.</Text>{formatContractAddress("0x0000000000000000000000000000000000000000")}
                            </Td>
                            <Td
                            p={3}
                              textAlign="right"
                              px={3}
                              borderColor="#F9F9FA"
                              fontSize="sm"
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
          </Flex>
        </Grid>
      </Container>
    </Box>
  );
}
