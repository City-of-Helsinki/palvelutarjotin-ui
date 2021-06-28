/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const intervalPlural = require('i18next-intervalplural-postprocessor');

module.exports = {
  i18n: {
    defaultLocale: 'fi',
    locales: ['fi', 'en', 'sv', 'cimode'],
    use: [intervalPlural],
    serializeConfig: false,
  },
};
