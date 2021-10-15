import React from 'react';

import Header from '../../header/Header';
import styles from './pageLayout.module.scss';

const PageLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.pageLayout}>
      <Header />
      <div className={styles.pageBody}>{children}</div>
    </div>
  );
};

export default PageLayout;
