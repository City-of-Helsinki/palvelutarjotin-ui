import { CollectionItemType } from 'react-helsinki-headless-cms';

import { ROUTES } from './constants';

export const getCmsPagePath = (uri?: string | null): string => {
  return ROUTES.CMS_PAGE.replace('/:uri', uri ?? '');
};

export const getCmsArticlePath = (uri?: string | null): string => {
  return ROUTES.CMS_ARTICLE.replace('/:uri', uri ?? '');
};

export const getCollectionItemUrl = (item: CollectionItemType): string => {
  if (!item) {
    return '#';
  }
  if (item.__typename === 'Post') {
    return getCmsArticlePath(item.uri);
  }
  if (item.__typename === 'Page') {
    return getCmsPagePath(item.uri);
  }
  return item?.uri ?? '';
};
