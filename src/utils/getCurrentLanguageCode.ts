import { LanguageCodeEnum } from '@city-of-helsinki/react-helsinki-headless-cms';

import type { Language } from '../types';

const appLanguageToLanguageCode: Record<Language, LanguageCodeEnum> = {
  en: LanguageCodeEnum.En,
  fi: LanguageCodeEnum.Fi,
  sv: LanguageCodeEnum.Sv,
} as const;

export default function getLanguageCode(language: Language) {
  return appLanguageToLanguageCode[language];
}
