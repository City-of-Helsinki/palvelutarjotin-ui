/* eslint-disable @typescript-eslint/no-require-imports */

import type { SSRConfig } from 'next-i18next';

import { ALL_I18N_NAMESPACES, SUPPORTED_LANGUAGES } from '../constants';

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
const getLocalizationProps = (
  locale: string | undefined
): Pick<SSRConfig, '_nextI18Next'> | undefined => {
  if (!locale) return;

  return {
    _nextI18Next: {
      initialI18nStore: Object.values(SUPPORTED_LANGUAGES).reduce(
        (prev, locale) => ({
          ...prev,
          [locale]: ALL_I18N_NAMESPACES.reduce(
            (prev, namespace) => ({
              ...prev,
              [namespace]: require(
                `../../public/locales/${locale}/${namespace}.json`
              ),
            }),
            {}
          ),
        }),
        {}
      ),
      initialLocale: locale,
      ns: [],
      userConfig: null,
    },
  };
};

export default getLocalizationProps;
