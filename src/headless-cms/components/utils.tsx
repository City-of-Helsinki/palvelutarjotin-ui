import React from 'react';
import { Card, Collection, CollectionType } from 'react-helsinki-headless-cms';

import HtmlToReact from '../../common/components/htmlToReact/HtmlToReact';
import { getCollectionItemUrl } from '../../domain/app/routes/utils';

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
            customContent={
              <HtmlToReact>{(item.lead || item.content) ?? ''}</HtmlToReact>
            }
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
