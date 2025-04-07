'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Text,
  Box,
  useDisclosure,
  Checkbox,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useI18n } from '@/contexts/I18nProvider';
import { usePathname } from 'next/navigation';

// 公告弹窗显示配置接口
interface AnnouncementConfig {
  refreshShowType: 'every' | 'once'; // 每次刷新显示或每天只显示一次
}

export default function Announcement() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t, i18n } = useTranslation();
  const { language, availableLanguages, changeLanguage } = useI18n();
  const [dontShowToday, setDontShowToday] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0); // 默认选择第一个标签
  const pathname = usePathname(); // 获取当前路径
  
  // 直接通过常量配置显示模式，而不是状态
  const ANNOUNCEMENT_CONFIG: AnnouncementConfig = {
    refreshShowType: 'every', // 配置：每次刷新显示
  };

  // 初始化时设置当前语言标签
  useEffect(() => {
    const index = availableLanguages.indexOf(language);
    if (index >= 0) {
      setActiveTabIndex(index);
    }
  }, [language, availableLanguages]);

  // 处理语言切换
  const handleLanguageChange = (index: number) => {
    setActiveTabIndex(index); // 更新当前活动标签
    if (availableLanguages[index]) {
      changeLanguage(availableLanguages[index]);
    }
  };

  // 获取语言显示名称
  const getLanguageName = (lang: string) => {
    switch(lang) {
      case 'en': return 'english';
      case 'ko': return 'korean';
      case 'zh': return 'chinese';
      default: return lang;
    }
  };

  // 在组件挂载时或路径变化时检查是否应该显示公告
  useEffect(() => {
    // 确保只在客户端执行
    if (typeof window === 'undefined') return;

    // 此函数检查是否应该显示公告
    const checkIfShouldShowAnnouncement = () => {
      // 检查是否应该显示公告
      const lastShownDate = localStorage.getItem('announcement-last-shown');
      const today = new Date().toDateString();
      
      // 首先检查是否设置了"今天不再显示"
      if (lastShownDate === today) {
        // 今天已经显示过并设置了不再显示，则不显示公告
        return;
      }

      // 根据配置决定是否显示公告
      if (ANNOUNCEMENT_CONFIG.refreshShowType === 'every' || 
          (ANNOUNCEMENT_CONFIG.refreshShowType === 'once' && lastShownDate !== today)) {
        
        // 延迟打开弹窗
        setTimeout(() => {
          onOpen();
        }, 1000);
        
        // 只有在设置为"每天显示一次"时才自动记录显示日期
        // "每次刷新显示"模式下，只有用户勾选了"今天不再显示"时才记录日期
        if (ANNOUNCEMENT_CONFIG.refreshShowType === 'once') {
          localStorage.setItem('announcement-last-shown', today);
        }
      }
    };

    // 初始检查 - 延迟执行确保页面加载完成
    setTimeout(() => {
      checkIfShouldShowAnnouncement();
    }, 500);

  }, [pathname, onOpen]); // 减少依赖项

  // 关闭公告并处理设置
  const handleClose = () => {
    // 如果选择了"今天不再显示"，更新显示日期
    if (dontShowToday) {
      localStorage.setItem('announcement-last-shown', new Date().toDateString());
    }
    onClose();
  };

  // 获取当前激活的语言
  const getActiveLanguage = () => {
    return availableLanguages[activeTabIndex] || 'en';
  };

  // 渲染公告内容
  const renderAnnouncementContent = (contentLang: string) => {
    // 从翻译文件获取相应语言的公告内容
    const htmlContent = t(`announcement.content.${contentLang}`);
    
    return (
      <Box 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
        className="announcement-content"
        sx={{
          'h2': {
            fontSize: { base: 'xl', md: '2xl' },
            fontWeight: 'bold',
            color: 'brand.primary',
            mb: 2
          },
          'p': {
            fontSize: { base: 'sm', md: 'md' },
            mb: 3
          },
          'ul': {
            pl: 4,
            mb: 3
          },
          'li': {
            fontSize: { base: 'sm', md: 'md' },
            mb: 1
          }
        }}
      />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={{ base: "sm", md: "lg" }} isCentered>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="xl" mx={4} overflow="hidden">
        <ModalHeader 
          fontWeight="bold" 
          fontSize={{ base: "lg", md: "xl" }} 
          textAlign="center" 
          pt={4} pb={2}
          bg="brand.primary"
          color="white"
        >
          {t('announcement.title')}
        </ModalHeader>
        <ModalCloseButton color="white" />
        
        <ModalBody pb={6} px={{ base: 3, md: 4 }} pt={4}>
          <Tabs 
            variant="soft-rounded" 
            colorScheme="purple" 
            isFitted 
            index={activeTabIndex}
            onChange={handleLanguageChange}
          >
            <TabList mb={4}>
              {availableLanguages.map((lang) => (
                <Tab 
                  key={lang}
                  _selected={{ color: 'white', bg: 'brand.primary' }}
                  fontWeight="medium"
                >
                  {t(getLanguageName(lang))}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {availableLanguages.map((lang) => (
                <TabPanel key={lang} p={0}>
                  <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
                    {renderAnnouncementContent(lang)}
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
          
          <Flex mt={5} justify="space-between" align="center">
            <Checkbox 
              colorScheme="purple" 
              isChecked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
            >
              <Text fontSize="sm">{t('announcement.dontShowToday')}</Text>
            </Checkbox>
            
            <Button 
              onClick={handleClose} 
              colorScheme="purple" 
              bg="brand.primary"
              size={{ base: "sm", md: "md" }}
            >
              {t('announcement.close')}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 