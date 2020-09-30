const withSass = require('@zeit/next-sass');
const withTM = require('next-transpile-modules')(['hds-react']);

module.exports = withTM(
  withSass({
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: '[local]___[hash:base64:5]',
    },
  })
);
