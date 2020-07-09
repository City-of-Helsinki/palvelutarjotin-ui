import React from 'react';
import { useTranslation } from 'react-i18next';

import TextTitle from '../../../common/components/textTitle/TextTitle';
import { useVenueQuery } from '../../../generated/graphql';
import IconFood from '../../../icons/IconFood';
import IconGarderobe from '../../../icons/IconGarderobe';
import { Language } from '../../../types';
import { getVenueDescription, getVenueFields } from '../utils';
import styles from './venueInfo.module.scss';

interface Props {
  language: Language;
  placeId: string;
}

const VenueInfo: React.FC<Props> = ({ language, placeId }) => {
  const { t } = useTranslation();
  const { data: venueData } = useVenueQuery({ variables: { id: placeId } });
  const venueDescription = getVenueDescription(venueData, language);
  const { hasClothingStorage, hasSnackEatingPlace } = getVenueFields(
    venueData?.venue
  );

  return (
    <div className={styles.venueInfo}>
      {venueDescription && (
        <div className={styles.venueDescription}>
          <TextTitle>{t('event:location.labelLocationDescription')}</TextTitle>
          <p>{venueDescription}</p>
        </div>
      )}
      <div className={styles.venueAmenities}>
        {hasSnackEatingPlace && (
          <div>
            <IconFood />
            {t('event:location.snackEatingPlace')}
          </div>
        )}
        {hasClothingStorage && (
          <div>
            <IconGarderobe />
            {t('event:location.clothingStorage')}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueInfo;
