import { ROUTES } from '../domain/app/routes/constants';

export const getCmsPath = (slug?: string | null) => {
  return ROUTES.CMS_PAGE.replace('/:uri', slug ?? '');
};
