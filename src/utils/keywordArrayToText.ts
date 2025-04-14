import getLocalizedString from './getLocalisedString';
import { LocalisedFieldsFragment } from '../generated/graphql';
import { Language } from '../types';

const keywordArrayToText = (
  items: { name?: LocalisedFieldsFragment | null }[] | undefined,
  locale: Language
): string => {
  return (
    items
      ?.map((item) => getLocalizedString(item.name || {}, locale))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join(', ') || '-'
  );
};

export default keywordArrayToText;
