import classNames from 'classnames';
import { IconSignout, Navigation } from 'hds-react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { MAIN_CONTENT_ID, PAGE_HEADER_ID } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import useSelectLanguage from '../../../hooks/useSelectLanguage';
import { ExtendedSession } from '../../../types';
import { getUserName } from '../../auth/utils';
import useUser from '../../user/hooks/useUser';
import { ROUTES } from '../routes/constants';

import styles from './header.module.scss';

const Header: React.FC = () => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const linkedEventsApiToken = session?.apiTokens?.linkedevents;
  const { user } = useUser();

  const locale = useLocale();
  const router = useRouter();

  const { changeLanguage, languageOptions } = useSelectLanguage();

  const { t } = useTranslation('common');
  const [menuOpen, setMenuOpen] = React.useState(false);

  const goToHomePage = (e?: Event) => {
    e?.preventDefault();
    router.push(ROUTES.HOME);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    sessionStorage.clear();
  };

  return (
    <Navigation
      id={PAGE_HEADER_ID}
      menuOpen={menuOpen}
      onMenuToggle={toggleMenu}
      menuToggleAriaLabel={t('navigation.menuToggleAriaLabel')}
      skipTo={`#${MAIN_CONTENT_ID}`}
      skipToContentLabel={t('navigation.skipToContentLabel')}
      className={styles.navigation}
      onTitleClick={goToHomePage}
      title={t('appName')}
      titleUrl={`/${locale}${ROUTES.HOME}`}
      logoLanguage={locale === 'sv' ? /* istanbul ignore next */ 'sv' : 'fi'}
    >
      <Navigation.Row></Navigation.Row>

      <Navigation.Actions>
        <Navigation.User
          authenticated={Boolean(linkedEventsApiToken)}
          label={t('common:signIn')}
          onSignIn={() => signIn('tunnistamo')}
          userName={getUserName({ session, user })}
        >
          <Navigation.Item
            label={t('common:signOut')}
            href="#"
            icon={<IconSignout aria-hidden />}
            variant="supplementary"
            onClick={handleSignOut}
          />
        </Navigation.User>
        <Navigation.LanguageSelector
          buttonAriaLabel={t('navigation.languageSelectorAriaLabel') as string}
          className={classNames(styles.languageSelector)}
          label={t(`navigation.languages.${locale}`)}
        >
          {languageOptions.map((option) => (
            <Navigation.Item
              key={option.value}
              href="#"
              lang={option.value}
              label={option.label}
              onClick={changeLanguage(option)}
            />
          ))}
        </Navigation.LanguageSelector>
      </Navigation.Actions>
    </Navigation>
  );
};

export default Header;
