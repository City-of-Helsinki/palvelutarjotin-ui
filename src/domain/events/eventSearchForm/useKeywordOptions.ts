import capitalize from 'lodash/capitalize';

import {
  Keyword,
  KeywordSet,
  KeywordSetType,
  useKeywordSetQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalizedString from '../../../utils/getLocalisedString';
import { EVENT_TOP_CATEGORIES } from '../constants';

type Option = { label: string; value?: string | null };

export type KeywordOptions = {
  targetGroups: Option[];
  categoryKeywords: Option[];
  additionalCriteriaKeywords: Option[];
};

export const useKeywordOptions = (): KeywordOptions => {
  const locale = useLocale();

  const { data: additionalCriteriaData } = useKeywordSetQuery({
    variables: { setType: KeywordSetType.AdditionalCriteria },
  });
  const { data: categoriesData } = useKeywordSetQuery({
    variables: { setType: KeywordSetType.Category },
    ssr: false,
  });
  const { data: targetGroupsData } = useKeywordSetQuery({
    variables: { setType: KeywordSetType.TargetGroup },
  });

  const keywordSetToOptions = (keywordSet?: KeywordSet | null) =>
    keywordSet?.keywords.map((k: Keyword) => ({
      value: k.id,
      label: capitalize(getLocalizedString(k.name || {}, locale)),
    })) || [];

  const keywordSetToOptionsWithSorting = (keywordSet?: KeywordSet | null) => {
    const topKeywords = keywordSet?.keywords.filter(
      (k) => k.id && EVENT_TOP_CATEGORIES.includes(k.id)
    );
    const keywords = keywordSet?.keywords.filter(
      (k) => k && !topKeywords?.includes(k)
    );
    return (
      topKeywords?.concat(keywords || []).map((k: Keyword) => ({
        value: k.id,
        label: capitalize(getLocalizedString(k.name || {}, locale)),
      })) || []
    );
  };

  const additionalCriteriaKeywords = keywordSetToOptions(
    additionalCriteriaData?.keywordSet
  );
  const categoryKeywords = keywordSetToOptionsWithSorting(
    categoriesData?.keywordSet
  );
  const targetGroups = keywordSetToOptions(targetGroupsData?.keywordSet);

  return { additionalCriteriaKeywords, categoryKeywords, targetGroups };
};
