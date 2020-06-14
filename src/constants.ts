export const IS_CLIENT = typeof window !== undefined;

export enum SUPPORTED_LANGUAGES {
  EN = 'en',
  FI = 'fi',
  SV = 'sv',
}

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.FI;

export const COMMON_I18N_NAMESPACES = ['common', 'footer', 'header'];
