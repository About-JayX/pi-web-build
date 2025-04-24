/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Box,
  Stack,
  HStack,
  Text,
  Card,
  CardBody,
  Progress,
  Divider,
  Button,
  useColorModeValue,
  Icon,
  Image,
  useToast,
  Flex,
  Grid,
} from "@chakra-ui/react";
import {
  FaGlobe,
  FaTwitter,
  FaTelegram,
  FaShareAlt,
  FaFileContract,
  FaHammer,
  FaUsers,
  FaCoins,
  FaExchangeAlt,
} from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import { formatTokenAmount } from "@/utils";
import { useMemo } from "react";
import { useMintingCalculations } from "@/hooks/useMintingCalculations";
import { useNetwork } from "@/contexts/NetworkContext";
import { useRouter } from "next/navigation";

interface MintingTokenCardProps {
  token: {
    id: number;
    name: string;
    symbol: string;
    image: string;
    target: string;
    raised: string;
    progress: number;
    totalSupply: string;
    minterCounts: number;
    mintRate?: string;
    tokenDecimal?: number;
    address?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
  };
  currencyUnit?: string;
}

export default function MintingTokenCard({
  token,
  currencyUnit = "SOL",
}: MintingTokenCardProps) {
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("gray.600", "gray.400");
  const iconHoverColor = useColorModeValue("brand.primary", "brand.light");
  const toast = useToast();
  const { t } = useTranslation();
  const { network } = useNetwork();
  const router = useRouter();

  // 使用自定义Hook处理铸造计算
  const { getFormattedMintRate } = useMintingCalculations({
    totalSupply: token.totalSupply,
    target: token.target,
    mintRate: token.mintRate,
    currencyUnit,
    tokenDecimals: token.tokenDecimal || 6, // 从token对象获取小数位，默认为6
  });

  // 缩略显示合约地址
  const formatContractAddress = (address: string) => {
    if (!address) return "";
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };

  // 格式化总供应量，以便在有限空间显示
  const formatSupply = (supply: string) => {
    // 第一性原理：总供应量在tokenSlice中已经被除以10^tokenDecimal，这里仅进行格式化
    // 适当缩写大数字，如显示为：314M，1B等
    return formatTokenAmount(supply, {
      abbreviate: true,
      decimals: 2,
    });
  };

  // 获取铸造金额，确保只有在target存在时才返回值
  const getMintAmount = () => {
    if (!token.target) return 0;
    const targetMatch = token.target.match(/[0-9.]+/);
    if (!targetMatch) return 0;
    return parseFloat(targetMatch[0]);
  };

  // 计算已筹集的金额
  const getCollectedAmount = () => {
    if (!token.target || !token.progress) return "0";
    // 从target中提取数字部分
    const targetMatch = token.target.match(/[0-9.]+/);
    if (!targetMatch) return "0";
    const targetAmount = parseFloat(targetMatch[0]);
    // 计算已筹集金额 = 目标金额 * 进度百分比
    const collected = targetAmount * (token.progress / 100);
    // 保留2位小数，并添加币种单位
    const unit = token.target.replace(/[0-9.]+/g, "").trim();
    return collected.toFixed(2) + " " + unit;
  };

  // 分享功能处理
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${token.name} (${token.symbol})`,
          text: `${t("share")} ${token.name} ${t("token")}`,
          url:
            window.location.origin +
            `/${network.toLowerCase()}/${token.address}`,
        })
        .catch((error) => console.log(`${t("share")} ${t("failed")}:`, error));
    } else {
      // 如果浏览器不支持，可以复制链接到剪贴板
      const url =
        window.location.origin + `/${network.toLowerCase()}/${token.address}`;
      navigator.clipboard
        .writeText(url)
        .then(() =>
          toast({
            title: t("copySuccess"),
            description: t("copyLinkSuccess"),
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          })
        )
        .catch((error) => console.log(`${t("copy")} ${t("failed")}:`, error));
    }
  };

  // 复制合约地址
  const copyContractAddress = () => {
    if (token.address) {
      navigator.clipboard
        .writeText(token.address)
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
        .catch((err) => console.error(`${t("copy")} ${t("failed")}:`, err));
    }
  };

  // 格式化铸造比率，移除千分号
  const formatMintRate = () => {
    const rate = token.mintRate || getFormattedMintRate();
    // 移除数字中的千分号（逗号）
    return rate ? rate.replace(/,/g, "") : rate;
  };

  // 跳转到代币铸造页面
  const navigateToMintPage = () => {
    if (token.address) {
      router.push(`/${network.toLowerCase()}/${token.address}`);
    }
  };

  return (
    <Card
      p={4}
      rounded="2xl"
      shadow="0px 0px 12px 0px rgba(82, 53, 232, 0.20)"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "0px 8px 20px 0px rgba(82, 53, 232, 0.25)",
        cursor: "pointer",
      }}
      _active={{
        transform: "translateY(-2px)",
        shadow: "0px 4px 15px 0px rgba(82, 53, 232, 0.22)",
      }}
      transition="all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      role="group"
      onClick={(e) => {
        // 确保点击按钮或其他交互元素时不触发整个卡片的跳转
        if (
          (e.target as HTMLElement).tagName !== "BUTTON" &&
          !(e.target as HTMLElement).closest("button")
        ) {
          navigateToMintPage();
        }
      }}
    >
      <CardBody
        p={0}
        display="flex"
        flexDirection="row"
        gap={4}
        alignItems="center"
      >
        <Image
          src={token.image}
          alt={token.name}
          boxSize="94px"
          borderRadius="2xl"
          objectFit="cover"
          border="2px solid"
          borderColor="brand.light"
          transition="transform 0.3s ease"
          _groupHover={{
            transform: "scale(1.05)",
          }}
        />
        <Flex flex={1} flexDirection="column" gap={0}>
          <Flex
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text
              as="span"
              fontSize="md"
              fontWeight="bold"
              color="gray.800"
              _groupHover={{ color: "brand.primary" }}
              transition="color 0.2s ease"
            >
              {token.symbol}
            </Text>
            <Button
              h="26px"
              size="sm"
              px={2}
              variant="outline"
              colorScheme="brand"
              bg="#F7F6FE"
              _hover={{ bg: "brand.light" }}
              _active={{ bg: "#F7F6FE" }}
              _groupHover={{
                borderColor: "brand.primary",
                bg: "#F0EDFF",
              }}
              onClick={(e) => e.stopPropagation()}
              leftIcon={
                <Icon
                  as={FaUser}
                  color="#fff"
                  boxSize="16px"
                  p="3px"
                  bg="brand.primary"
                  rounded="6px"
                />
              }
              transition="all 0.2s"
            >
              {token.minterCounts}
            </Button>
          </Flex>
          <Text as="span" fontSize="xs" color="gray.500" mt={-1}>
            {token.name}
          </Text>
          <Grid mt={1} gap={0.5}>
            <HStack spacing={2} align="center">
              <Progress
                value={token.progress || 0}
                borderRadius="full"
                size="sm"
                flex="1"
                bg="#E7E3FC"
                sx={{
                  // 进度条颜色
                  "& > div:last-of-type": {
                    bg: "brand.primary !important",
                    transition: "width 0.5s ease-in-out",
                  },
                }}
                _groupHover={{
                  "& > div:last-of-type": {
                    bg: "brand.600 !important",
                  },
                }}
              />
            </HStack>
            <Flex justifyContent="space-between" alignItems="center">
              {/* 进度及进度了多少SOL */}
              <Text
                as="span"
                fontSize="xs"
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={1}
                transition="color 0.2s"
                _groupHover={{ color: "gray.700" }}
              >
                {(token.progress || 0).toFixed(2)}%
                {token.progress > 0 && (
                  <Text
                    as="span"
                    color="brand.primary"
                    fontSize="xs"
                    _groupHover={{ color: "brand.600" }}
                    transition="color 0.2s"
                  >
                    ({getCollectedAmount()})
                  </Text>
                )}
              </Text>
              <Text
                as="span"
                color="gray.500"
                fontSize="xs"
                transition="color 0.2s"
                _groupHover={{ color: "gray.700" }}
              >
                {token.target}
              </Text>
            </Flex>
          </Grid>
          <Divider my={1.5} />
          <Flex justifyContent="space-between" alignItems="center">
            {/* 总供应量 */}
            <HStack spacing={1}>
              <Image src="/coins.png" alt="coins" boxSize="16px" />
              <Text
                as="span"
                fontSize="xs"
                fontWeight="medium"
                color="gray.500"
              >
                {formatSupply(token.totalSupply)}
              </Text>
            </HStack>
            {/* 铸造价格 */}
            <HStack spacing={1}>
              <Image src="/exchange.png" alt="exchange" boxSize="16px" />
              <Text
                as="span"
                fontSize="xs"
                fontWeight="medium"
                color="gray.500"
              >
                {formatMintRate()}
              </Text>
            </HStack>
            {/* 分享按钮 */}
            <Box
              as="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              color={iconColor}
              _hover={{ color: "brand.primary" }}
              transition="color 0.2s"
              ml={1}
              display={{ base: "block", sm: "block" }}
            >
              <Icon as={FaShareAlt} boxSize="16px" />
            </Box>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}
