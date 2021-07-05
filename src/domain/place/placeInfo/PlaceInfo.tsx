import { useTranslation } from 'next-i18next';
import React from 'react';

import { usePlaceQuery } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import VenueInfo from '../../venue/venueInfo/VenueInfo';
import { getPlaceFields } from '../utils';
import styles from './placeInfo.module.scss';
import PlaceMapLink from './PlaceMapLink';
import usePlaceMapLinks from './usePlaceMapLinks';

interface PlaceInfoProps {
  id: string;
  language: Language;
  onEditButtonClick?: (show: boolean) => void;
  showEditButton?: boolean;
  showVenueInfo?: boolean;
  showPlaceInfoLinks?: boolean;
}
export interface PlaceInfoLinkProps {
  id: string;
  language: Language;
  variant?: 'a' | 'button';
}

const PlaceInfo: React.FC<PlaceInfoProps> = ({
  id,
  language,
  onEditButtonClick,
  showEditButton,
  showVenueInfo,
  showPlaceInfoLinks,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data } = usePlaceQuery({ variables: { id } });

  if (!data) return null;

  const { name, streetAddress, telephone } = getPlaceFields(
    data?.place,
    locale
  );

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
      {showPlaceInfoLinks && (
        <div className={styles.placeInfo}>
          <div className={styles.linkRows}>
            <PlaceInfoLinks id={id} language={language} />
          </div>
        </div>
      )}
      {showVenueInfo && <VenueInfo language={language} placeId={id} />}
    </div>
  );
};

const PlaceInfoLinks: React.FC<PlaceInfoLinkProps> = ({
  id,
  language,
  variant = 'a',
}) => {
  const mapLinks = usePlaceMapLinks({ id, language });

  return (
    <div className={styles.placeInfo}>
      {mapLinks.map((link) => (
        <PlaceMapLink key={link.id} {...link} variant={variant} />
      ))}
    </div>
  );
};

export default PlaceInfo;
export { PlaceInfoLinks };
