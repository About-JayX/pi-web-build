import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhTranslations from './locales/zh';
import enTranslations from './locales/en';
import koTranslations from './locales/ko';

// 配置 i18next
i18n
  // 自动检测浏览器语言
  .use(LanguageDetector)
  // 将 i18next 传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ko: {
        translation: koTranslations
      },
      zh: {
        translation: zhTranslations
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // 不需要转义 React 已处理
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'pi-sale-language',
      caches: ['localStorage']
    },
    react: {
      useSuspense: false // 避免使用 Suspense 导致的 SSR 问题
    }
  });

export default i18n; 