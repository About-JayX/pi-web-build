import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  /**
   * 是否显示加载中的文本
   * @default true
   */
  showText?: boolean;
  
  /**
   * 自定义显示的文本翻译键，默认使用 tabSwitchLoading
   * @default 'tabSwitchLoading'
   */
  textKey?: string;
  
  /**
   * 自定义文本颜色
   * @default 'gray.500'
   */
  textColor?: string;
  
  /**
   * 自定义文本字体大小
   * @default 'md'
   */
  textSize?: string;
  
  /**
   * 自定义spinner的大小
   * @default 'xl'
   */
  spinnerSize?: string;
  
  /**
   * 自定义spinner的颜色
   * @default 'brand.primary'
   */
  spinnerColor?: string;
  
  /**
   * 自定义空白区域的颜色
   * @default 'gray.200'
   */
  emptyColor?: string;
  
  /**
   * 自定义spinner的厚度
   * @default '4px'
   */
  thickness?: string;
  
  /**
   * 自定义spinner的转速
   * @default '0.65s'
   */
  speed?: string;
  
  /**
   * 自定义上下内边距
   * @default '10'
   */
  py?: number | string;
}

/**
 * 通用加载动画组件
 * 用于显示统一风格的加载动画，默认样式基于铸造页面标签切换时的加载动画
 */
const LoadingSpinner = ({
  showText = true,
  textKey = 'tabSwitchLoading',
  textColor = 'gray.500',
  textSize = 'md',
  spinnerSize = 'xl',
  spinnerColor = 'brand.primary',
  emptyColor = 'gray.200',
  thickness = '4px',
  speed = '0.65s',
  py = 10
}: LoadingSpinnerProps) => {
  const { t } = useTranslation();

  return (
    <Box py={py} textAlign="center">
      <VStack spacing={4}>
        <Spinner 
          thickness={thickness}
          speed={speed}
          emptyColor={emptyColor}
          color={spinnerColor}
          size={spinnerSize}
        />
        {showText && (
          <Text color={textColor} fontSize={textSize}>
            {t(textKey)}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default LoadingSpinner; 