import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  BoxProps,
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
  TabPanelsProps,
  forwardRef,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

// 组件接口定义
interface StyledTabsProps extends Omit<TabsProps, 'children'> {
  /**
   * Tab项目数组，每项包含标签和内容
   */
  tabItems: Array<{
    /**
     * Tab的标签，可以是字符串或React节点
     */
    label: string | ReactNode;
    /**
     * Tab的内容，为React节点
     */
    content: ReactNode;
  }>;
  /**
   * TabList组件的额外属性
   */
  listProps?: TabListProps;
  /**
   * Tab组件的额外属性
   */
  tabProps?: TabProps;
  /**
   * TabPanels组件的额外属性
   */
  panelsProps?: TabPanelsProps;
  /**
   * TabPanel组件的额外属性
   */
  panelProps?: TabPanelProps;
}

/**
 * StyledTabs - 自定义样式的Tabs组件
 * 
 * 一个具有统一UI风格的Tab组件，特点：
 * - 左对齐布局
 * - 平滑的选中状态动画
 * - 响应式设计，移动端优化
 * - 下划线风格的选中指示器
 * - 无边框设计，现代简约风格
 * 
 * @example
 * ```tsx
 * <StyledTabs
 *   index={activeTab}
 *   onChange={setActiveTab}
 *   tabItems={[
 *     { label: "第一个Tab", content: <div>第一个Tab的内容</div> },
 *     { label: "第二个Tab", content: <div>第二个Tab的内容</div> }
 *   ]}
 * />
 * ```
 */
const StyledTabs = forwardRef<StyledTabsProps, 'div'>((props, ref) => {
  const {
    tabItems,
    listProps,
    tabProps,
    panelsProps,
    panelProps,
    ...restProps
  } = props;

  // 自定义Tab样式，强制移除边框
  const tabStyleProps: TabProps = {
    _focus: { boxShadow: "none !important", border: "none !important", outline: "none !important" },
    _active: { boxShadow: "none !important", border: "none !important", outline: "none !important" },
    _hover: { boxShadow: "none !important", border: "none !important", outline: "none !important" },
    _selected: { boxShadow: "none !important", border: "none !important", outline: "none !important" },
    border: "none !important",
    boxShadow: "none !important",
    outline: "none !important",
    transition: "none",
    ...tabProps,
  };

  return (
    <Tabs
      colorScheme="purple"
      variant="unstyled"
      isLazy={false}
      position="relative"
      ref={ref}
      {...restProps}
    >
      <TabList
        mb={{ base: 2, md: 4 }}
        overflow="hidden"
        overflowX="auto"
        width="100%"
        display="flex"
        flexWrap="nowrap"
        position="relative"
        borderBottomWidth="2px"
        borderBottomColor="gray.200"
        justifyContent="flex-start"
        pb="1px"
        maxW={{ base: "100%", md: "fit-content" }}
        borderRadius="8px 8px 0 0"
        boxShadow="0 -2px 10px rgba(0,0,0,0.02)"
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          bg: "gray.200",
          zIndex: 0
        }}
        sx={{
          "&::-webkit-scrollbar": {
            display: { base: "none", md: "auto" }
          },
          "scrollbarWidth": { base: "none", md: "auto" },
          "& > button": {
            flex: { base: "0 0 auto", md: "0 0 auto" },
            fontWeight: "medium",
            fontSize: { base: "xs", md: "sm" },
            p: { base: "8px 12px", md: "10px 16px" },
            minWidth: { base: "auto", md: "auto" },
            maxWidth: { base: "auto", md: "fit-content" },
            whiteSpace: "nowrap",
            flexShrink: 0,
            borderRadius: { base: "4px 4px 0 0", md: "6px 6px 0 0" },
            border: "none !important",
            outline: "none !important",
            mr: { base: 3, md: 5 },
            ml: 0,
            position: "relative",
            color: "gray.700",
            zIndex: 1,
            
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: "-2px",
              left: 0, 
              right: 0,
              height: "0px",
              bg: "brand.primary",
              opacity: 0,
              transition: "all 0.2s ease-in-out",
              borderRadius: "3px 3px 0 0"
            },
            
            "&[aria-selected=true]": {
              color: "brand.primary !important",
              fontWeight: "bold !important",
              border: "none !important",
              boxShadow: "none !important",
              outline: "none !important",
              background: "rgba(128, 90, 213, 0.08) !important",
              "&::before": {
                height: "3px !important",
                opacity: "1 !important"
              }
            },
            
            "&:hover": {
              color: "brand.primary",
              textDecoration: "none",
              background: "rgba(128, 90, 213, 0.06)",
              transition: "all 0.2s ease",
              transform: "translateY(-1px)",
              fontWeight: "semibold",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              "&::before": {
                height: "2px",
                opacity: "0.7"
              }
            },
            
            "&:active": {
              background: "rgba(128, 90, 213, 0.12)",
              transform: "translateY(0)",
            },
            
            "transition": "all 0.2s ease",
            
            "&:last-of-type": {
              mr: 0
            }
          }
        }}
        {...listProps}
      >
        {tabItems.map((item, index) => (
          <Tab key={index} {...tabStyleProps}>
            {item.label}
          </Tab>
        ))}
      </TabList>

      <TabPanels {...panelsProps}>
        {tabItems.map((item, index) => (
          <TabPanel key={index} px={0} pt={2} {...panelProps}>
            {item.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
});

export default StyledTabs; 