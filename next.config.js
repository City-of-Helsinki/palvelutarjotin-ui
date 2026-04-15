const path = require('path');

const { withSentryConfig } = require('@sentry/nextjs');

const { i18n } = require('./next-i18next.config');
const packageJson = require('./package.json');

const trueEnv = ['true', '1', 'yes'];

const NEXTJS_IGNORE_TYPECHECK = trueEnv.includes(
  process.env?.NEXTJS_IGNORE_TYPECHECK ?? 'false'
);
// const NEXTJS_DISABLE_SENTRY = trueEnv.includes(
//   process.env?.NEXTJS_DISABLE_SENTRY ?? 'false'
// );
// const NEXTJS_SENTRY_UPLOAD_DRY_RUN = trueEnv.includes(
//   process.env?.NEXTJS_SENTRY_UPLOAD_DRY_RUN ?? 'false'
// );
// const NEXTJS_SENTRY_DEBUG = trueEnv.includes(
//   process.env?.NEXTJS_SENTRY_DEBUG ?? 'false'
// );
// const NEXTJS_SENTRY_TRACING = trueEnv.includes(
//   process.env?.NEXTJS_SENTRY_TRACING ?? 'false'
// );

const NEXT_PUBLIC_CSP_REPORT_URI =
  process.env?.NEXT_PUBLIC_CSP_REPORT_URI ?? '';

const reportingEndpointsHeader = `csp-endpoint=${NEXT_PUBLIC_CSP_REPORT_URI}`;
const cspHeader = `
    default-src 'self';
    script-src 'self' ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : '' // Allow eval in development, for react-refresh
    } https://m.youtube.com https://www.youtube.com https://webanalytics.digiaiiris.com *.google.com *.gstatic.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: *.hel.fi *.hel.ninja *.ytimg.com *.youtube.com *.vimeo.com *.vimeocdn.com 
      *.blob.core.windows.net *.hkih.hion.dev;
    font-src 'self' *.hel.fi *.hel.ninja;
    connect-src 'self' localhost:* 127.0.0.1:* *.hel.fi *.hel.ninja *.hkih.hion.dev *.digiaiiris.com *.google.com *.gstatic.com;
    object-src 'none';
    media-src 'self' *.hel.fi *.hel.ninja *.hkih.hion.dev;
    manifest-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' *.hel.fi *.hel.ninja *.youtube.com www.youtube-nocookie.com *.vimeo.com *.google.com;
    frame-ancestors 'none';
    worker-src    'self';
    report-uri ${NEXT_PUBLIC_CSP_REPORT_URI};
    report-to csp-endpoint
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

module.exports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 1000 * 60 * 2, // 2 minutes
  productionBrowserSourceMaps: true,
  i18n,
  sassOptions: {
    loadPaths: [path.join(__dirname, 'src/assets/styles')],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'hkih.production.geniem.io' },
      { protocol: 'https', hostname: 'kultus.content.api.hel.fi' },
      { protocol: 'https', hostname: 'hkih.stage.geniem' },
      { protocol: 'https', hostname: 'kultus.hkih.stage.geniem.io' },
      { protocol: 'https', hostname: 'app-staging.hkih.hion.dev' },
      { protocol: 'https', hostname: 'kultus.app-staging.hkih.hion.dev' },
    ],
  },
  env: {
    APP_NAME: packageJson.name,
    APP_VERSION: packageJson.version,
    BUILD_TIME: new Date().toISOString(),
  },
  // Standalone build
  // @link https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files-experimental
  output: 'standalone',
  experimental: {
    /*    turbotrace: {
        contextDirectory: path.resolve(__dirname, '../..'),
        logDetail: true,
      }, */
    // Experimental monorepo support
    // @link {https://github.com/vercel/next.js/pull/22867|Original PR}
    // @link {https://github.com/vercel/next.js/discussions/26420|Discussion}
    externalDir: true,
  },
  // disable in-memory caching
  // @link https://nextjs.org/docs/14/pages/building-your-application/deploying#configuring-caching
  cacheMaxMemorySize: 0,
  typescript: {
    /** Do not run TypeScript during production builds (`next build`). */
    ignoreBuildErrors: NEXTJS_IGNORE_TYPECHECK,
    tsconfigPath: 'tsconfig.json',
  },

  // Turbopack equivalents for key webpack customizations.
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '~*': '*',
    },
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: true,
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
        as: '*.js',
      },
    },
  },

  // Provide CSP headers to all routes for enhanced security.
  // Using middleware could be more flexible and allow the use of per request nonce, but
  // it's hard to get to work with ISR, because it would require all the scripts and styles
  // to be reloaded per request to get a new nonce. Using this config is simpler, easier to understand and maintain.
  // @link https://nextjs.org/docs/14/pages/building-your-application/configuring/content-security-policy#without-nonces
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Reporting-Endpoints',
            value: reportingEndpointsHeader.replace(/\n/g, ''),
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};

// Injected content via Sentry wizard below

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  reactComponentAnnotation: {
    enabled: true,
  },

  // Disable sourcemap uploading to Sentry
  sourcemaps: {
    disable: true,
  },
});
