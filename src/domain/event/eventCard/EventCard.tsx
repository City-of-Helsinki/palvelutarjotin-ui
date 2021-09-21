/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, IconLocation } from 'hds-react';
import times from 'lodash/times';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

import SkeletonLoader from '../../../common/components/skeletonLoader/SkeletonLoader';
import {
  EventsFieldsFragment,
  useOccurrencesQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import IconClock from '../../../icons/IconClock';
import getLocalisedString from '../../../utils/getLocalisedString';
import PlaceText from '../../place/placeText/PlaceText';
import EventKeywords from '../eventKeywords/EventKeywords';
import { getEventPlaceholderImage, getEventStartTimeStr } from '../utils';
import styles from './eventCard.module.scss';

interface Props {
  event: EventsFieldsFragment;
  link: string;
}

const EventCard: React.FC<Props> = ({ event, link }) => {
  const locale = useLocale();
  const id = event.id;
  const name = getLocalisedString(event.name, locale);
  const shortDescription = getLocalisedString(
    event.shortDescription || {},
    locale
  );
  const image = event.images[0]?.url;

  return (
    <Link href={link}>
      <a
        className={styles.eventCard}
        // TODO: should we use this? maybe not, the screen reader might not read everything
        // aria-label={t('event:eventCard.ariaLabelOpenEvent', {
        //   eventName: name,
        // })}
      >
        <div
          className={styles.imageWrapper}
          style={{
            backgroundImage: `url(${
              image || getEventPlaceholderImage(id || '')
            })`,
          }}
        ></div>
        <div className={styles.contentWrapper}>
          <div className={styles.titleWrapper}>
            <div className={styles.title}>{name}</div>
            <div className={styles.description}>{shortDescription}</div>
          </div>
          <div className={styles.occurrenceInfoWrapper}>
            <EventTime event={event} />
            <EventPlaceInfo event={event} />
          </div>
          <EventKeywords event={event} />
        </div>
      </a>
    </Link>
  );
};

const EventPlaceInfo: React.FC<{
  event: EventsFieldsFragment;
}> = ({ event }) => {
  return (
    <div className={styles.textWithIcon}>
      <IconLocation />
      <PlaceText placeId={event.location?.id || ''} />
    </div>
  );
};

const EventTime: React.FC<{
  event: EventsFieldsFragment;
}> = ({ event }) => {
  const { t } = useTranslation();
  const time = event.pEvent?.nextOccurrenceDatetime
    ? new Date(event.pEvent.nextOccurrenceDatetime)
    : undefined;
  const [showOccurrences, setShowOccurrences] = React.useState(false);

  const toggleShowOccurrences = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent event card opening
    setShowOccurrences((showOccurrences) => !showOccurrences); // Toggle occurrences view
  };
  const nextOccurrenceTime = event.pEvent.nextOccurrenceDatetime;
  const lastOccurrenceTime =
    event.pEvent.lastOccurrenceDatetime ?? nextOccurrenceTime;
  const hasMultipleFutureOccurrences =
    nextOccurrenceTime && nextOccurrenceTime !== lastOccurrenceTime;

  const { data: occurrencesData, loading: loadingOccurrencesData } =
    useOccurrencesQuery({
      skip: !showOccurrences, // Fetch and render occurrences only when expanded
      variables: {
        cancelled: false,
        pEvent: event.pEvent.id,
        orderBy: 'startTime',
      },
    });

  const occurrenceTimes = loadingOccurrencesData
    ? times(3, (key) => (
        <li key={`skeleton-${key}`}>
          <SkeletonLoader />
        </li>
      ))
    : occurrencesData?.occurrences?.edges
        ?.slice(1) // First one is already rendered
        .map((edge) => (
          <OccurrenceTime
            key={`occurrence-${edge?.node?.id}`}
            time={new Date(edge?.node?.startTime)}
          />
        ));

  return (
    <div className={styles.eventTimes}>
      <ul className={styles.occurrenceTimes}>
        <OccurrenceTime time={time} />
        {showOccurrences && occurrenceTimes}
      </ul>
      {hasMultipleFutureOccurrences && (
        <Button
          variant="secondary"
          className={styles.multipleOccurrenceButton}
          onClick={(e) => toggleShowOccurrences(e)}
        >
          {showOccurrences
            ? t('event:eventCard.buttonMultipleOccurrences.opened')
            : t('event:eventCard.buttonMultipleOccurrences.closed')}
        </Button>
      )}
    </div>
  );
};

const OccurrenceTime: React.FC<{
  time: Date | undefined;
}> = ({ time }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  return (
    <li className={styles.textWithIcon}>
      <IconClock />
      {time
        ? getEventStartTimeStr(time, locale, t)
        : t('event:eventCard.noUpcomingOccurrences')}
    </li>
  );
};

export default EventCard;
