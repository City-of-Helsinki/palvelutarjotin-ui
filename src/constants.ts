export const IS_CLIENT = typeof window !== 'undefined';

export enum SUPPORTED_LANGUAGES {
  FI = 'fi',
  SV = 'sv',
  EN = 'en',
}

export enum EVENT_LANGUAGES {
  AR = 'ar',
  EN = 'en',
  FI = 'fi',
  RU = 'ru',
  SV = 'sv',
  ZH_HANS = 'zh_hans',
}

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.FI;

export const COMMON_I18N_NAMESPACES = ['common', 'footer', 'header'];
