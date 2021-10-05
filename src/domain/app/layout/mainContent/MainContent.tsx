import { useRouter } from 'next/router';
import React from 'react';
import { scroller } from 'react-scroll';

import { MAIN_CONTENT_ID } from '../../../../constants';

interface Props {
  className?: string;
  duration?: number;
  // This is mainly for testing purposes to test that the scroll function is called properly
  onScrollFn?: () => void;
  offset?: number;
}

const MainContent: React.FC<Props> = ({
  children,
  className,
  duration = 100,
  offset = -130,
  onScrollFn,
}) => {
  const { asPath } = useRouter();
  const mainContent = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (asPath.includes(`#${MAIN_CONTENT_ID}`)) {
      const scrollToContent = () => {
        if (onScrollFn) {
          onScrollFn();
        } else {
          scroller.scrollTo(MAIN_CONTENT_ID, {
            delay: 0,
            duration: duration,
            offset: offset,
            smooth: true,
          });
        }
      };

      const setFocusToFirstFocusable = () => {
        const focusable = mainContent.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable?.[0]) {
          (focusable[0] as HTMLElement).focus();
        }
      };

      scrollToContent();
      setTimeout(() => setFocusToFirstFocusable(), duration);
    }
  }, [duration, asPath, offset, onScrollFn]);

  return (
    <main className={className} id={MAIN_CONTENT_ID} ref={mainContent}>
      {children}
    </main>
  );
};

export default MainContent;
