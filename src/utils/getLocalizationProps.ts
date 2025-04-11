import type { SSRConfig } from 'next-i18next';

import { ALL_I18N_NAMESPACES, SUPPORTED_LANGUAGES } from '../constants';

type TranslationValue = string | { [key: string]: TranslationValue };

/*
 * This function is used to provide next-i18next HOC with translations
 * Normally getServerSideProps with serverSideTranslations would be used but
 * that doesn't work well for us (it causes apollo HOC to also do requests on server with each page navigation).
 * https://github.com/isaachinman/next-i18next#serversidetranslations
 *
 * NextJS docs say:
 * "However, if getInitialProps is used in a custom _app.js, and the page being navigated to implements
 * getServerSideProps, then getInitialProps will run on the server."
 * https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
 *
 * We include all namespaces every time to make sure that all of them are loaded to memory.
 * appWithTranslation HOC won't load new namespaces to memory after it has initialized i18n object.
 */
const getLocalizationProps = async (
  locale: string | undefined
): Promise<Pick<SSRConfig, '_nextI18Next'> | undefined> => {
  if (!locale) return;

  const initialI18nStore: Record<string, Record<string, TranslationValue>> = {};

  // Load all translations for all languages in parallel
  await Promise.all(
    Object.values(SUPPORTED_LANGUAGES).flatMap((language) => {
      initialI18nStore[language] = {};
      return ALL_I18N_NAMESPACES.map(async (namespace) => {
        const translationModule = await import(
          `../../public/locales/${language}/${namespace}.json`
        );
        initialI18nStore[language][namespace] = translationModule.default;
      });
    })
  );

  return {
    _nextI18Next: {
      initialI18nStore,
      initialLocale: locale,
      ns: [],
      userConfig: null,
    },
  };
};

export default getLocalizationProps;
