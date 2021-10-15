import { LanguageString } from '../generated/graphql-unified-search';
import { Language } from '../types';

export default function getTranslation(
  translation: Partial<LanguageString> | undefined | null,
  locale: Language
): string | undefined | null {
  return translation?.[locale] ?? translation?.fi ?? '';
}
