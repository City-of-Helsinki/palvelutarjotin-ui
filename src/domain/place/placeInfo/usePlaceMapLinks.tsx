import { useTranslation } from 'next-i18next';

import { usePlaceQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import {
  generateHslLink,
  generateServiceMapLink,
  getPlaceFields,
} from '../utils';
import { PlaceInfoLinkProps } from './PlaceInfo';
import { PlaceMapLinkEntryProps } from './PlaceMapLink';

function usePlaceMapLinks(props: PlaceInfoLinkProps): PlaceMapLinkEntryProps[] {
  const { id, language } = props;
  const { t } = useTranslation();
  const locale = useLocale();
  const { data } = usePlaceQuery({ variables: { id } });

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
