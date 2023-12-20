import getConfig from 'next/config';

const getServerRuntimeConfig = () => {
  const {
    serverRuntimeConfig: {
      env,
      oidcApiTokensUrl,
      oidcClientId,
      oidcClientSecret,
      oidcIssuer,
      oidcLinkedEventsApiScope,
    },
  } = getConfig();

  if (
    !env ||
    !oidcApiTokensUrl ||
    !oidcClientId ||
    !oidcClientSecret ||
    !oidcIssuer ||
    !oidcLinkedEventsApiScope
  ) {
    throw new Error(
      'Invalid configuration. Some required server runtime variable are missing'
    );
  }

  return {
    env,
    oidcApiTokensUrl,
    oidcClientId,
    oidcClientSecret,
    oidcIssuer,
    oidcLinkedEventsApiScope,
  };
};

export default getServerRuntimeConfig;
