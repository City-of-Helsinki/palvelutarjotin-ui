const path = require('path');

const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/assets/styles')],
  },
  images: {
    domains: [
      'hkih.production.geniem.io',
      'kultus.content.api.hel.fi',
      'hkih.stage.geniem',
    ],
  },
};
