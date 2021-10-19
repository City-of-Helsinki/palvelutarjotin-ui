import sortBy from 'lodash/sortBy';

import {
  AdministrativeDivisionsQuery,
  useAdministrativeDivisionsQuery,
} from '../generated/graphql-unified-search';
import { useUnifiedSearchApolloClient } from '../unified-search/unifiedSearchApolloClient';
import getTranslation from '../unified-search/utils';
import useLocale from './useLocale';

type AdministrativeDivisions =
  AdministrativeDivisionsQuery['administrativeDivisions'];

export const DIVISION_BLOCKLIST = [
  'ocd-division/country:fi/kunta:helsinki/kaupunginosa:ultuna',
];

type DivisionOption = {
  text: string;
  value: string;
};

const useDivisionOptions = (): DivisionOption[] => {
  const locale = useLocale();
  const unifiedSearchClient = useUnifiedSearchApolloClient();
  const { data: divisionsData } = useAdministrativeDivisionsQuery({
    client: unifiedSearchClient,
  });
  const filteredDivisionList = getFilteredDivisionList(
    divisionsData?.administrativeDivisions
  );
  const divisionsOptionList = filteredDivisionList?.map(
    (neighborhood): DivisionOption => ({
      text: getTranslation(neighborhood?.name, locale) ?? '',
      value: neighborhood?.id ?? '',
    })
  );
  return sortBy(divisionsOptionList, 'text');
};

export const getFilteredDivisionList = (
  data?: AdministrativeDivisions
): AdministrativeDivisions => {
  return (
    data?.filter((option) => !DIVISION_BLOCKLIST.includes(option?.id ?? '')) ??
    []
  );
};

export default useDivisionOptions;
