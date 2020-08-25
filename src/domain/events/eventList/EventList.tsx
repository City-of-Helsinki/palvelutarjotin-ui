import { Button, Dropdown } from 'hds-react';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import { EventFieldsFragment } from '../../../generated/graphql';
import { Router } from '../../../i18n';
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
  sort: EVENT_SORT_OPTIONS;
  setSort: (val: EVENT_SORT_OPTIONS) => void;
}

const EventList = ({
  events,
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

  const count = events.length || 0;

  const handleSort = (option: { [key: string]: any }) => {
    setSort(option.value);
  };

  const goToEventDetailsPage = (id: string) => {
    Router.push(ROUTES.EVENT_DETAILS.replace(':id', id));
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
              onClick={goToEventDetailsPage}
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
