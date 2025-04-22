"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  InputRightElement,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Image,
  Flex,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  ButtonGroup,
  useToast,
  Center,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  FaFire,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaSort,
  FaGlobe,
  FaTwitter,
  FaTelegram,
  FaShareAlt,
  FaLayerGroup,
  FaFileContract,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import NextLink from "next/link";
// import { marketTokens } from "@/mock";
import { useTranslation } from "react-i18next";
import { MarketAPI } from "@/api";
import { formatNumberWithUnit } from "@/utils";
import { MarketDetailType } from "./[address]/page";
import Link from "next/link";

// 排序指示器组件
function SortIndicator({
  column,
  sortColumn,
  sortDirection,
}: {
  column: string;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}) {
  if (sortColumn !== column) {
    return (
      <Box as="span" ml={1} color="gray.400" opacity={0.6}>
        <Icon as={FaSort} fontSize="xs" />
      </Box>
    );
  }
  return (
    <Box as="span" ml={1} color="brand.primary">
      <Icon
        as={sortDirection === "asc" ? ChevronUpIcon : ChevronDownIcon}
        fontSize="sm"
      />
    </Box>
  );
}

// 列表视图组件
function TokenListView({
  tokens,
  sortColumn,
  sortDirection,
  onSort,
}: {
  tokens: any[];
  sortColumn: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}) {
  const bg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const thBg = useColorModeValue("gray.50", "gray.700");
  const thHoverBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("gray.600", "gray.400");
  const iconHoverColor = useColorModeValue("brand.primary", "brand.light");
  const toast = useToast();
  const { t } = useTranslation();

  const ThSortable = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <Th
      onClick={() => onSort(column)}
      cursor="pointer"
      position="relative"
      py={4}
      bg={thBg}
      borderBottom="2px"
      borderColor="brand.primary"
      _hover={{ bg: thHoverBg }}
      transition="all 0.2s"
      textAlign="right"
      isNumeric={true}
    >
      <Flex align="center" justify="flex-end">
        {children}
        <SortIndicator
          column={column}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </Flex>
    </Th>
  );

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

  // 分享功能处理
  const handleShare = (token: any) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${token.name} (${token.symbol})`,
          text: t("viewTokenMarketInfo", { name: token.name }),
          url: window.location.origin + `/market/${token.id}`,
        })
        .catch((error) => console.log(t("shareFailed"), error));
    } else {
      // 如果浏览器不支持，可以复制链接到剪贴板
      const url = window.location.origin + `/market/${token.id}`;
      navigator.clipboard
        .writeText(url)
        .then(() =>
          toast({
            title: t("linkCopied"),
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          })
        )
        .catch((error) => console.log(t("copyFailed"), error));
    }
  };

  return (
    <TableContainer bg={bg} borderRadius="lg" boxShadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary">
              {t("tokenColumn")}
            </Th>
            <ThSortable column="price">{t("priceColumn")}</ThSortable>
            <ThSortable column="change24hValue">
              {t("change24hColumn")}
            </ThSortable>
            <ThSortable column="marketCap">{t("marketCapColumn")}</ThSortable>
            <ThSortable column="totalSupply">
              {t("totalSupplyColumn")}
            </ThSortable>
            <ThSortable column="volume24h">{t("volumeColumn")}</ThSortable>
            <Th
              bg={thBg}
              borderBottom="2px"
              borderColor="brand.primary"
              isNumeric
              textAlign="right"
            >
              {t("contractAddressColumn")}
            </Th>
            <Th
              bg={thBg}
              borderBottom="2px"
              borderColor="brand.primary"
              isNumeric
              textAlign="right"
            >
              {t("linksColumn")}
            </Th>
            <Th bg={thBg} borderBottom="2px" borderColor="brand.primary"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokens.map((token) => (
            <Tr key={token.id} _hover={{ bg: hoverBg }}>
              <Td>
                <HStack spacing={2} align="center">
                  <Image
                    src={token.Logo}
                    alt={token.Name}
                    boxSize="40px"
                    borderRadius="full"
                    objectFit="cover"
                    border="2px solid"
                    borderColor="brand.light"
                  />
                  <Box>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="brand.primary"
                      lineHeight="1.2"
                    >
                      {token.Ticker}
                    </Text>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      mt={0.5}
                      noOfLines={1}
                      maxW="150px"
                    >
                      {token.Name}
                    </Text>
                  </Box>
                </HStack>
              </Td>
              <Td isNumeric fontWeight="bold">
                $ {token.Price}
              </Td>
              <Td isNumeric>
                <Flex justify="flex-end">
                  <Text
                    fontWeight="bold"
                    color={
                      Number(token.PriceChange_24 || 0) > 0
                        ? "green.500"
                        : "red.500"
                    }
                  >
                    <Icon
                      as={
                        Number(token.PriceChange_24 || 0) > 0
                          ? FaArrowUp
                          : FaArrowDown
                      }
                      boxSize="12px"
                      mr={1}
                    />
                    {Math.abs(Number(token.PriceChange_24 || 0))}%
                  </Text>
                </Flex>
              </Td>
              <Td isNumeric>
                $ {Number(token.MarketCap || 0).toLocaleString()}
              </Td>
              <Td isNumeric>
                {formatNumberWithUnit(Number(token.TotalSupply || 0))}
              </Td>
              <Td isNumeric>
                $ {Number(token.Volume_24 || 0).toLocaleString()}
              </Td>
              <Td isNumeric>
                {token.Address && (
                  <Box
                    as="button"
                    onClick={() => copyContractAddress(token.Address)}
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
                    ml="auto"
                    _hover={{
                      bg: "gray.100",
                      borderColor: "brand.primary",
                    }}
                    transition="all 0.2s"
                    title={t("clickToCopyFullAddress")}
                  >
                    <Icon as={FaFileContract} mr={1} fontSize="10px" />
                    {formatContractAddress(token.Address)}
                  </Box>
                )}
              </Td>
              <Td isNumeric>
                <HStack spacing={3} justify="flex-end">
                  {token.WebSite && (
                    <Box
                      as="a"
                      href={token.WebSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      color={iconColor}
                      _hover={{ color: iconHoverColor }}
                      transition="color 0.2s"
                    >
                      <Icon as={FaGlobe} boxSize="16px" />
                    </Box>
                  )}
                  {token.Twitter && (
                    <Box
                      as="a"
                      href={token.Twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      color={iconColor}
                      _hover={{ color: iconHoverColor }}
                      transition="color 0.2s"
                    >
                      <Icon as={FaTwitter} boxSize="16px" />
                    </Box>
                  )}
                  {token.Telegram && (
                    <Box
                      as="a"
                      href={token.Telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      color={iconColor}
                      _hover={{ color: iconHoverColor }}
                      transition="color 0.2s"
                    >
                      <Icon as={FaTelegram} boxSize="16px" />
                    </Box>
                  )}
                  <Box
                    as="button"
                    onClick={() => handleShare(token)}
                    color={iconColor}
                    _hover={{ color: iconHoverColor }}
                    transition="color 0.2s"
                  >
                    <Icon as={FaShareAlt} boxSize="16px" />
                  </Box>
                </HStack>
              </Td>
              <Td>
                <Link
                  href={{
                    pathname: `/market/${token.Address}`,
                  }}
                  onClick={() => {
                    localStorage.removeItem("MarketDetail");
                    localStorage.setItem("MarketDetail", JSON.stringify(token));
                  }}
                >
                  <Button
                    // as={NextLink}
                    // href={`/market/${token.Address}`}
                    colorScheme="purple"
                    size="sm"
                    bg="brand.primary"
                    _hover={{ bg: "brand.light" }}
                  >
                    {t("detail")}
                  </Button>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

// 修改分页导航组件，使其与mint页面的设计保持一致
function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}) {
  const pageSizeOptions = [10, 20, 30, 50];
  const { t } = useTranslation();

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      mt={6}
      flexDir={{ base: "column", md: "row" }}
      gap={4}
    >
      <HStack>
        <Text fontSize="sm" fontWeight="medium">
          {t("itemsPerPage")}:
        </Text>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          size="sm"
          w="80px"
          borderColor="gray.300"
          _hover={{ borderColor: "brand.primary" }}
          _focus={{
            borderColor: "brand.primary",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-primary)",
          }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </HStack>

      <HStack>
        <Text fontSize="sm">
          {t("pageInfo")
            .replace("{current}", currentPage.toString())
            .replace("{total}", totalPages.toString())}
        </Text>
        <ButtonGroup isAttached variant="outline" size="sm">
          <IconButton
            aria-label={t("prevPage")}
            icon={<FaChevronLeft />}
            onClick={() => onPageChange(currentPage - 1)}
            isDisabled={currentPage <= 1}
            colorScheme="purple"
          />
          <IconButton
            aria-label={t("nextPage")}
            icon={<FaChevronRight />}
            onClick={() => onPageChange(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
            colorScheme="purple"
          />
        </ButtonGroup>
      </HStack>
    </Flex>
  );
}

export const MarketTokenList = ({
  type = "Volume_24",
  searchTerm = "",
}: {
  type: "Volume_24" | "Deployed" | "all";
  searchTerm?: string;
}) => {
  const { t } = useTranslation();
  const { getMarketList } = MarketAPI;
  const [tokens, setTokens] = useState<[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [sortColumn, setSortColumn] = useState("marketCap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (column: string) => {
    const newDirection =
      sortColumn === column && sortDirection === "desc" ? "asc" : "desc";
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到页面顶部以便查看新内容
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 处理每页显示数量变化
  const handlePageSizeChange = (newSize: number) => {
    // 调整当前页以保持项目连续性
    const firstItemIndex = (currentPage - 1) * pageSize;
    const newCurrentPage = Math.floor(firstItemIndex / newSize) + 1;

    setPageSize(newSize);
    setCurrentPage(newCurrentPage);
  };

  const getMarketListData = async () => {
    const res = await getMarketList({
      orderBy: type,
      page: currentPage,
      pageSize,
      search: searchTerm,
    });

    setTokens(res.data.data);
    setTotalPages(res.data.total);
  };

  useEffect(() => {
    getMarketListData();
  }, [searchTerm, currentPage, pageSize]);

  // 搜索、排序条件变化时重置为第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [sortColumn, sortDirection, searchTerm]);

  const sortedTokens = useMemo(() => {
    const fieldMap: { [key: string]: string } = {
      price: "Price",
      change24hValue: "PriceChange_24",
      marketCap: "MarketCap",
      totalSupply: "TotalSupply",
      volume24h: "Volume_24",
    };

    return [...tokens].sort((a, b) => {
      const field = fieldMap[sortColumn] || sortColumn;
      const aValue = Number(a[field] || 0);
      const bValue = Number(b[field] || 0);
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [tokens, sortColumn, sortDirection]);

  return (
    <TabPanel key={type} p={0}>
      <TokenListView
        tokens={sortedTokens}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      {/* 分页控制 */}
      {totalPages > 1 && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
      {/* 显示结果信息 */}
      <Center mt={4} mb={4}>
        <Text fontSize="sm" color="gray.500">
          {t("totalResults").replace("{count}", totalPages.toString() || "0")}
        </Text>
      </Center>
    </TabPanel>
  );
};

export default function MarketPage() {
  const { getTokenData } = MarketAPI;

  // 市场概览数据
  const [marketOverview, setMarketOverview] = useState<{
    total: number;
    totalMarketCap: number;
    totalVolume24: number;
  }>({
    total: 0,
    totalMarketCap: 0,
    totalVolume24: 0,
  });

  // 搜索相关状态
  const [searchTerm, setSearchTerm] = useState("");
  // 分页相关状态
  const { t } = useTranslation();

  // 获取市场概览数据
  const getMarketOverview = async () => {
    const res = await getTokenData();
    setMarketOverview(res.data);
  };

  // 初始化获取市场概览数据
  useEffect(() => {
    getMarketOverview();
  }, []);

  return (
    <Box>
      {/* 页面标题 */}
      <Container maxW="container.xl" py={12}>
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
        >
          <Box>
            <Heading as="h2" size="lg" mb={2}>
              {t("marketTitle")}
            </Heading>
            <Text color="gray.500">{t("marketDescription")}</Text>
          </Box>
        </Stack>

        {/* 市场统计 */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          templateColumns={{ md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          sx={{
            "& > *:last-child": {
              gridColumn: { md: "1 / -1", lg: 3 },
            },
          }}
          spacing={{ base: 4, md: 6 }}
          my={{ base: 6, md: 10 }}
        >
          <Box
            px={{ base: 4, md: 5 }}
            py={4}
            pb={{ base: 3, md: 4 }}
            position="relative"
            overflow="hidden"
            shadow={"xl"}
            borderRadius={"xl"}
            bgGradient={useColorModeValue(
              "linear(to-br, blue.50, purple.50)",
              "linear(to-br, blue.900, purple.900)"
            )}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "xl",
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              bgGradient: "linear(to-r, blue.400, purple.400)",
            }}
            display={{ base: "flex", md: "block" }}
            gap={{ base: 2, md: 0 }}
            justifyContent={{ base: "space-between", md: "center" }}
          >
            <Flex
              mb={{ base: 0, md: 2 }}
              justify={{ base: "center", md: "space-between" }}
              align="center"
              gap={{ base: 2, md: 0 }}
              flexDir={{ base: "row-reverse", md: "row" }}
            >
              <Text
                fontWeight="bold"
                fontSize={{ base: "sm", sm: "md" }}
                color={useColorModeValue("gray.600", "gray.300")}
              >
                {t("totalTokens")}
              </Text>
              <Icon
                as={FaLayerGroup}
                boxSize={{ base: 5, md: 7 }}
                color="blue.400"
              />
            </Flex>
            <Text
              fontSize={{ base: "md", md: "3xl" }}
              fontWeight="bold"
              color={useColorModeValue("blue.600", "blue.300")}
            >
              {formatNumberWithUnit(Number(marketOverview.total || 0))}
            </Text>
          </Box>

          <Box
            px={{ base: 4, md: 5 }}
            py={4}
            pb={{ base: 3, md: 4 }}
            position="relative"
            overflow="hidden"
            shadow={"xl"}
            borderRadius={"xl"}
            bgGradient={useColorModeValue(
              "linear(to-br, green.50, teal.50)",
              "linear(to-br, green.900, teal.900)"
            )}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "xl",
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              bgGradient: "linear(to-r, green.400, teal.400)",
            }}
            display={{ base: "flex", md: "block" }}
            gap={{ base: 2, md: 0 }}
            justifyContent={{ base: "space-between", md: "center" }}
          >
            <Flex
              mb={{ base: 0, md: 2 }}
              justify={{ base: "center", md: "space-between" }}
              align="center"
              gap={{ base: 2, md: 0 }}
              flexDir={{ base: "row-reverse", md: "row" }}
            >
              <Text
                fontWeight="bold"
                fontSize={{ base: "sm", sm: "md" }}
                color={useColorModeValue("gray.600", "gray.300")}
              >
                {t("totalMarketCap")}
              </Text>
              <Icon
                as={FaChartLine}
                boxSize={{ base: 5, md: 7 }}
                color="green.400"
              />
            </Flex>
            <Text
              fontSize={{ base: "md", md: "3xl" }}
              fontWeight="bold"
              color={useColorModeValue("green.600", "green.300")}
            >
              ${" "}
              {formatNumberWithUnit(Number(marketOverview.totalMarketCap || 0))}
            </Text>
          </Box>

          <Box
            px={{ base: 4, md: 5 }}
            py={4}
            pb={{ base: 3, md: 4 }}
            position="relative"
            overflow="hidden"
            shadow={"xl"}
            borderRadius={"xl"}
            bgGradient={useColorModeValue(
              "linear(to-br, orange.50, red.50)",
              "linear(to-br, orange.900, red.900)"
            )}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "xl",
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              bgGradient: "linear(to-r, orange.400, red.400)",
            }}
            display={{ base: "flex", md: "block" }}
            gap={{ base: 2, md: 0 }}
            justifyContent={{ base: "space-between", md: "center" }}
          >
            <Flex
              mb={{ base: 0, md: 2 }}
              justify={{ base: "center", md: "space-between" }}
              align="center"
              gap={{ base: 2, md: 0 }}
              flexDir={{ base: "row-reverse", md: "row" }}
            >
              <Text
                fontWeight="bold"
                fontSize={{ base: "sm", sm: "md" }}
                color={useColorModeValue("gray.600", "gray.300")}
              >
                {t("totalVolume24h")}
              </Text>
              <Icon
                as={FaFire}
                boxSize={{ base: 5, md: 7 }}
                color="orange.400"
              />
            </Flex>
            <Text
              fontSize={{ base: "md", md: "3xl" }}
              fontWeight="bold"
              color={useColorModeValue("orange.600", "orange.300")}
            >
              ${" "}
              {formatNumberWithUnit(Number(marketOverview.totalVolume24 || 0))}
            </Text>
          </Box>
        </SimpleGrid>

        <Tabs
          variant="soft-rounded"
          colorScheme="brand"
          mb={6}
          defaultIndex={1}
        >
          <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 1, md: 2 }}
          >
            <TabList
              width={{ base: "100%", md: "auto" }}
              overflowX="auto"
              whiteSpace="nowrap"
              py={2}
            >
              <Tab _selected={{ color: "white", bg: "brand.primary" }}>
                <Icon as={FaChartLine} mr={1} /> {t("marketCapRanking")}
              </Tab>
              <Tab _selected={{ color: "white", bg: "brand.primary" }}>
                <Icon as={FaFire} mr={1} /> {t("hotTokens")}
              </Tab>
              <Tab _selected={{ color: "white", bg: "brand.primary" }}>
                {t("all")}
              </Tab>
            </TabList>

            <InputGroup maxW={{ base: "100%", md: "300px" }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder={t("searchNameSymbolAddress")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // 在搜索时重置到第一页
                  // setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <InputRightElement>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      // 清空搜索时重置到第一页
                      // setCurrentPage(1);
                    }}
                    variant="ghost"
                  >
                    ×
                  </Button>
                </InputRightElement>
              )}
            </InputGroup>
          </Flex>

          <TabPanels>
            <MarketTokenList type="Volume_24" searchTerm={searchTerm} />
            <MarketTokenList type="Deployed" searchTerm={searchTerm} />
            <MarketTokenList type="all" searchTerm={searchTerm} />
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}
