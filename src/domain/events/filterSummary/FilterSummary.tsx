import { useRouter } from 'next/router';
import React from 'react';

import { EventSearchFormValues } from '../eventSearchForm/EventSearchForm';
import FilterButton from './filterButton/FilterButton';
import styles from './filterSummary.module.scss';

export const filterSummaryContainerTestId = 'filter-summary';

interface Props {
  filters: EventSearchFormValues;
}

const FilterSummary: React.FC<Props> = ({ filters }) => {
  const router = useRouter();

  const organization = filters?.organisation || '';

  const handleFilterRemove = () => {
    //note params value: string, type: FilterType are not in use
    //might be implemented to add more filters of different types
    const params = new URLSearchParams(window.location.search);
    params.delete('organization');
    router.push(
      `${router.pathname}${params.values.length > 0 ? '?' : ''}${params}`
    );
  };

  const hasFilters = !!organization;

  if (!hasFilters) return null;

  return (
    <div
      className={styles.filterSummary}
      data-testid={filterSummaryContainerTestId}
    >
      <FilterButton
        key={organization}
        onRemove={handleFilterRemove}
        text={organization}
        type="organisation"
        value={organization}
      />
    </div>
  );
};
export default FilterSummary;
