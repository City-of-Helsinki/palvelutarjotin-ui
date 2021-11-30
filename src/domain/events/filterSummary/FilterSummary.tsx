import { useRouter } from 'next/router';
import React from 'react';

import { EventSearchFormValues } from '../eventSearchForm/EventSearchForm';
import { useKeywordOptions } from '../eventSearchForm/useKeywordOptions';
import FilterButton, { FilterType } from './filterButton/FilterButton';
import KeywordFilterButton from './filterButton/KeywordFilterButton';
import styles from './filterSummary.module.scss';

export const filterSummaryContainerTestId = 'filter-summary';

interface Props {
  filters: EventSearchFormValues;
}

const FilterSummary: React.FC<Props> = ({ filters }) => {
  const router = useRouter();
  const categories = filters.categories;
  const organisation = filters.organisation;
  const { categoryKeywords } = useKeywordOptions();

  const keywordsNotInCategories = categories.filter(
    (category) =>
      !categoryKeywords.find(
        (categoryKeyword) => categoryKeyword.value === category
      )
  );

  const handleFilterRemove = (value: string, type: FilterType) => {
    const query = { ...router.query };
    const searchParam = query[type];

    if (Array.isArray(searchParam)) {
      query[type] = searchParam.filter((v) => v !== value);
    } else {
      delete query[type];
    }

    router.push(
      {
        pathname: window.location.pathname,
        query,
      },
      undefined,
      { scroll: false }
    );
  };

  const hasFilters = !!organisation || !!keywordsNotInCategories.length;

  return hasFilters ? (
    <div
      className={styles.filterSummary}
      data-testid={filterSummaryContainerTestId}
    >
      {organisation && (
        <FilterButton
          key={organisation}
          onRemove={handleFilterRemove}
          text={organisation}
          type="organisation"
          value={organisation}
        />
      )}
      {keywordsNotInCategories.map((categoryId) => (
        <KeywordFilterButton
          key={categoryId}
          onRemove={handleFilterRemove}
          type="categories"
          value={categoryId}
        />
      ))}
    </div>
  ) : null;
};

export default FilterSummary;
