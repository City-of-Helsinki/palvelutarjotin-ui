import Head from 'next/head';
import React from 'react';

import {
  EventFieldsFragment,
  LocalisedObject,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';
import { getEventSomeImageUrl } from '../utils';

interface Props {
  event: EventFieldsFragment;
}

const EventPageMeta: React.FC<Props> = ({ event }) => {
  const locale = useLocale();

  const getLocal = (localizedObject: LocalisedObject) =>
    getLocalisedString(localizedObject, locale);

  const name = getLocal(event.name);
  const description = getLocal(event.shortDescription || {});
  const image = getEventSomeImageUrl(event);

  const openGraphProperties: { [key: string]: string } = {
    description: description,
    image: image,
    title: name,
  };

  return (
    <Head>
      <title>{name}</title>
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary" />
      {Object.entries(openGraphProperties).map(([property, value]) => (
        <meta key={property} property={`og:${property}`} content={value} />
      ))}
    </Head>
  );
};

export default EventPageMeta;
