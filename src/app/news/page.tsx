'use client';

import { useState } from 'react';
import {
  Container,
  Heading,
  Text,
  Box,
  VStack,
  Divider,
  Badge,
  Flex,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface AnnouncementData {
  id: string;
  date: string;
  type: 'update' | 'feature' | 'maintenance';
  titleKey: string;
  contentKey: string;
}

interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  type: 'update' | 'feature' | 'maintenance';
}

export default function NewsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('all');
  
  // 从翻译文件中加载公告数据
  const getAnnouncements = (): Announcement[] => {
    try {
      // 从翻译文件中获取公告数据数组
      const announcementDataString = t('data');
      const announcementDataArray: AnnouncementData[] = JSON.parse(announcementDataString);
      
      // 转换为包含实际标题和内容的公告对象
      return announcementDataArray.map(data => ({
        id: data.id,
        date: data.date,
        title: t(data.titleKey),
        content: t(data.contentKey),
        type: data.type
      }));
    } catch (error) {
      console.error('Error parsing announcement data:', error);
      return [];
    }
  };
  
  const announcements = getAnnouncements();
  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter);
  
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'green';
      case 'update':
        return 'blue';
      case 'maintenance':
        return 'orange';
      default:
        return 'gray';
    }
  };
  
  const getBadgeText = (type: string) => {
    switch (type) {
      case 'feature':
        return t('filter.feature');
      case 'update':
        return t('filter.update');
      case 'maintenance':
        return t('filter.maintenance');
      default:
        return type;
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" mb={6} textAlign="center">
        {t('title')}
      </Heading>
      
      <Flex justifyContent="flex-end" mb={4}>
        <Select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          w="200px"
        >
          <option value="all">{t('filter.all')}</option>
          <option value="feature">{t('filter.feature')}</option>
          <option value="update">{t('filter.update')}</option>
          <option value="maintenance">{t('filter.maintenance')}</option>
        </Select>
      </Flex>
      
      <VStack spacing={6} align="stretch">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <Box 
              key={announcement.id} 
              p={5} 
              borderWidth="1px" 
              borderRadius="lg" 
              bg={bgColor}
              borderColor={borderColor}
              boxShadow="sm"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="md">{announcement.title}</Heading>
                <Badge colorScheme={getBadgeColor(announcement.type)} px={2} py={1} borderRadius="md">
                  {getBadgeText(announcement.type)}
                </Badge>
              </Flex>
              
              <Text color="gray.500" fontSize="sm" mb={3}>
                {new Date(announcement.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              
              <Divider my={3} />
              
              <Text whiteSpace="pre-wrap">
                {announcement.content}
              </Text>
            </Box>
          ))
        ) : (
          <Box 
            p={5} 
            borderWidth="1px" 
            borderRadius="lg"
            textAlign="center"
          >
            <Text>{t('noData')}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
} 