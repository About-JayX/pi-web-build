"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Progress,
  Button,
  useColorModeValue,
  Flex,
  Icon,
  Image,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Select,
  IconButton,
  Spinner,
  Grid,
  Card,
  CardBody,
} from "@chakra-ui/react";
import {
  FaThLarge,
  FaList,
  FaSort,
  FaSearch,
  FaShareAlt,
  FaFileContract,
  FaChevronLeft,
  FaChevronRight,
  FaSync,
  FaPlus,
} from "react-icons/fa";
import NextLink from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useNetwork } from "@/contexts/NetworkContext";
import MintingTokenCard from "@/components/MintingTokenCard";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import axios from "@/config/axios";
import { store } from "@/store";
import { fetchTokenList } from "@/store/slices/tokenSlice";
import { formatTokenAmount } from "@/utils";
import { useMintingCalculations } from "@/hooks/useMintingCalculations";
import PaginationControl from "@/components/PaginationControl";
import TokenListView from "@/components/TokenListView";
import FilterPanel from "@/components/FilterPanel";
import { MintToken } from "@/api/types";
import { LoadingSpinner, StyledTabs } from "@/components";
import ErrorDisplay from "@/components/common/ErrorDisplay";

export default function MintPage() {
  const { tokenList, loading, error } = useAppSelector((state) => state.token);
  const { network } = useNetwork();
  const { t } = useTranslation();

  // 添加初次加载标记，用于避免页面刷新时不必要的数据请求
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    // 仅在客户端执行
    if (typeof window !== "undefined") {
      // 从localStorage中读取保存的每页显示数量
      const savedPageSize = localStorage.getItem("mint_page_size");
      // 如果存在有效值则使用它，否则默认为12
      return savedPageSize ? Number(savedPageSize) || 12 : 12;
    }
    // 服务器端渲染时默认使用12
    return 12;
  });
  const [tabIndex, setTabIndex] = useState(() => {
    // 仅在客户端执行
    if (typeof window !== "undefined") {
      // 从localStorage中读取保存的标签页索引
      const savedTabIndex = localStorage.getItem("mint_tab_index");
      // 如果存在有效值则使用它，否则默认为0
      return savedTabIndex ? Number(savedTabIndex) || 0 : 0;
    }
    // 服务器端渲染时默认使用第一个标签页
    return 0;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">(() => {
    // 仅在客户端执行
    if (typeof window !== "undefined") {
      // 从localStorage中读取保存的视图模式
      const savedViewMode = localStorage.getItem("mint_view_mode");
      // 如果存在有效值则使用它，否则默认为'card'
      return savedViewMode === "card" || savedViewMode === "list"
        ? savedViewMode
        : "card";
    }
    // 服务器端渲染时默认使用卡片视图
    return "card";
  });
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [totalTokenCount, setTotalTokenCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 获取token列表
  const getTokenList = async () => {
    try {
      // 在数据加载前先滚动到顶部
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }

      // 根据标签索引选择不同的排序字段
      let sortField = "";
      switch (tabIndex) {
        case 0: // 热门铸造
          sortField = "progress";
          break;
        case 1: // 所有代币
          sortField = "token_id";
          break;
        case 2: // 最新部署
          sortField = "created_at";
          break;
        case 3: // 铸造结束
          sortField = "progress";
          break;
        default:
          sortField = "progress";
      }

      // 构建请求参数，添加搜索关键词
      const params: any = {
        page: currentPage,
        limit: pageSize,
        sort: sortField,
      };

      // 如果有搜索关键词，添加到请求参数中
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // 如果是铸造结束标签页，添加进度100%的过滤条件
      if (tabIndex === 3) {
        params.finished = true;
      }

      // 先清空数据，显示加载状态，避免数据跳动
      store.dispatch({
        type: "token/fetchTokenList/pending",
      });

      // 发起数据请求
      await store.dispatch(fetchTokenList(params));

      // 数据加载完成后再次滚动到顶部，确保数据渲染时页面保持在顶部
      if (typeof window !== "undefined") {
        // 使用多种滚动方法确保兼容性
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // 延迟再次执行滚动，以应对可能的延迟渲染
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 50);

        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 150);
      }
    } catch (error) {
      console.error("获取代币列表失败:", error);
    }
  };

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    // 只更新页码，滚动由PaginationControl组件处理
    setCurrentPage(newPage);
  };

  // 处理每页显示数量变化
  const handlePageSizeChange = (newSize: number) => {
    // 调整当前页以保持项目连续性
    const firstItemIndex = (currentPage - 1) * pageSize;
    const newCurrentPage = Math.floor(firstItemIndex / newSize) + 1;

    // 更新状态，滚动由PaginationControl组件处理
    setPageSize(newSize);
    setCurrentPage(newCurrentPage);
  };

  // 计算总页数
  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      // 如果返回的数据条数等于pageSize，说明可能还有下一页
      const hasMorePages = tokenList.length >= pageSize;
      // 如果当前页是第1页，并且有足够多的数据，则至少有2页
      // 否则，我们认为当前页就是最后一页
      const calculatedTotalPages =
        currentPage === 1 && hasMorePages
          ? Math.max(2, currentPage + 1)
          : hasMorePages
          ? currentPage + 1
          : currentPage;

      setTotalPages(calculatedTotalPages);
      setTotalTokenCount(
        tokenList.length + (calculatedTotalPages - currentPage) * pageSize
      );
    } else {
      setTotalPages(1);
      setTotalTokenCount(0);
    }
  }, [tokenList, currentPage, pageSize]);

  // 监听页码变化获取数据
  useEffect(() => {
    // 避免初始加载时的重复请求
    if (isInitialLoad) return;

    // 先清空数据，显示加载状态，避免数据跳动
    store.dispatch({
      type: "token/fetchTokenList/pending",
    });

    // 创建一个强制滚动到顶部的函数
    const forceScrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // 首先强制滚动到顶部
    forceScrollToTop();

    // 根据标签索引选择不同的排序字段
    let sortField = "";
    switch (tabIndex) {
      case 0: // 热门铸造
        sortField = "progress";
        break;
      case 1: // 所有代币
        sortField = "token_id";
        break;
      case 2: // 最新部署
        sortField = "created_at";
        break;
      case 3: // 铸造结束
        sortField = "progress";
        break;
      default:
        sortField = "progress";
    }

    // 构建请求参数
    const params: any = {
      page: currentPage,
      limit: pageSize,
      sort: sortField,
    };

    // 如果是铸造结束标签页，添加进度100%的过滤条件
    if (tabIndex === 3) {
      params.finished = true;
    }

    // 添加短延迟，确保UI可以显示加载状态
    setTimeout(() => {
      // 发起数据请求
      store.dispatch(fetchTokenList(params));

      // 添加延迟滚动，确保在渲染后保持在顶部
      const scrollTimeouts: number[] = [
        setTimeout(forceScrollToTop, 50) as unknown as number,
        setTimeout(forceScrollToTop, 150) as unknown as number,
        setTimeout(forceScrollToTop, 300) as unknown as number,
        setTimeout(forceScrollToTop, 500) as unknown as number,
      ];

      // 清理函数注册
      const timeoutCleaner = setTimeout(() => {
        scrollTimeouts.forEach((timeout) => clearTimeout(timeout));
      }, 600);

      return () => {
        clearTimeout(timeoutCleaner);
        scrollTimeouts.forEach((timeout) => clearTimeout(timeout));
      };
    }, 50);
  }, [currentPage, pageSize, tabIndex, isInitialLoad]);

  // 设置当前网络的计价单位
  const currencyUnit = useMemo(() => {
    return network === "SOL" ? "SOL" : "PI";
  }, [network]);

  // 保存视图模式到本地存储
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mint_view_mode", viewMode);
    }
  }, [viewMode]);

  // 保存标签页选择到本地存储
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mint_tab_index", String(tabIndex));
    }
  }, [tabIndex]);

  // 保存每页显示数量到本地存储
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mint_page_size", String(pageSize));
    }
  }, [pageSize]);

  // 修改切换tab时重置页码并获取数据的useEffect
  useEffect(() => {
    // 如果是初始加载，不触发重复请求
    if (isInitialLoad) {
      return;
    }

    // 注意：不需要重置页码，因为在handleTabChange中已经重置了
    // 这里不再需要 setCurrentPage(1)

    // 根据标签索引选择不同的排序字段
    let sortField = "";
    switch (tabIndex) {
      case 0: // 热门铸造
        sortField = "progress";
        break;
      case 1: // 所有代币
        sortField = "token_id";
        break;
      case 2: // 最新部署
        sortField = "created_at";
        break;
      case 3: // 铸造结束
        sortField = "progress";
        break;
      default:
        sortField = "progress";
    }

    // 先清空数据，显示加载状态，避免数据跳动
    store.dispatch({
      type: "token/fetchTokenList/pending",
    });

    // 构建请求参数
    const params: any = {
      page: 1, // 始终从第一页开始
      limit: pageSize,
      sort: sortField,
    };

    // 如果是铸造结束标签页，添加进度100%的过滤条件
    if (tabIndex === 3) {
      params.finished = true;
    }

    // 添加延迟，确保UI更新后再发起请求
    setTimeout(() => {
      // 发起数据请求
      store.dispatch(fetchTokenList(params));
    }, 50);
  }, [tabIndex, pageSize, isInitialLoad]);

  // 强制在移动设备上使用卡片视图
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode !== "card") {
        setViewMode("card");
      }
    };

    // 添加客户端检测，以避免服务器端渲染问题
    if (typeof window !== "undefined") {
      // 初始化时检查
      handleResize();

      // 监听窗口大小变化
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [viewMode]);

  // 当搜索条件、排序条件变化时，重置为第一页并重新请求数据
  useEffect(() => {
    setCurrentPage(1);
    // 通过监听currentPage变化会自动触发getTokenList
  }, [searchQuery, sortColumn, sortDirection]);

  // Tab切换处理函数，添加到组件中
  const handleTabChange = (index: number) => {
    // 使用多种滚动方法确保最大兼容性
    if (typeof window !== "undefined") {
      // 强制滚动函数
      const forceScrollToTop = () => {
        // 方法1：使用window.scrollTo
        window.scrollTo(0, 0);

        // 方法2：使用document.documentElement
        document.documentElement.scrollTop = 0;

        // 方法3：使用document.body
        document.body.scrollTop = 0;
      };

      // 立即执行滚动
      forceScrollToTop();

      // 先更新标签索引
      setTabIndex(index);

      // 重要：始终将页码重置为1，避免数据跳动
      setCurrentPage(1);

      // 添加多次延迟滚动，以覆盖各种可能的渲染时机
      const scrollTimeouts: number[] = [];

      for (let delay of [10, 50, 100, 300, 500, 800]) {
        scrollTimeouts.push(
          setTimeout(forceScrollToTop, delay) as unknown as number
        );
      }

      // 一段时间后清除所有定时器
      setTimeout(() => {
        scrollTimeouts.forEach((id) => clearTimeout(id));
      }, 1000);
    } else {
      // 直接更新标签索引
      setTabIndex(index);
      // 重置页码
      setCurrentPage(1);
    }
  };

  // 初始化时基于tabIndex加载正确的数据
  useEffect(() => {
    if (isInitialLoad && typeof window !== "undefined") {
      // 根据初始化的标签索引选择正确的排序字段
      let sortField = "";
      switch (tabIndex) {
        case 0: // 热门铸造
          sortField = "progress";
          break;
        case 1: // 所有代币
          sortField = "token_id";
          break;
        case 2: // 最新部署
          sortField = "created_at";
          break;
        case 3: // 铸造结束
          sortField = "progress";
          break;
        default:
          sortField = "progress";
      }

      // 在初始化时基于本地存储中的tabIndex加载数据
      const params: any = {
        page: 1,
        limit: pageSize,
        sort: sortField,
      };

      // 如果是铸造结束标签页，添加进度100%的过滤条件
      if (tabIndex === 3) {
        params.finished = true;
      }

      // 清除tokenList，避免数据跳动
      store.dispatch({
        type: "token/fetchTokenList/pending",
      });

      // 发起数据请求
      store.dispatch(fetchTokenList(params));

      // 标记初始加载已完成
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, tabIndex, pageSize]);

  // 共享排序逻辑
  const handleSort = (column: string) => {
    const newDirection =
      sortColumn === column && sortDirection === "desc" ? "asc" : "desc";
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const renderTabContent = (tokens: MintToken[]) => {
    // 显示加载状态
    if (loading || isInitialLoad) {
      return <LoadingSpinner />;
    }

    // 显示API错误
    if (error) {
      return (
        <Box py={10} textAlign="center">
          <ErrorDisplay message={error} onRetry={getTokenList} />
        </Box>
      );
    }

    // 处理token列表
    const processedTokens = tokens.map((token) => ({
      ...token,
      image: token.logo || "/token-logo.png", // 使用token中的logo，如果没有则使用默认图片
    }));

    // 显示空结果状态
    if (processedTokens.length === 0) {
      return (
        <Box py={10} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            {t("noResults")}
          </Text>
          {searchQuery && (
            <Button
              mt={4}
              variant="outline"
              colorScheme="purple"
              onClick={() => setSearchQuery("")}
            >
              {t("clearSearch")}
            </Button>
          )}
        </Box>
      );
    }

    return (
      <>
        {viewMode === "card" ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2, xl: 3 }}
            spacing={{ base: 6, md: 5, lg: 4, xl: 3 }}
          >
            {processedTokens.map((token) => (
              <MintingTokenCard
                key={token.id}
                token={token}
                currencyUnit={currencyUnit}
              />
            ))}
          </SimpleGrid>
        ) : (
          <TokenListView
            tokens={processedTokens}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            currencyUnit={currencyUnit}
          />
        )}

        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </>
    );
  };

  const inputBg = useColorModeValue("white", "gray.800");

  return (
    <Box>
      <Container maxW="container.xl" py={12}>
        <VStack spacing={{ base: 4, md: 10 }} align="stretch">
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            mb={{ base: 2, md: 0 }}
            spacing={{ base: 2, md: 0 }}
          >
            <Flex
              align="baseline"
              width={{ base: "100%", md: "auto" }}
              mb={{ base: 0, md: 0 }}
            >
              <Heading as="h2" size="lg" m={0}>
                {t("mintingTokens")}
              </Heading>
              <Button
                as={NextLink}
                href="/deploy"
                ml={4}
                mt={{ base: 0, md: 1 }}
                colorScheme="teal"
                variant="solid"
                size={{ base: "sm", md: "md" }}
                bg="teal.400"
                _hover={{ bg: "teal.500" }}
                leftIcon={<FaPlus />}
                fontWeight="medium"
              >
                {t("deploy")}
              </Button>
            </Flex>
            {/* 在移动设备上隐藏视图切换按钮 */}
            <ButtonGroup
              isAttached
              variant="outline"
              colorScheme="purple"
              display={{ base: "none", md: "flex" }}
            >
              <Button
                leftIcon={<FaThLarge />}
                variant={viewMode === "card" ? "solid" : "outline"}
                bg={viewMode === "card" ? "brand.primary" : undefined}
                color={viewMode === "card" ? "white" : "brand.primary"}
                onClick={() => setViewMode("card")}
              >
                {t("cardView")}
              </Button>
              <Button
                leftIcon={<FaList />}
                variant={viewMode === "list" ? "solid" : "outline"}
                bg={viewMode === "list" ? "brand.primary" : undefined}
                color={viewMode === "list" ? "white" : "brand.primary"}
                onClick={() => setViewMode("list")}
              >
                {t("listView")}
              </Button>
            </ButtonGroup>
          </Stack>
          <Grid gap={2}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={4}
              overflow="hidden"
            >
              <Flex
                gap={4}
                overflowX="auto"
                flex={1}
                sx={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none", // Firefox
                  "-ms-overflow-style": "none", // IE and Edge
                }}
              >
                {[
                  t("hotTokens"),
                  t("allMinting"),
                  t("latestDeployed"),
                  t("mintingFinished"),
                ].map((item, index) => (
                  <Button
                    flexShrink={{ base: 0, lg: 1 }}
                    key={index}
                    variant={tabIndex === index ? "outline" : "outline"}
                    bg={tabIndex === index ? "transparent" : ""}
                    color={tabIndex === index ? "brand.primary" : "gray.500"}
                    borderColor={
                      tabIndex === index ? "brand.light" : "transparent"
                    }
                    borderWidth={tabIndex === index ? 2 : 0}
                    onClick={() => setTabIndex(index)}
                  >
                    {item}
                  </Button>
                ))}
              </Flex>
              <InputGroup
                maxW={{ base: "100%", md: "300px" }}
                mb={{ base: 2, md: 0 }}
              >
                <InputLeftElement pointerEvents="none" flexShrink={1}>
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg={inputBg}
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{ borderColor: "brand.primary" }}
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px var(--chakra-colors-brand-primary)",
                  }}
                  size="md"
                  fontSize="sm"
                />
              </InputGroup>
            </Flex>
            <FilterPanel
              sortColumn={"progress"}
              sortDirection={"desc"}
              onSort={() => {}} // 禁用排序功能
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <Card p={0} bg="transparent" shadow="none" mt={{ base: -5, sm:-4 }}>
              <CardBody p={0}>{renderTabContent(tokenList)}</CardBody>
            </Card>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
