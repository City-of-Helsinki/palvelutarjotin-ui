import { Button, IconLocation } from 'hds-react';
import times from 'lodash/times';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './eventCard.module.scss';
import { getEventEnrolmentStatus, getOccurrenceDateStr } from './utils';
import KeywordsList from '../../../common/components/keyword/KeywordsList';
import SkeletonLoader from '../../../common/components/skeletonLoader/SkeletonLoader';
import {
  EventsFieldsFragment,
  useOccurrencesQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import IconClock from '../../../icons/IconClock';
import type { I18nNamespace } from '../../../types';
import getLocalisedString from '../../../utils/getLocalisedString';
import { SCROLL_RESTORATION_ELEMENT_ID_PREFIX } from '../../events/constants';
import PlaceText from '../../place/placeText/PlaceText';
import { getEventPlaceholderImage } from '../utils';

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
  const keywords = [...event.keywords, ...event.audience];
  const enrolmentStatus = getEventEnrolmentStatus(event);
  const { t } = useTranslation();
  const elementId = `${SCROLL_RESTORATION_ELEMENT_ID_PREFIX}${id}`;
  return (
    <div className={styles.eventCard}>
      <div
        id={elementId}
        className={styles.imageWrapper}
        style={{
          backgroundImage: `url(${
            image || getEventPlaceholderImage(id || '')
          })`,
        }}
      ></div>
      <div className={styles.contentWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>
            <NextLink
              href={link}
              scroll
              className={styles.primaryAction}
              aria-label={t('event:eventCard.ariaLabelOpenEvent', {
                eventName: name,
              })}
            >
              {name}
            </NextLink>
          </div>
          <div className={styles.description}>{shortDescription}</div>
        </div>
        <div className={styles.occurrenceInfoWrapper}>
          <EventTime event={event} />
          <EventPlaceInfo event={event} />
        </div>
        <div className={styles.keywordsList}>
          <KeywordsList
            keywords={keywords}
            enrolmentStatus={enrolmentStatus}
            identifier={event.id}
          />
        </div>
      </div>
    </div>
  );
};

const EventPlaceInfo: React.FC<{
  event: EventsFieldsFragment;
}> = ({ event }) => {
  const { t } = useTranslation<I18nNamespace>('event');
  return (
    <div
      className={styles.textWithIcon}
      aria-label={t('eventCard.placeInfo.ariaLabel')}
    >
      <IconLocation aria-hidden="true" />
      <PlaceText placeId={event.location?.id || ''} />
    </div>
  );
};

const EventTime: React.FC<{
  event: EventsFieldsFragment;
}> = ({ event }) => {
  const { t } = useTranslation<I18nNamespace>();
  const [showOccurrences, setShowOccurrences] = React.useState(false);

  const toggleShowOccurrences = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault(); // Prevent event card opening
    setShowOccurrences((showOccurrences) => !showOccurrences); // Toggle occurrences view
  };
  const nextOccurrence = event.pEvent.nextOccurrence?.edges[0]?.node;
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
        upcoming: true,
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
        .map((edge) =>
          edge?.node ? (
            <li key={`occurrence-${edge?.node?.id}`}>
              <OccurrenceTime occurrence={edge?.node} />
            </li>
          ) : null
        );

  return (
    <div
      className={styles.eventTimes}
      aria-label={t('event:eventCard.occurrenceTimes.ariaLabel')}
    >
      <ul
        className={styles.occurrenceTimes}
        aria-labelledby={`${event.id}-toggle-occurrences-btn`}
      >
        {nextOccurrence ? (
          <li>
            <OccurrenceTime occurrence={nextOccurrence} />
          </li>
        ) : (
          t('event:eventCard.noUpcomingOccurrences')
        )}
        {showOccurrences && occurrenceTimes}
      </ul>
      {hasMultipleFutureOccurrences && (
        <Button
          variant="secondary"
          id={`${event.id}-toggle-occurrences-btn`}
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
  occurrence: { startTime: string; endTime: string };
}> = ({ occurrence }) => {
  const { t } = useTranslation<I18nNamespace>();
  const locale = useLocale();
  return (
    <div className={styles.textWithIcon}>
      <IconClock aria-hidden="true" />
      {getOccurrenceDateStr(occurrence, locale, t)}
    </div>
  );
};

export default EventCard;
