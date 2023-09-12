import { CookieModal } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React, { FC } from 'react';

import { PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';

type SupportedLanguage = 'en' | 'fi' | 'sv';

/* istanbul ignore next */
const hostname =
  typeof window !== 'undefined'
    ? window.location.hostname
    : new URL(process.env.NEXTAUTH_URL as string).hostname;

const CookieConsent: FC = () => {
  const { t } = useTranslation('common');
  const locale = useLocale();

  const { languageOptions, changeLanguage } = useSelectLanguage();

  const onLanguageChange = async (lang: string) => {
    const langOption = languageOptions.find(
      (l) => l.value === (lang as SupportedLanguage)
    );

    if (langOption) {
      changeLanguage(langOption)();
    }
  };

  return (
    <CookieModal
      cookieDomain={hostname}
      contentSource={{
        siteName: t('cookieConsent.siteName') as string,
        currentLanguage: locale,
        requiredCookies: {
          groups: [
            {
              commonGroup: 'login',
              cookies: [{ commonCookie: 'tunnistamo' }],
            },
            {
              commonGroup: 'userInputs',
              cookies: [
                {
                  id: 'signupForm',
                  hostName: hostname,
                  name: t('cookieConsent.signupForm.name') as string,
                  description: t(
                    'cookieConsent.signupForm.description'
                  ) as string,
                  expiration: t('cookieConsent.expiration.session') as string,
                },
              ],
            },
          ],
        },
        optionalCookies: {
          groups: [
            {
              commonGroup: 'statistics',
              cookies: [{ commonCookie: 'matomo' }],
            },
          ],
        },
        language: { onLanguageChange },
        focusTargetSelector: `#${PAGE_HEADER_ID}`,
      }}
    />
  );
};

export default CookieConsent;
