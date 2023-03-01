import capitalize from 'lodash/capitalize';
import * as React from 'react';

import FilterButton, { FilterButtonProps } from './FilterButton';
import { useKeywordQuery } from '../../../../generated/graphql';
import useLocale from '../../../../hooks/useLocale';
import localizedString from '../../../../utils/getLocalisedString';

const KeywordFilterButton: React.FC<Omit<FilterButtonProps, 'text'>> = ({
  value,
  ...props
}) => {
  const locale = useLocale();
  const { data } = useKeywordQuery({
    variables: {
      id: value,
    },
  });
  const keyword = data?.keyword?.name;

  return keyword ? (
    <FilterButton
      {...props}
      text={capitalize(localizedString(keyword, locale))}
      value={value}
    />
  ) : null;
};

export default KeywordFilterButton;
