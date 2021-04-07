import capitalize from 'lodash/capitalize';

import {
  Keyword,
  KeywordSet,
  KeywordSetType,
  useKeywordSetQuery,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import getLocalizedString from '../../../utils/getLocalisedString';

type Option = { label: string; value?: string | null };

type KeyWordOptions = {
  targetGroups: Option[];
  categoryKeywords: Option[];
  additionalCriteriaKeywords: Option[];
};

export const useKeywordOptions = (): KeyWordOptions => {
  const locale = useLocale();

  const { data: additionalCriteriaData } = useKeywordSetQuery({
    variables: { setType: KeywordSetType.AdditionalCriteria },
  });
  const { data: categoriesData } = useKeywordSetQuery({
    variables: { setType: KeywordSetType.Category },
  });
  const { data: targetGroupsData } = useKeywordSetQuery({
    variables: { setType: KeywordSetType.TargetGroup },
  });

  const keywordSetToOptions = (keywordSet?: KeywordSet | null) =>
    keywordSet?.keywords.map((k: Keyword) => ({
      value: k.id,
      label: capitalize(getLocalizedString(k.name || {}, locale)),
    })) || [];

  const additionalCriteriaKeywords = keywordSetToOptions(
    additionalCriteriaData?.keywordSet
  );
  const categoryKeywords = keywordSetToOptions(categoriesData?.keywordSet);
  const targetGroups = keywordSetToOptions(targetGroupsData?.keywordSet);

  return { additionalCriteriaKeywords, categoryKeywords, targetGroups };
};
