const path = require('path');
const packageJson = require('./package.json');

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
      'kultus.hkih.stage.geniem.io',
    ],
  },
  env: {
    APP_NAME: packageJson.name,
    APP_VERSION: packageJson.version,
    BUILD_TIME: new Date().toISOString(),
  },
};
