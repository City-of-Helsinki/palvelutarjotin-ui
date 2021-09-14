import { ROUTES } from './constants';

export const getCmsPath = (slug?: string | null): string => {
  return ROUTES.CMS_PAGE.replace('/:slug', slug ?? '');
};
