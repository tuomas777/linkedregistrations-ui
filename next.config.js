/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const { i18n } = require('./next-i18next.config');

const moduleExports = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['src/styles'],
  },
  sentry: {
    hideSourceMaps: true,
  },
  publicRuntimeConfig: {
    linkedEventsApiBaseUrl: process.env.NEXT_PUBLIC_LINKED_EVENTS_URL,
  },
  serverRuntimeConfig: {
    env: process.env.NEXT_ENV,
    oidcApiTokensUrl: process.env.OIDC_API_TOKENS_URL,
    oidcClientId: process.env.OIDC_CLIENT_ID,
    oidcClientSecret: process.env.OIDC_CLIENT_SECRET,
    oidcIssuer: process.env.OIDC_ISSUER,
    oidcLinkedEventsApiScope: process.env.OIDC_LINKED_EVENTS_API_SCOPE,
    oidcTokenUrl: process.env.OIDC_TOKEN_URL,
  },
  output: 'standalone',
};

const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  url: process.env.SENTRY_URL,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
});
