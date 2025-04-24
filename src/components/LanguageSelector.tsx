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
import { useTheme } from '@/contexts/ThemeContext';

// 语言选择器属性接口
interface LanguageSelectorProps {
  /**
   * 是否为移动版布局
   */
  isMobile?: boolean;
  
  /**
   * 移动版关闭侧边栏函数
   */
  onClose?: () => void;
}

/**
 * 语言选择器组件
 * 提供桌面版下拉菜单和移动版按钮组两种布局
 */
export default function LanguageSelector({ isMobile = false, onClose }: LanguageSelectorProps) {
  const { t } = useTranslation();
  const { language, changeLanguage } = useI18n();
  // 使用 ThemeContext 代替直接属性传递
  const { isDarkPage } = useTheme();

  // 将所有 useColorModeValue 调用移到组件顶部，确保无条件调用
  const textColorNormal = useColorModeValue("gray.700", "white");
  const borderColorNormal = useColorModeValue("gray.200", "whiteAlpha.400");
  const bgColorNormal = useColorModeValue("transparent", "transparent");
  const hoverBorderColorNormal = useColorModeValue("gray.300", "whiteAlpha.600");
  const hoverBgColorNormal = useColorModeValue("gray.50", "whiteAlpha.100");
  const activeBgColorNormal = useColorModeValue("gray.100", "whiteAlpha.200");
  
  const menuBgColor = useColorModeValue("white", "gray.800");
  const menuBorderColor = useColorModeValue("gray.200", "gray.700");
  
  const menuItemActiveBg = useColorModeValue("purple.50", "brand.dark");
  const menuItemActiveColor = useColorModeValue("brand.primary", "white");
  const menuItemNormalColor = useColorModeValue("gray.700", "gray.300");
  const menuItemHoverBgActive = useColorModeValue("purple.100", "brand.primary");
  const menuItemHoverBgNormal = useColorModeValue("gray.100", "whiteAlpha.200");
  const menuItemActiveBgActive = useColorModeValue("brand.primary", "white");
  const menuItemActiveBgNormal = useColorModeValue("purple.100", "whiteAlpha.300");
  const menuItemActiveColorActive = useColorModeValue("white", "brand.dark");
  const menuItemActiveColorNormal = useColorModeValue("brand.primary", "white");
  
  const languageLabelColor = useColorModeValue("gray.500", "gray.300");
  const inactiveTextColor = useColorModeValue("gray.700", "gray.300");
  const inactiveBorderColor = useColorModeValue("gray.200", "whiteAlpha.400");
  const inactiveBgColor = useColorModeValue("white", "transparent");
  const hoverBorderColor = useColorModeValue("gray.300", "whiteAlpha.500");
  const inactiveHoverBgColor = useColorModeValue("gray.50", "whiteAlpha.200");
  const hoverTextColor = useColorModeValue("gray.800", "white");
  const inactiveActiveBgColor = useColorModeValue("gray.100", "whiteAlpha.300");
  const buttonHoverBgColor = useColorModeValue("brand.light", "brand.primary");

  // 桌面版语言选择按钮样式
  const languageButtonProps = {
    color: isDarkPage ? "white" : textColorNormal,
    borderWidth: "2px",
    borderColor: isDarkPage ? "whiteAlpha.400" : borderColorNormal,
    bg: isDarkPage ? "transparent" : bgColorNormal,
    _hover: {
      borderColor: isDarkPage ? "whiteAlpha.600" : hoverBorderColorNormal,
      bg: isDarkPage ? "whiteAlpha.200" : hoverBgColorNormal,
    },
    _active: {
      bg: isDarkPage ? "whiteAlpha.300" : activeBgColorNormal,
    },
  };

  // 各语言菜单项样式
  const getLanguageMenuItemProps = (lang: string) => ({
    bg: language === lang ? menuItemActiveBg : undefined,
    color: language === lang ? menuItemActiveColor : menuItemNormalColor,
    _hover: {
      bg: language === lang ? menuItemHoverBgActive : menuItemHoverBgNormal,
    },
    _active: {
      bg: language === lang ? menuItemActiveBgActive : menuItemActiveBgNormal,
      color: language === lang ? menuItemActiveColorActive : menuItemActiveColorNormal,
    },
  });

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
      <Text fontWeight="600" mb={2} color={isDarkPage ? "gray.300" : languageLabelColor} fontSize="sm">
        {t("language")}
      </Text>
      <Stack spacing={2}>
        <Button
          size="sm"
          variant="outline"
          justifyContent="flex-start"
          onClick={() => handleLanguageChange("en")}
          h="36px"
          color={language === "en" ? "white" : isDarkPage ? "gray.200" : inactiveTextColor}
          borderColor={
            language === "en" ? activeButtonHexColor : isDarkPage ? "whiteAlpha.400" : inactiveBorderColor
          }
          borderWidth={language === "en" ? "1px" : "1px"}
          bg={language === "en" ? activeButtonHexColor : isDarkPage ? "transparent" : inactiveBgColor}
          _hover={{
            borderColor:
              language === "en" ? activeButtonHexColor : isDarkPage ? "whiteAlpha.600" : hoverBorderColor,
            bg: language === "en" ? buttonHoverBgColor : isDarkPage ? "whiteAlpha.200" : inactiveHoverBgColor,
            color: language === "en" ? "white" : hoverTextColor,
          }}
          _active={{
            bg:
              language === "en"
                ? activeButtonHexColor
                : isDarkPage ? "whiteAlpha.300" : inactiveActiveBgColor,
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
          color={language === "ko" ? "white" : isDarkPage ? "gray.200" : inactiveTextColor}
          borderColor={
            language === "ko" ? activeButtonHexColor : isDarkPage ? "whiteAlpha.400" : inactiveBorderColor
          }
          borderWidth={language === "ko" ? "1px" : "1px"}
          bg={language === "ko" ? activeButtonHexColor : isDarkPage ? "transparent" : inactiveBgColor}
          _hover={{
            borderColor:
              language === "ko" ? activeButtonHexColor : isDarkPage ? "whiteAlpha.600" : hoverBorderColor,
            bg: language === "ko" ? buttonHoverBgColor : isDarkPage ? "whiteAlpha.200" : inactiveHoverBgColor,
            color: language === "ko" ? "white" : hoverTextColor,
          }}
          _active={{
            bg:
              language === "ko"
                ? activeButtonHexColor
                : isDarkPage ? "whiteAlpha.300" : inactiveActiveBgColor,
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
          color={language === "zh" ? "white" : isDarkPage ? "gray.200" : inactiveTextColor}
          borderColor={
            language === "zh" ? activeButtonHexColor : isDarkPage ? "whiteAlpha.400" : inactiveBorderColor
          }
          borderWidth={language === "zh" ? "1px" : "1px"}
          bg={language === "zh" ? activeButtonHexColor : isDarkPage ? "transparent" : inactiveBgColor}
          _hover={{
            borderColor:
              language === "zh" ? activeButtonHexColor : isDarkPage ? "whiteAlpha.600" : hoverBorderColor,
            bg: language === "zh" ? buttonHoverBgColor : isDarkPage ? "whiteAlpha.200" : inactiveHoverBgColor,
            color: language === "zh" ? "white" : hoverTextColor,
          }}
          _active={{
            bg:
              language === "zh"
                ? activeButtonHexColor
                : isDarkPage ? "whiteAlpha.300" : inactiveActiveBgColor,
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