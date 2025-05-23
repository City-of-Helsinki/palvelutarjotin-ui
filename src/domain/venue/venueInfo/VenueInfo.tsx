import { IconGroup, IconSignout } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './venueInfo.module.scss';
import TextTitle from '../../../common/components/textTitle/TextTitle';
import { useVenueQuery } from '../../../generated/graphql';
import IconFood from '../../../icons/IconFood';
import IconGarderobe from '../../../icons/IconGarderobe';
import IconPlayIndoor from '../../../icons/IconPlayIndoor';
import IconPlayOutdoor from '../../../icons/IconPlayOutdoor';
import IconToilet from '../../../icons/IconToilet';
import type { I18nNamespace, Language } from '../../../types';
import { getVenueDescription, getVenueFields } from '../utils';

interface Props {
  language: Language;
  placeId: string;
}

const VenueInfo: React.FC<Props> = ({ language, placeId }) => {
  const { t } = useTranslation<I18nNamespace>();
  const { data: venueData } = useVenueQuery({ variables: { id: placeId } });
  const venueDescription = getVenueDescription(venueData, language);
  const {
    hasClothingStorage,
    hasSnackEatingPlace,
    outdoorActivity,
    hasToiletNearby,
    hasAreaForGroupWork,
    hasIndoorPlayingArea,
    hasOutdoorPlayingArea,
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
            {t('event:location.labelHasSnackEatingPlace')}
          </div>
        )}
        {hasClothingStorage && (
          <div>
            <IconGarderobe />
            {t('event:location.labelHasClothingStorage')}
          </div>
        )}
        {outdoorActivity && (
          <div>
            <IconSignout />
            {t('event:location.labelOutdoorActivity')}
          </div>
        )}
        {hasToiletNearby && (
          <div>
            <IconToilet />
            {t('event:location.labelHasToiletNearby')}
          </div>
        )}
        {hasAreaForGroupWork && (
          <div>
            <IconGroup />
            {t('event:location.labelHasAreaForGroupWork')}
          </div>
        )}
        {hasIndoorPlayingArea && (
          <div>
            <IconPlayIndoor />
            {t('event:location.labelHasIndoorPlayingArea')}
          </div>
        )}
        {hasOutdoorPlayingArea && (
          <div>
            <IconPlayOutdoor />
            {t('event:location.labelHasOutdoorPlayingArea')}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueInfo;
