import React from 'react';

import { usePlaceQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';

interface Props {
  placeId: string;
}

const PlaceText: React.FC<Props> = ({ placeId }) => {
  const locale = useLocale();
  const { data } = usePlaceQuery({
    variables: { id: placeId },
  });
  console.log(placeId);

  return <>{getLocalisedString(data?.place?.name || {}, locale)}</>;
};

export default PlaceText;
