import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';

import { SIGNUP_QUERY_PARAMS } from '../../../signup/constants';
import Header from '../../header/Header';
import styles from './pageLayout.module.scss';

const PageLayout: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const {
    query: { [SIGNUP_QUERY_PARAMS.IFRAME]: iframe },
  } = useRouter();
  const isIframe = iframe === 'true';

  return (
    <div
      className={classNames(styles.pageLayout, {
        [styles.pageLayoutWithoutHeader]: isIframe,
      })}
    >
      {!isIframe && <Header />}
      <div className={styles.pageBody}>{children}</div>
    </div>
  );
};

export default PageLayout;
