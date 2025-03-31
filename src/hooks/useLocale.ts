import { useTranslation } from 'next-i18next';

import type { I18nNamespace, Language } from '../types';

const useLocale = (): Language => {
  const { i18n } = useTranslation<I18nNamespace>();
  const language = i18n.language;

  switch (language) {
    case 'en':
    case 'fi':
    case 'sv':
      return language;
    default:
      return 'fi';
  }
};

export default useLocale;
