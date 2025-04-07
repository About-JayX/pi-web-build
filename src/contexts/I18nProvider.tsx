'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '@/config/locales';
import '../config/i18n'; // 导入 i18n 配置

// 定义语言上下文类型
type Language = typeof availableLanguages[number];

interface I18nContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  availableLanguages: readonly Language[];
}

// 创建上下文
const I18nContext = createContext<I18nContextType | null>(null);

// 使用上下文的钩子
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n 必须在 I18nProvider 内使用');
  }
  return context;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  
  // 更新 HTML lang 属性
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  // 语言切换函数
  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  return (
    <I18nContext.Provider 
      value={{ 
        language: (i18n.language as Language) || 'en', 
        changeLanguage,
        availableLanguages
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}; 