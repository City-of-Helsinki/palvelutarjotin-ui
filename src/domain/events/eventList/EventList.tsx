import { Button, Dropdown } from 'hds-react';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { EventsQuery } from '../../../generated/graphql';
import { translateValue } from '../../../utils/translateUtils';
import EventCard from '../../event/eventCard/EventCard';
import { EVENT_SORT_OPTIONS } from '../constants';
import styles from './eventList.module.scss';

interface Props {
  eventsData: EventsQuery;
  fetchMore: () => void;
  isLoading: boolean;
  shouldShowLoadMore: boolean;
  sort: EVENT_SORT_OPTIONS;
  setSort: (val: EVENT_SORT_OPTIONS) => void;
}

const EventList = ({
  eventsData,
  fetchMore,
  isLoading,
  shouldShowLoadMore,
  sort,
  setSort,
}: Props): ReactElement => {
  const { t } = useTranslation();
  const sortOptions = React.useMemo(() => {
    return Object.keys(EVENT_SORT_OPTIONS).map((key) => {
      return {
        label: translateValue('events:sortOptions.', key, t),
        value: (EVENT_SORT_OPTIONS as Record<string, EVENT_SORT_OPTIONS>)[key],
      };
    });
  }, [t]);

  const events = eventsData.events?.data || [];
  const count = eventsData.events?.meta.count || 0;

  const handleSort = (option: { [key: string]: any }) => {
    setSort(option.value);
  };

  return (
    <div className={styles.eventList}>
      <div className={styles.headingRow}>
        <h2>
          {t('events:eventList.title')}{' '}
          <span className={styles.count}>
            {t('events:eventList.count', { count })}
          </span>
        </h2>
        <div className={styles.sortSelectorWrapper}>
          <span>{t('events:eventList.labelSort')}</span>
          <Dropdown
            className={styles.orderDropdown}
            hideLabel={true}
            label={t('events:eventList.labelSort')}
            onChange={handleSort}
            options={sortOptions}
            selectedOption={sortOptions.find((option) => option.value === sort)}
          />
        </div>
      </div>
      <div className={styles.eventCardsContainer}>
        {events.map((event, index) => {
          return (
            <EventCard
              key={index}
              event={event}
              onClick={(id: string) => {
                alert('TODO: OPEN EVENT DETAILS PAGE');
              }}
            />
          );
        })}
      </div>
      {shouldShowLoadMore && (
        <LoadingSpinner isLoading={isLoading}>
          <div className={styles.loadMoreButtonWrapper}>
            <Button onClick={fetchMore} variant="supplementary">
              {t('events:eventList.buttonLoadMore')}
            </Button>
          </div>
        </LoadingSpinner>
      )}
    </div>
  );
};

export default EventList;
