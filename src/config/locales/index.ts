import en from './en';
import ko from './ko';
import zh from './zh';
// 可用语言列表
export const availableLanguages = ['en','ko','zh'] as const;
export type Language = typeof availableLanguages[number];

// 翻译记录
export const translations: Record<Language, Record<string, string>> = {
  en,
  ko,
  zh
};

export default translations; 