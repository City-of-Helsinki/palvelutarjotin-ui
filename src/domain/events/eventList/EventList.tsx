import { Button, Dropdown, IconArrowDown } from 'hds-react';
import React, { ReactElement } from 'react';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { EventFieldsFragment } from '../../../generated/graphql';
import { useTranslation } from '../../../i18n';
import { translateValue } from '../../../utils/translateUtils';
import { ROUTES } from '../../app/routes/constants';
import EventCard from '../../event/eventCard/EventCard';
import { EVENT_SORT_OPTIONS } from '../constants';
import styles from './eventList.module.scss';

interface Props {
  events: EventFieldsFragment[];
  fetchMore: () => void;
  isLoading: boolean;
  shouldShowLoadMore: boolean;
  eventsCount?: number | null;
  sort: EVENT_SORT_OPTIONS;
  setSort: (val: EVENT_SORT_OPTIONS) => void;
}

const EventList = ({
  events,
  fetchMore,
  isLoading,
  shouldShowLoadMore,
  sort,
  eventsCount = 0,
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

  const handleSort = (option: { [key: string]: any }) => {
    setSort(option.value);
  };

  return (
    <div className={styles.eventList}>
      <div className={styles.headingRow}>
        <h2>
          {t('events:eventList.title')}{' '}
          <span className={styles.count}>
            {t('events:eventList.count', { count: eventsCount || 0 })}
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
              link={ROUTES.EVENT_DETAILS.replace(':id', event.id)}
            />
          );
        })}
      </div>
      {shouldShowLoadMore && (
        <LoadingSpinner isLoading={isLoading}>
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
