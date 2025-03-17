import type { MenuType } from './types';
import {
  DEFAULT_FOOTER_MENU_NAME,
  DEFAULT_HEADER_MENU_NAME,
  SUPPORTED_LANGUAGES,
} from '../../../constants';

export const DEFAULT_MENU_NAME: Record<
  MenuType,
  Record<SUPPORTED_LANGUAGES, string>
> = {
  header: DEFAULT_HEADER_MENU_NAME,
  footer: DEFAULT_FOOTER_MENU_NAME,
};

export const ARTICLES_AMOUNT_LIMIT = 100;
export const PAGES_AMOUNT_LIMIT = 100;
