import { IconLocation } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EventFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import IconClock from '../../../icons/IconClock';
import getLocalisedString from '../../../utils/getLocalisedString';
import PlaceText from '../../place/placeText/PlaceText';
import { getEventPlaceholderImage, getEventStartTimeStr } from '../utils';
import styles from './eventCard.module.scss';

interface Props {
  event: EventFieldsFragment;
  onClick?: (id: string) => void;
}

const EventCard: React.FC<Props> = ({ event, onClick }) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const id = event.id;
  const name = getLocalisedString(event.name, locale);
  const description = getLocalisedString(event.description, locale);
  const time = getEventStartTimeStr(event, locale, t);

  const handleClick = () => {
    if (onClick) {
      onClick(event.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div
      role="button"
      className={styles.eventCard}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={t('events.eventCard.ariaLabelOpenOccurrences', {
        eventName: name,
      })}
    >
      <div
        className={styles.imageWrapper}
        style={{
          backgroundImage: `url(${getEventPlaceholderImage(id)})`,
        }}
      ></div>
      <div className={styles.contentWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{name}</div>
          <div className={styles.description}>{description}</div>
        </div>
        <div className={styles.occurrenceInfoWrapper}>
          <div className={styles.textWithIcon}>
            <IconClock />
            {time}
          </div>
          <div className={styles.textWithIcon}>
            <IconLocation />
            <PlaceText placeId={event.location.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
