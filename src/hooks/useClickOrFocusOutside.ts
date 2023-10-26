import React, { useCallback } from 'react';

export interface UseClickOrFocusOutsideProps {
  container: React.MutableRefObject<HTMLDivElement | null>;
  onClickOrFocusOutside: () => void;
}

interface UseClickOrFocusOutsideState {
  setup: () => void;
  teardown: () => void;
}

const useClickOrFocusOutside = ({
  container,
  onClickOrFocusOutside,
}: UseClickOrFocusOutsideProps): UseClickOrFocusOutsideState => {
  const onDocumentClickOrFocusin = useCallback(
    (event: FocusEvent | MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node && container.current?.contains(target))) {
        onClickOrFocusOutside();
      }
    },
    [container, onClickOrFocusOutside]
  );

  const setup = React.useCallback(() => {
    document.addEventListener('click', onDocumentClickOrFocusin);
    document.addEventListener('focusin', onDocumentClickOrFocusin);
  }, [onDocumentClickOrFocusin]);

  const teardown = React.useCallback(() => {
    document.removeEventListener('click', onDocumentClickOrFocusin);
    document.removeEventListener('focusin', onDocumentClickOrFocusin);
  }, [onDocumentClickOrFocusin]);

  return { setup, teardown };
};

export default useClickOrFocusOutside;
