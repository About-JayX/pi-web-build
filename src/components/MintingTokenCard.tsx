/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Box,
  Stack,
  HStack,
  Text,
  Card,
  CardBody,
  Divider,
  Button,
  useColorModeValue,
  Icon,
  Image,
  useToast,
  Flex,
  Grid,
  Link,
} from "@chakra-ui/react";
import {
  FaGlobe,
  FaTelegram,
  FaShareAlt,
  FaFileContract,
  FaHammer,
  FaUsers,
  FaCoins,
  FaExchangeAlt,
} from "react-icons/fa";
import { FaUser,FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import { formatTokenAmount } from "@/utils";
import { useMemo, useState } from "react";
import { useMintingCalculations } from "@/hooks/useMintingCalculations";
import { useNetwork } from "@/contexts/NetworkContext";
import { useRouter } from "next/navigation";
import { ShareModal } from "./index";
import Progress from "./Progress";

// 判断是否为测试环境
const isTestEnv = process.env.NODE_ENV === "development";

// 定义社交媒体链接类型
interface SocialLink {
  id?: number;
  link?: string; // API可能返回link
  url?: string; // 或者返回url
  platform?: string;
}

// 定义UI中使用的社交媒体链接类型
interface SocialLinkDisplay {
  platform: string;
  link: string;
  icon: IconType;
}

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
    socials?: SocialLink[]; // 添加社交媒体链接数组
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

  // 添加状态管理分享弹窗
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  // 更新分享功能处理
  const handleShare = () => {
    // 打开分享弹窗，不再使用原有的navigator.share实现
    setIsShareModalOpen(true);
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

  // 获取社交媒体链接
  const getSocials = () => {
    const links: SocialLinkDisplay[] = [];

    // 定义平台到图标的映射
    const platformIconMap: Record<string, IconType> = {
      website: FaGlobe,
      twitter: FaXTwitter,
      telegram: FaTelegram,
    };

    // 处理社交媒体链接
    if (token.socials && token.socials.length > 0) {
      token.socials.forEach((social) => {
        // 确保平台名称和链接存在
        if (!social.platform || !social.link) return;

        const platformName = social.platform.toLowerCase();

        // 只添加已知平台的链接
        if (platformIconMap[platformName]) {
          links.push({
            platform: platformName,
            link: social.link,
            icon: platformIconMap[platformName],
          });
        }
      });
    }

    return links;
  };

  // 获取社交媒体链接
  const socialLinks = getSocials();

  // 构建分享信息
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${network.toLowerCase()}/${token.address}`
      : `/${network.toLowerCase()}/${token.address}`;

  const shareContent = "";

  // 定义分享用的哈希标签
  const shareHashtags = ["PIS", "PI", "Web3", token.symbol];

  return (
    <>
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
            !(e.target as HTMLElement).closest("button") &&
            !(e.target as HTMLElement).closest("a")
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
          <Flex direction="column" alignItems="center">
            <Image
              src={token.image}
              alt={token.name}
              boxSize="80px"
              borderRadius="2xl"
              objectFit="cover"
              border="2px solid"
              borderColor="brand.light"
              transition="transform 0.3s ease"
              _groupHover={{
                transform: "scale(1.05)",
              }}
            />
            {/* 社交媒体图标移到这里 */}
            {socialLinks.length > 0 && (
              <HStack spacing={1} mt={2} justify="center">
                {socialLinks.map((social, index) => (
                  <Box
                    key={`${social.platform}-${index}`}
                    as="button"
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    _hover={{ color: "brand.primary" }}
                    _active={{ bg: "gray.50" }}
                    transition="color 0.2s"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(social.link, "_blank");
                    }}
                    color={iconColor}
                  >
                    <Icon as={social.icon} boxSize="16px" />
                  </Box>
                ))}
              </HStack>
            )}
          </Flex>
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
              <Flex>
                {/* 测试标识 - 只在测试环境且总供应量为1000000时显示 */}
                {isTestEnv && parseFloat(token.totalSupply) === 1000000 && (
                  <Text
                    as="span"
                    fontSize="xs"
                    mr={2}
                    color="orange.500"
                    bg="orange.100"
                    px={1}
                    py={0.5}
                    borderRadius="sm"
                    fontWeight="medium"
                  >
                    测试
                  </Text>
                )}
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
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text as="span" fontSize="xs" color="gray.500" mt={-1}>
                {token.name}
              </Text>

              {/* 社交媒体图标已移至logo下方 */}
            </Flex>

            <Grid mt={1} gap={0.5}>
              <HStack spacing={2} align="center">
                <Progress
                  value={token.progress || 0}
                  borderRadius="full"
                  size="sm"
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
                p={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                _active={{ bg: "gray.50" }}
              >
                <Icon as={FaShareAlt} boxSize="16px" />
              </Box>
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {/* 添加分享弹窗 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`分享 ${token.name} (${token.symbol})`}
        content={shareContent}
        url={shareUrl}
        tokenTicker={token.symbol}
        tokenName={token.name}
        contractAddress={token.address}
        hashtags={shareHashtags}
      />
    </>
  );
}
