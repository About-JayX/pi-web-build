"use client";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  Image,
  Text,
  useToast,
  useColorModeValue,
  useMediaQuery,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { FaFileContract, FaGlobe, FaTelegram, FaTwitter } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useParams,useSearchParams } from "next/navigation";
import { MarketAPI } from "@/api";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { useNetwork } from "@/contexts/NetworkContext";
import { formatNumberWithUnit, getRelativeTime } from "@/utils";
// import { MarketAPI } from "@/mock/market";


export interface MarketDetailType {
  Address: string;
  Deployed: number;
  LaunchTime: number;
  Logo: string;
  MarketCap: string;
  MintAmount: string;
  Name: string;
  NowAmount: string;
  PairAddress: string;
  Price: string;
  PriceChange_24: string;
  Rate: string;
  Telegram: string;
  Ticker: string;
  TotalSupply: string;
  Twitter: string;
  UpTime: number;
  Volume_24: string;
  WebSite: string;
  id: number;
}

// 缩略显示合约地址
const formatContractAddress = (address: string) => {
  if (!address) return "";
  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};

const getDexScreenerUrl = (
  address: string,
  type: "chart" | "info" = "chart"
) => {
  return `https://dexscreener.com/solana/${address}${
    type === "chart" ? "?embed=1&loadChartSettings=0&info=0" : ""
  }`;
};

// 左边 第三方库K线图
const Left = ({ data }: { data: MarketDetailType }) => {
  return (
    <iframe
      width="100%"
      height={900}
      src={getDexScreenerUrl(data.Address || "")}
    />
  );
};

// 右边 代币信息、代币数据、持有人地址
const Right = ({
  data = {
    Address: "",
    Deployed: 0,
    LaunchTime: 0,
    Logo: "",
    MarketCap: "",
    MintAmount: "",
    Name: "",
    NowAmount: "",
    PairAddress: "",
    Price: "",
    PriceChange_24: "",
    Rate: "",
    Telegram: "",
    Ticker: "",
    TotalSupply: "",
    Twitter: "",
    UpTime: 0,
    Volume_24: "",
    WebSite: "",
    id: 0,
  },
}: {
  data: MarketDetailType;
}) => {
  // 代币信息
  const MarketTokenInfo = () => {
    const iconColor = useColorModeValue("gray.600", "gray.400");
    const iconHoverColor = useColorModeValue("brand.primary", "brand.light");
    return (
      <Card
        h={{ base: "auto", lg: "fit-content" }}
        display="flex"
        flexDirection="column"
        gap={3}
        justifyContent="center"
        alignItems="center"
        minW={{ base: "100%", md: "360px" }}
      >
        {/* 代币图片 */}
        <Image
          src={data.Logo}
          alt="token-image"
          boxSize="132px"
          borderRadius="full"
          objectFit="cover"
          border="2px solid"
          borderColor="brand.light"
          p={3}
        />
        {/* 代币名称 */}
        <Text fontSize="2xl" fontWeight="bold">
          {data.Name}
        </Text>
        {/* 社交媒体链接 */}
        <HStack gap={4}>
          {/* 推特 */}
          {data.Twitter && (
            <Box
              as="a"
              href={data.Twitter}
              target="_blank"
              rel="noopener noreferrer"
              color={iconColor}
              _hover={{ color: iconHoverColor }}
              transition="color 0.2s"
            >
              <Icon as={FaTwitter} boxSize="22px" />
            </Box>
          )}
          {/* 电报 */}
          {data.Telegram && (
            <Box
              as="a"
              href={data.Telegram}
              target="_blank"
              rel="noopener noreferrer"
              color={iconColor}
              _hover={{ color: iconHoverColor }}
              transition="color 0.2s"
            >
              <Icon as={FaTelegram} boxSize="22px" />
            </Box>
          )}
          {/* 网站 */}
          {data.Telegram && (
            <Box
              as="a"
              href={data.WebSite}
              target="_blank"
              rel="noopener noreferrer"
              color={iconColor}
              _hover={{ color: iconHoverColor }}
              transition="color 0.2s"
            >
              <Icon as={FaGlobe} boxSize="22px" />
            </Box>
          )}
        </HStack>
        <a
          style={{ width: "100%" }}
          href={getDexScreenerUrl(data.Address, "info")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" w="100%">
            Buy
          </Button>
        </a>
      </Card>
    );
  };

  // 代币数据
  const MarketTokenData = () => {
    const { t } = useTranslation();
    const toast = useToast();

    // 复制合约地址
    const copyContractAddress = (address: string) => {
      if (address) {
        navigator.clipboard
          .writeText(address)
          .then(() =>
            toast({
              title: t("copySuccess"),
              description: t("copyAddressSuccess"),
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            })
          )
          .catch((err) => console.error(t("failed"), err));
      }
    };
    return (
      <Grid gap={2} textAlign="center">
        <Flex gap={2}>
          <Card flex={1} p={3} gap={1}>
            <Text fontSize="xs" fontWeight="500" opacity={0.5}>
              {t("price")}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              {data.Price} {data.Ticker}
            </Text>
          </Card>
          <Card flex={1} p={3} gap={1}>
            <Text fontSize="xs" fontWeight="500" opacity={0.5}>
              {t("change24h")}
            </Text>
            <Text
              fontSize="md"
              fontWeight="bold"
              color={
                Number(data.PriceChange_24 || 0) > 0 ? "green.500" : "red.500"
              }
            >
              {data.PriceChange_24}%
            </Text>
          </Card>
        </Flex>
        <Flex gap={2}>
          <Card flex={1} p={3} gap={1}>
            <Text fontSize="xs" fontWeight="500" opacity={0.5}>
              {t("marketCap")}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              {/* $528K */}
              {formatNumberWithUnit(Number(data.MarketCap || 0))}
            </Text>
          </Card>
          <Card flex={1} p={3} gap={1}>
            <Text fontSize="xs" fontWeight="500" opacity={0.5}>
              {t("volume")}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              {/* $530K */}
              {formatNumberWithUnit(Number(data.Volume_24 || 0))}
            </Text>
          </Card>
          <Card flex={1} p={3} gap={1}>
            <Text fontSize="xs" fontWeight="500" opacity={0.5}>
              {t("totalSupply")}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              {formatNumberWithUnit(Number(data.TotalSupply || 0))}
            </Text>
          </Card>
        </Flex>
        <Card fontSize="xs" fontWeight="500">
          <Grid gap={3}>
            <Flex justifyContent="space-between" alignItems="center" gap={2}>
              <Text>Create Time</Text>
              <Text fontWeight="bold">
                {getRelativeTime(data.LaunchTime * 1000)}
              </Text>
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" alignItems="center" gap={2}>
              <Text>Pair</Text>
              <Box
                as="button"
                onClick={() => copyContractAddress(data.PairAddress)}
                display="flex"
                alignItems="center"
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
                _hover={{
                  bg: "gray.100",
                  borderColor: "brand.primary",
                }}
                transition="all 0.2s"
                title={t("copyAddressSuccess")}
              >
                <Icon as={FaFileContract} mr={1} fontSize="10px" />
                {formatContractAddress(data.PairAddress)}
              </Box>
            </Flex>
            <Divider />
            <Flex justifyContent="space-between" alignItems="center" gap={2}>
              <Text>CA</Text>
              <Box
                as="button"
                onClick={() => copyContractAddress(data.Address)}
                display="flex"
                alignItems="center"
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
                _hover={{
                  bg: "gray.100",
                  borderColor: "brand.primary",
                }}
                transition="all 0.2s"
                title={t("copyAddressSuccess")}
              >
                <Icon as={FaFileContract} mr={1} fontSize="10px" />
                {formatContractAddress(data.Address)}
              </Box>
            </Flex>
          </Grid>
        </Card>
      </Grid>
    );
  };

  // 持有人地址
  // const MarketTokenHolders = () => {
  //   const hoverBg = useColorModeValue("gray.50", "gray.700");
  //   return (
  //     <Card gap={2}>
  //       <Text fontWeight="bold">Holders</Text>
  //       <TableContainer>
  //         <Table variant="simple">
  //           <Tbody fontWeight="600">
  //             <Tr _hover={{ bg: hoverBg }} transition="background-color 0.2s">
  //               <Td p={2}>1</Td>
  //               <Td p={2} w="100%">
  //                 {formatContractAddress(
  //                   "0x1234567890123456789012345678901234567890"
  //                 )}
  //               </Td>
  //               <Td p={2} opacity={0.65} textAlign="right">
  //                 100%
  //               </Td>
  //             </Tr>
  //             <Tr _hover={{ bg: hoverBg }} transition="background-color 0.2s">
  //               <Td p={2}>2</Td>
  //               <Td p={2} flex={1} w="100%">
  //                 {formatContractAddress(
  //                   "0x1234567890123456789012345678901234567890"
  //                 )}
  //               </Td>
  //               <Td p={2} opacity={0.65} textAlign="right">
  //                 50%
  //               </Td>
  //             </Tr>
  //             <Tr _hover={{ bg: hoverBg }} transition="background-color 0.2s">
  //               <Td p={2}>2</Td>
  //               <Td p={2} flex={1} w="100%">
  //                 {formatContractAddress(
  //                   "0x1234567890123456789012345678901234567890"
  //                 )}
  //               </Td>
  //               <Td p={2} opacity={0.65} textAlign="right">
  //                 0.16%
  //               </Td>
  //             </Tr>
  //           </Tbody>
  //         </Table>
  //       </TableContainer>
  //     </Card>
  //   );
  // };

  return (
    <>
      <Grid
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr" }}
        gap={4}
      >
        {/* 代币信息 */}
        <MarketTokenInfo />
        {/* 代币数据 */}
        <MarketTokenData />
      </Grid>
      {/* 持有人地址 */}
      {/* <MarketTokenHolders /> */}
    </>
  );
};

export default function MarketDetailPage() {
  // const { address } = useParams();
  // const data = useSearchParams().get("data");
  // const token = data ? JSON.parse(data) : null;
  // const { getMarketList } = MarketAPI;
  const [marketDetail, setMarketDetail] = useState<MarketDetailType>({
    Address: "",
    Deployed: 0,
    LaunchTime: 0,
    Logo: "",
    MarketCap: "",
    MintAmount: "",
    Name: "",
    NowAmount: "",
    PairAddress: "",
    Price: "",
    PriceChange_24: "",
    Rate: "",
    Telegram: "",
    Ticker: "",
    TotalSupply: "",
    Twitter: "",
    UpTime: 0,
    Volume_24: "",
    WebSite: "",
    id: 0,
  });

  const getMarketDetail = async () => {
    // const res = await getMarketList({
    //   search: address as string,
    //   // search: address as string,
    // });
    // setMarketDetail(res.data.data[0]);
    const token = localStorage.getItem("MarketDetail");
    setMarketDetail(JSON.parse(token || "{}"));
  };

  useEffect(() => {
    getMarketDetail();
  }, []);

  // 动态检测是否为移动端
  const isMobile = useMediaQuery("(max-width: 992px)")[0];

  return (
    <Box>
      <Container maxW="container.xl" py={{ base: 4, md: 12 }}>
        {/* 返回按钮 */}
        <Box gap={2} mb={6} fontWeight="500" columnGap={1} w="fit-content">
          <Link
            href="/market"
            style={{ display: "flex", alignItems: "center", gap: 2 }}
            onClick={() => {
              localStorage.removeItem("MarketDetail");
            }}
          >
            <Icon as={IoIosArrowBack} boxSize="24px" />
            <Text fontSize="xl">Back</Text>
          </Link>
        </Box>
        {/* 检测是否为移动端 */}
        {isMobile ? (
          <Tabs colorScheme="purple" variant="enclosed" defaultValue="info">
            <TabList
              borderBottom="2px"
              borderColor="brand.primary"
              mb={4}
              overflow="hidden"
              overflowX="auto"
              display="grid"
              gridTemplateColumns="1fr 1fr"
            >
              <Tab
                fontWeight="medium"
                value="info"
                _selected={{
                  color: "brand.primary",
                  borderColor: "brand.primary",
                  borderBottom: "3px solid",
                  fontWeight: "bold",
                  bg: "gray.50",
                }}
                _hover={{
                  color: "brand.primary",
                  borderColor: "brand.light",
                }}
                transition="all 0.2s"
              >
                Info
              </Tab>
              <Tab
                fontWeight="medium"
                value="chart"
                _selected={{
                  color: "brand.primary",
                  borderColor: "brand.primary",
                  borderBottom: "3px solid",
                  fontWeight: "bold",
                  bg: "gray.50",
                }}
                _hover={{
                  color: "brand.primary",
                  borderColor: "brand.light",
                }}
                transition="all 0.2s"
              >
                Chart
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0} display="grid" gap={4}>
                <Right data={marketDetail} />
              </TabPanel>
              <TabPanel p={0}>
                <Left data={marketDetail} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <Flex gap={6}>
            {/* 左侧 */}
            <Card flex={1} gap={6} h="fit-content">
              <Left data={marketDetail} />
            </Card>
            {/* 右侧代币信息、代币数据、持有人地址 */}
            <Grid gap={4} h="fit-content">
              <Right data={marketDetail} />
            </Grid>
          </Flex>
        )}
      </Container>
    </Box>
  );
}
