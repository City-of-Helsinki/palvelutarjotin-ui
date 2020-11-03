import { IconSignout } from 'hds-react';
import React from 'react';

import TextTitle from '../../../common/components/textTitle/TextTitle';
import { useVenueQuery } from '../../../generated/graphql';
import { useTranslation } from '../../../i18n';
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
  const {
    hasClothingStorage,
    hasSnackEatingPlace,
    outdoorActivity,
  } = getVenueFields(venueData?.venue);

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
        {outdoorActivity && (
          <div>
            <IconSignout />
            {t('event:location.outdoorActivity')}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueInfo;
