import React from 'react';
import {
  Card,
  Collection,
  CollectionItemType,
  CollectionType,
  getElementTextContent,
} from 'react-helsinki-headless-cms';

import {
  getCmsArticlePath,
  getCmsPagePath,
} from '../../domain/app/routes/utils';

export function getCmsCollectionList(
  collections: CollectionType[]
): React.ReactElement<typeof Collection>[] {
  return collections.map((collection) => (
    <Collection
      key={`collection-${Math.random()}`}
      title={collection.title}
      collectionContainerProps={{
        withDots: collection.items.length < 4 ? false : true,
      }}
      type="grid"
      cards={collection.items.map((item) =>
        item ? (
          <Card
            key={item.id}
            {...item}
            title={item.title ?? ''}
            text={getElementTextContent((item.lead || item.content) ?? '')}
            clampText={true}
            withShadow={true}
            hasLink={true}
            url={getCollectionItemUrl(item)}
            imageLabel={item.featuredImage?.node?.title ?? ''}
            imageUrl={item.featuredImage?.node?.mediaItemUrl ?? ''}
          />
        ) : (
          <></>
        )
      )}
    />
  ));
}

export function getCollectionItemUrl(item: CollectionItemType): string {
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
