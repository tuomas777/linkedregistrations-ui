import React from 'react';

import styles from './pageLayout.module.scss';

const PageLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.pageLayout}>
      <div className={styles.pageBody}>{children}</div>
    </div>
  );
};

export default PageLayout;
