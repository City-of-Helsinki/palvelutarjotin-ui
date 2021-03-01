import { LocalisedFieldsFragment } from '../generated/graphql';
import { Language } from '../types';
import getLocalizedString from './getLocalisedString';

const keywordArrayToText = (
  items: { name?: LocalisedFieldsFragment | null }[] | undefined,
  locale: Language
): string => {
  return (
    items
      ?.map((item) => getLocalizedString(item.name || {}, locale))
      .filter(Boolean)
      .sort()
      .join(', ') || '-'
  );
};

export default keywordArrayToText;
