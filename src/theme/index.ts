// Pi.Sale主题配置
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Pi.Sale 主题配置 - 紫金色调
const colors = {
  brand: {
    primary: "#5235E8", // 主紫色
    primaryGradient: "linear-gradient(0deg, #FFF 0%, #EFEDFD 46.09%)", // 主紫色渐变
    footer: {
      primary: "#252525",
      secondary: "#333",
      text: "#ccc",
    }, // 底部
    secondary: "#E6B325", // 金色
    light: "#D6D1FA", // 亮紫色
    dark: "#5A189A", // 深紫色
    background: "#FFFFFF",
    cardBg: "#FFFFFF",
    text: {
      primary: "#2D3748",
      secondary: "#718096",
      light: "#0E0637",
    },
  },
  // 状态颜色
  status: {
    success: "#38A169",
    warning: "#DD6B20",
    error: "#E53E3E",
    info: "#3182CE",
  },
  gold: {
    50: "#fff9e5",
    100: "#ffedb8",
    200: "#ffe18a",
    300: "#ffd45c",
    400: "#ffc72e",
    500: "#e6ad14", // 金色主色
    600: "#b38a10",
    700: "#81630b",
    800: "#503c05",
    900: "#211800",
  },
  gray: {
    50: "#F9F9FA",
  },
};

// 组件样式覆盖
const components = {
  Button: {
    baseStyle: {
      fontWeight: "bold",
      borderRadius: "md",
    },
    variants: {
      primary: {
        bg: "brand.primary",
        color: "white",
        _hover: {
          bg: "brand.light",
        },
      },
      secondary: {
        bg: "brand.secondary",
        color: "white",
        _hover: {
          bg: "yellow.400",
        },
      },
      outline: {
        bg: "#FFF",
        borderColor: "#D6D1FA",
        color: "brand.primary",
        _hover: {
          bg: "#D6D1FA",
          color: "brand.primary",
        },
      },
    },
    defaultProps: {
      variant: "solid", // 设置默认变体
    },
  },
  Card: {
    baseStyle: {
      container: {
        p: "6",
        rounded: "lg",
        bg: "brand.cardBg",
        boxShadow: "md",
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: "bold",
    },
  },
  Text: {
    baseStyle: {
      color: "brand.text.primary",
    },
  },
  Table: {
    baseStyle: {
      bg: "transparent",
    },
  },
};

// 字体设置
const fonts = {
  body: "Inter, system-ui, sans-serif",
  heading: "Inter, system-ui, sans-serif",
};

const styles = {
  global: {
    body: {
      bg: "brand.background",
      color: "brand.text.primary",
    },
  },
};

// 配置主题 - 禁用系统颜色模式以避免SSR不匹配
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false, // 关闭系统颜色模式，避免服务端和客户端渲染不一致
  cssVarPrefix: "pi-sale", // 添加自定义CSS变量前缀
  disableTransitionOnChange: false, // 禁用颜色模式切换时的过渡效果
};

const theme = extendTheme({
  colors,
  components,
  fonts,
  styles,
  config,
});

export default theme;
