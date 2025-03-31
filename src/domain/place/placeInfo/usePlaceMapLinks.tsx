import { useTranslation } from 'next-i18next';

import { PlaceInfoLinkProps } from './PlaceInfo';
import { PlaceMapLinkEntryProps } from './PlaceMapLink';
import { usePlaceQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import type { I18nNamespace } from '../../../types';
import {
  generateHslLink,
  generateServiceMapLink,
  getPlaceFields,
} from '../utils';

function usePlaceMapLinks(props: PlaceInfoLinkProps): PlaceMapLinkEntryProps[] {
  const { id, language } = props;
  const { t } = useTranslation<I18nNamespace>();
  const locale = useLocale();
  const { data } = usePlaceQuery({ variables: { id }, skip: !id });

  if (!data) return [];

  const { streetAddress, addressLocality } = getPlaceFields(
    data?.place,
    locale
  );

  const serviceMapLink = generateServiceMapLink(id, language);
  const hslLink = generateHslLink(streetAddress, addressLocality, language);

  return [
    {
      id: 'service-map-link',
      label: t('form:placeInfo.labelServicemap'),
      description: t('form:placeInfo.descriptionServicemap'),
      url: serviceMapLink,
    },
    {
      id: 'hsl-link',
      label: t('form:placeInfo.labelReittiopas'),
      url: hslLink,
    },
  ];
}

export default usePlaceMapLinks;
