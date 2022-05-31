import { ROUTES } from './constants';

export const getCmsPagePath = (uri?: string | null): string => {
  return ROUTES.CMS_PAGE.replace('/:uri', uri ?? '');
};

export const getCmsArticlePath = (uri?: string | null): string => {
  return ROUTES.CMS_ARTICLE.replace('/:uri', uri ?? '');
};
