import { SUPPORTED_LANGUAGES } from '../../../constants';

export type PageUriInfo = { uri: string; slug: string; locale: string };

export function isSupportedLanguage(
  value: unknown
): value is SUPPORTED_LANGUAGES {
  return Object.values<string>(SUPPORTED_LANGUAGES).includes(value as string);
}

export type MenuType = 'header' | 'footer';
