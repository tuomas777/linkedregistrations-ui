/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['src/styles'],
  },
};
