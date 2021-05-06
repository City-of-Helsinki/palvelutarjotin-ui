const { nextI18NextRewrites } = require('next-i18next/rewrites');

const localeSubpaths = {
  fi: 'fi',
  en: 'en',
  sv: 'sv',
  cimode: 'cimode'
};

module.exports = {
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
};
