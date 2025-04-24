'use client';

import { useTranslation } from 'react-i18next';
import { useI18n } from '@/contexts/I18nProvider';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
  Stack,
  Text,
  Box
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

// 语言选择器属性接口
interface LanguageSelectorProps {
  /**
   * 是否为移动版布局
   */
  isMobile?: boolean;
  
  /**
   * 是否在XPI页面
   */
  isXpiPage?: boolean;
  
  /**
   * 移动版关闭侧边栏函数
   */
  onClose?: () => void;
}

/**
 * 语言选择器组件
 * 提供桌面版下拉菜单和移动版按钮组两种布局
 */
export default function LanguageSelector({ isMobile = false, isXpiPage = false, onClose }: LanguageSelectorProps) {
  const { t } = useTranslation();
  const { language, changeLanguage } = useI18n();

  // 桌面版语言选择按钮样式
  const languageButtonProps = {
    color: isXpiPage ? "white" : useColorModeValue("gray.700", "white"),
    borderWidth: "2px",
    borderColor: isXpiPage
      ? "whiteAlpha.400"
      : useColorModeValue("gray.200", "whiteAlpha.400"),
    bg: isXpiPage
      ? "transparent"
      : useColorModeValue("transparent", "transparent"),
    _hover: {
      borderColor: isXpiPage
        ? "whiteAlpha.600"
        : useColorModeValue("gray.300", "whiteAlpha.600"),
      bg: isXpiPage
        ? "whiteAlpha.200"
        : useColorModeValue("gray.50", "whiteAlpha.100"),
    },
    _active: {
      bg: isXpiPage
        ? "whiteAlpha.300"
        : useColorModeValue("gray.100", "whiteAlpha.200"),
    },
  };

  // 菜单样式
  const menuBgColor = useColorModeValue("white", "gray.800");
  const menuBorderColor = useColorModeValue("gray.200", "gray.700");

  // 各语言菜单项样式
  const getLanguageMenuItemProps = (lang: string) => ({
    bg:
      language === lang
        ? useColorModeValue("purple.50", "brand.dark")
        : undefined,
    color:
      language === lang
        ? useColorModeValue("brand.primary", "white")
        : useColorModeValue("gray.700", "gray.300"),
    _hover: {
      bg: useColorModeValue(
        language === lang ? "purple.100" : "gray.100",
        language === lang ? "brand.primary" : "whiteAlpha.200"
      ),
    },
    _active: {
      bg:
        language === lang
          ? useColorModeValue("brand.primary", "white")
          : useColorModeValue("purple.100", "whiteAlpha.300"),
      color:
        language === lang
          ? useColorModeValue("white", "brand.dark")
          : useColorModeValue("brand.primary", "white"),
    },
  });

  // 移动版样式
  const languageLabelColor = isXpiPage
    ? "gray.300"
    : useColorModeValue("gray.500", "gray.300");
  const inactiveTextColor = isXpiPage
    ? "gray.200"
    : useColorModeValue("gray.700", "gray.300");
  const inactiveBorderColor = isXpiPage
    ? "whiteAlpha.400"
    : useColorModeValue("gray.200", "whiteAlpha.400");
  const inactiveBgColor = isXpiPage
    ? "transparent"
    : useColorModeValue("white", "transparent");
  const hoverBorderColor = isXpiPage
    ? "whiteAlpha.600"
    : useColorModeValue("gray.300", "whiteAlpha.500");
  const inactiveHoverBgColor = isXpiPage
    ? "whiteAlpha.200"
    : useColorModeValue("gray.50", "whiteAlpha.200");
  const hoverTextColor = useColorModeValue("gray.800", "white");
  const inactiveActiveBgColor = isXpiPage
    ? "whiteAlpha.300"
    : useColorModeValue("gray.100", "whiteAlpha.300");
  const buttonHoverBgColor = isXpiPage
    ? "brand.light"
    : useColorModeValue("brand.light", "brand.primary");
  
  // 深色模式固定颜色值
  const darkModeActiveBg = "#5235E8"; // 手动设置为brand.primary的颜色值
  const activeButtonHexColor = "#5235E8"; // 固定为brand.primary的值

  // 处理语言变更
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang as "en" | "ko" | "zh");
    if (isMobile && onClose) {
      onClose();
    }
  };

  // 桌面版下拉菜单
  if (!isMobile) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          {...languageButtonProps}
          size={{ base: "sm", md: "md" }}
          fontWeight={600}
          h={{ base: "36px", md: "40px" }}
          minW={{ base: "80px", md: "100px" }}
          width="auto"
          rightIcon={<ChevronDownIcon />}>
          {t("language")}
        </MenuButton>
        <MenuList
          minW="140px"
          bg={menuBgColor}
          borderColor={menuBorderColor}
          boxShadow="lg">
          <MenuItem
            fontWeight="500"
            onClick={() => handleLanguageChange("en")}
            {...getLanguageMenuItemProps("en")}>
            {t("english")}
          </MenuItem>
          <MenuItem
            fontWeight="500"
            onClick={() => handleLanguageChange("ko")}
            {...getLanguageMenuItemProps("ko")}>
            {t("korean")}
          </MenuItem>
          <MenuItem
            fontWeight="500"
            onClick={() => handleLanguageChange("zh")}
            {...getLanguageMenuItemProps("zh")}>
            {t("chinese")}
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  // 移动版按钮组
  return (
    <Box pt={4} pb={2}>
      <Text fontWeight="600" mb={2} color={languageLabelColor} fontSize="sm">
        {t("language")}
      </Text>
      <Stack spacing={2}>
        <Button
          size="sm"
          variant="outline"
          justifyContent="flex-start"
          onClick={() => handleLanguageChange("en")}
          h="36px"
          color={language === "en" ? "white" : inactiveTextColor}
          borderColor={
            language === "en" ? activeButtonHexColor : inactiveBorderColor
          }
          borderWidth={language === "en" ? "1px" : "1px"}
          bg={language === "en" ? activeButtonHexColor : inactiveBgColor}
          _hover={{
            borderColor:
              language === "en" ? activeButtonHexColor : hoverBorderColor,
            bg: language === "en" ? buttonHoverBgColor : inactiveHoverBgColor,
            color: language === "en" ? "white" : hoverTextColor,
          }}
          _active={{
            bg:
              language === "en"
                ? activeButtonHexColor
                : inactiveActiveBgColor,
          }}
          _dark={{
            borderColor:
              language === "en" ? darkModeActiveBg : "whiteAlpha.400",
            color: language === "en" ? "white" : "gray.300",
            bg: language === "en" ? darkModeActiveBg : "transparent",
            opacity: 1,
          }}>
          {t("english")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          justifyContent="flex-start"
          onClick={() => handleLanguageChange("ko")}
          h="36px"
          color={language === "ko" ? "white" : inactiveTextColor}
          borderColor={
            language === "ko" ? activeButtonHexColor : inactiveBorderColor
          }
          borderWidth={language === "ko" ? "1px" : "1px"}
          bg={language === "ko" ? activeButtonHexColor : inactiveBgColor}
          _hover={{
            borderColor:
              language === "ko" ? activeButtonHexColor : hoverBorderColor,
            bg: language === "ko" ? buttonHoverBgColor : inactiveHoverBgColor,
            color: language === "ko" ? "white" : hoverTextColor,
          }}
          _active={{
            bg:
              language === "ko"
                ? activeButtonHexColor
                : inactiveActiveBgColor,
          }}
          _dark={{
            borderColor:
              language === "ko" ? darkModeActiveBg : "whiteAlpha.400",
            color: language === "ko" ? "white" : "gray.300",
            bg: language === "ko" ? darkModeActiveBg : "transparent",
            opacity: 1,
          }}>
          {t("korean")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          justifyContent="flex-start"
          onClick={() => handleLanguageChange("zh")}
          h="36px"
          color={language === "zh" ? "white" : inactiveTextColor}
          borderColor={
            language === "zh" ? activeButtonHexColor : inactiveBorderColor
          }
          borderWidth={language === "zh" ? "1px" : "1px"}
          bg={language === "zh" ? activeButtonHexColor : inactiveBgColor}
          _hover={{
            borderColor:
              language === "zh" ? activeButtonHexColor : hoverBorderColor,
            bg: language === "zh" ? buttonHoverBgColor : inactiveHoverBgColor,
            color: language === "zh" ? "white" : hoverTextColor,
          }}
          _active={{
            bg:
              language === "zh"
                ? activeButtonHexColor
                : inactiveActiveBgColor,
          }}
          _dark={{
            borderColor:
              language === "zh" ? darkModeActiveBg : "whiteAlpha.400",
            color: language === "zh" ? "white" : "gray.300",
            bg: language === "zh" ? darkModeActiveBg : "transparent",
            opacity: 1,
          }}>
          {t("chinese")}
        </Button>
      </Stack>
    </Box>
  );
} 