import { Button, Select, IconArrowDown } from 'hds-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { ReactElement } from 'react';

import styles from './eventList.module.scss';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { EventsFieldsFragment } from '../../../generated/graphql';
import { addParamsToQueryString } from '../../../utils/queryString';
import { translateValue } from '../../../utils/translateUtils';
import { ROUTES } from '../../app/routes/constants';
import EventCard from '../../event/eventCard/EventCard';
import { EVENT_SORT_OPTIONS } from '../constants';

interface Props {
  events: EventsFieldsFragment[];
  fetchMore?: () => void;
  isLoading: boolean;
  shouldShowLoadMore?: boolean;
  eventsCount?: number | null;
  sort?: EVENT_SORT_OPTIONS;
  title?: string;
  showCount?: boolean;
  setSort?: (val: EVENT_SORT_OPTIONS) => void;
}

const EventList = ({
  events,
  fetchMore,
  isLoading,
  shouldShowLoadMore,
  sort,
  eventsCount = 0,
  setSort,
  title,
  showCount = true,
}: Props): ReactElement => {
  const { asPath } = useRouter();

  const [pathname, search] = asPath.split('?');
  const queryString = addParamsToQueryString(search, {
    returnPath: pathname,
  });

  const { t } = useTranslation();
  const sortOptions = React.useMemo(() => {
    return Object.keys(EVENT_SORT_OPTIONS).map((key) => {
      return {
        label: translateValue('events:sortOptions.', key, t),
        value: (EVENT_SORT_OPTIONS as Record<string, EVENT_SORT_OPTIONS>)[key],
      };
    });
  }, [t]);
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const handleSort = (option: { [key: string]: any }) => {
    setSort?.(option.value);
  };

  return (
    <div className={styles.eventList}>
      <div className={styles.headingRow}>
        <h2>
          {title ?? t('events:eventList.title')}{' '}
          {showCount && (
            <span className={styles.count}>
              {t('events:eventList.count', { count: eventsCount || 0 })}
            </span>
          )}
        </h2>
        {sort && (
          <div className={styles.sortSelectorWrapper}>
            <Select
              className={styles.orderDropdown}
              label={t('events:eventList.labelSort')}
              onChange={handleSort}
              options={sortOptions}
              value={
                sortOptions.find((option) => option.value === sort) || {
                  label: '',
                  value: '',
                }
              }
            />
          </div>
        )}
      </div>
      <div className={styles.eventCardsContainer}>
        {events.map((event, index) => {
          const eventUrl = `${ROUTES.EVENT_DETAILS.replace(
            ':id',
            event.id
          )}${queryString}`;
          return <EventCard key={index} event={event} link={eventUrl} />;
        })}
      </div>
      {shouldShowLoadMore && (
        <LoadingSpinner isLoading={isLoading ?? false}>
          <div className={styles.loadMoreButtonWrapper}>
            <Button
              onClick={fetchMore}
              variant="supplementary"
              iconLeft={<IconArrowDown />}
            >
              {t('events:eventList.buttonLoadMore')}
            </Button>
          </div>
        </LoadingSpinner>
      )}
    </div>
  );
};

export default EventList;
