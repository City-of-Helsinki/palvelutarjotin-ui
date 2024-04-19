const path = require('path');
const packageJson = require('./package.json');

const { i18n } = require('./next-i18next.config');
const trueEnv = ['true', '1', 'yes'];

const NEXTJS_IGNORE_ESLINT = trueEnv.includes(
  process.env?.NEXTJS_IGNORE_ESLINT ?? 'false'
);
const NEXTJS_IGNORE_TYPECHECK = trueEnv.includes(
  process.env?.NEXTJS_IGNORE_TYPECHECK ?? 'false'
);
// const NEXTJS_DISABLE_SENTRY = trueEnv.includes(
//   process.env?.NEXTJS_DISABLE_SENTRY ?? 'false'
// );
// const NEXTJS_SENTRY_UPLOAD_DRY_RUN = trueEnv.includes(
//   process.env?.NEXTJS_SENTRY_UPLOAD_DRY_RUN ?? 'false'
// );
const NEXTJS_SENTRY_DEBUG = trueEnv.includes(
  process.env?.NEXTJS_SENTRY_DEBUG ?? 'false'
);
const NEXTJS_SENTRY_TRACING = trueEnv.includes(
  process.env?.NEXTJS_SENTRY_TRACING ?? 'false'
);
module.exports = {
  reactStrictMode: true,
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
  swcMinify: true,
  // Standalone build
  // @link https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files-experimental
  output: 'standalone',
  experimental: {
    /*    turbotrace: {
        contextDirectory: path.resolve(__dirname, '../..'),
        logDetail: true,
      }, */
    // Prefer loading of ES Modules over CommonJS
    // @link {https://nextjs.org/blog/next-11-1#es-modules-support|Blog 11.1.0}
    // @link {https://github.com/vercel/next.js/discussions/27876|Discussion}
    esmExternals: true,
    // Experimental monorepo support
    // @link {https://github.com/vercel/next.js/pull/22867|Original PR}
    // @link {https://github.com/vercel/next.js/discussions/26420|Discussion}
    externalDir: true,
    scrollRestoration: true,

    // disable in-memory caching
    // @link https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#self-hosting-isr
    isrMemoryCacheSize: 0,
  },
  typescript: {
    /** Do not run TypeScript during production builds (`next build`). */
    ignoreBuildErrors: NEXTJS_IGNORE_TYPECHECK,
    tsconfigPath: 'tsconfig.json',
  },

  eslint: {
    ignoreDuringBuilds: NEXTJS_IGNORE_ESLINT,
    dirs: ['src'],
  },

  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      // @link https://github.com/vercel/next.js/issues/36514#issuecomment-1112074589
      // @link https://stackoverflow.com/a/63074348/784642
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false,
      };
    }

    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/tree-shaking/
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: NEXTJS_SENTRY_DEBUG,
        __SENTRY_TRACING__: NEXTJS_SENTRY_TRACING,
      })
    );

    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      use: [
        {
          loader: '@svgr/webpack',
          // https://react-svgr.com/docs/webpack/#passing-options
          options: {
            svgo: true,
            // @link https://github.com/svg/svgo#configuration
            svgoConfig: {
              multipass: false,
              datauri: 'base64',
              js2svg: {
                indent: 2,
                pretty: false,
              },
            },
          },
        },
      ],
    });
    return config;
  },
};
