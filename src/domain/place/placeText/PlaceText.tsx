import React from 'react';

import { usePlaceQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';

interface Props {
  placeId: string;
  errorText?: string;
}

const PlaceText: React.FC<Props> = ({ placeId, errorText = '' }) => {
  const locale = useLocale();
  const { data, loading } = usePlaceQuery({
    variables: { id: placeId },
    skip: !placeId,
  });
  const text = getLocalisedString(data?.place?.name || {}, locale);

  return !loading ? <>{text || errorText}</> : null;
};

export default PlaceText;
