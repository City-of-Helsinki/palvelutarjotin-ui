import React from 'react';

import { usePlaceQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import { Language } from '../../../types';
import VenueInfo from '../../venue/venueInfo/VenueInfo';
import {
  generateHslLink,
  generateServiceMapLink,
  getPlaceFields,
} from '../utils';
import styles from './placeInfo.module.scss';

interface Props {
  id: string;
  language: Language;
  onEditButtonClick?: (show: boolean) => void;
  showEditButton?: boolean;
  showVenueInfo?: boolean;
}

const PlaceInfo: React.FC<Props> = ({
  id,
  language,
  onEditButtonClick,
  showEditButton,
  showVenueInfo,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data } = usePlaceQuery({ variables: { id } });

  if (!data) return null;

  const { name, streetAddress, telephone, addressLocality } = getPlaceFields(
    data?.place,
    locale
  );

  const serviceMapLink = generateServiceMapLink(id, language);
  const hslLink = generateHslLink(streetAddress, addressLocality, language);

  const handleEditButtonClick = () => {
    if (onEditButtonClick) {
      onEditButtonClick(true);
    }
  };

  return (
    <div className={styles.placeInfo}>
      {name && (
        <div>
          {name}{' '}
          {showEditButton && (
            <button
              className={styles.buttonChange}
              onClick={handleEditButtonClick}
              type="button"
            >
              {t('form:placeInfo.buttonEdit')}
            </button>
          )}
        </div>
      )}
      {streetAddress && <p>{streetAddress}</p>}
      {telephone && <p>{telephone}</p>}
      <div className={styles.linkRows}>
        <div className={styles.linkRow}>
          <div className={styles.linkTitle}>
            {t('form:placeInfo.labelServicemap')}
          </div>
          <a href={serviceMapLink} rel="noopener noreferrer" target="_blank">
            {serviceMapLink}
          </a>
        </div>
        <div className={styles.linkRow}>
          <div className={styles.linkTitle}>
            {t('form:placeInfo.labelReittiopas')}
          </div>
          <a href={hslLink} rel="noopener noreferrer" target="_blank">
            {hslLink}
          </a>
        </div>
      </div>
      {showVenueInfo && <VenueInfo language={language} placeId={id} />}
    </div>
  );
};

export default PlaceInfo;
