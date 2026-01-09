import {
  ArticleType,
  Card,
  Collection,
  GeneralCollectionType,
  getCollectionCards,
  PageType,
} from '@city-of-helsinki/react-helsinki-headless-cms';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { getCmsArticlePath, getCmsPagePath } from '../../app/routes/utils';

export function getCmsCollectionList(
  collections: GeneralCollectionType[]
): React.ReactElement<typeof Collection>[] {
  return collections.map((collection) => (
    <Collection
      key={`collection-${uuidv4()}`}
      title={collection.title}
      collectionContainerProps={{
        withDots: collection.items.length < 4 ? false : true,
      }}
      type="grid"
      cards={getCollectionCards(collection as GeneralCollectionType, []).map(
        (item) => (
          <Card
            key={`card-${item.id}`}
            {...item}
            clampText={true}
            withShadow={true}
            hasLink={true}
            url={getCollectionItemUrl(item as PageType)}
            // imageLabel={item.featuredImage?.node?.title ?? ''}
            // imageUrl={item.featuredImage?.node?.mediaItemUrl ?? ''}
          />
        )
      )}
    />
  ));
}

export function getCollectionItemUrl(item?: PageType | ArticleType): string {
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
}
