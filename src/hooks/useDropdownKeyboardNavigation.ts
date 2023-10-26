import React, { useCallback } from 'react';

import useIsComponentFocused from './useIsComponentFocused';

export interface KeyboardNavigationProps {
  container: React.MutableRefObject<HTMLDivElement | null>;
  disabledIndices?: number[];
  listLength: number;
  initialFocusedIndex?: number;
  onKeyDown?: (event: KeyboardEvent) => void;
}

interface DropdownKeyboardNavigationState {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  setup: () => void;
  teardown: () => void;
}

const useDropdownKeyboardNavigation = ({
  container,
  disabledIndices = [],
  listLength,
  initialFocusedIndex,
  onKeyDown,
}: KeyboardNavigationProps): DropdownKeyboardNavigationState => {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const [isInitialNavigation, setIsInitialNavigation] = React.useState(true);
  const isComponentFocused = useIsComponentFocused(container);

  const getNextIndex = React.useCallback(
    (direction: 'down' | 'up', index: number) => {
      switch (direction) {
        case 'down':
          return index < listLength - 1 ? index + 1 : 0;
        case 'up':
          return index > 0 ? index - 1 : listLength - 1;
      }
    },
    [listLength]
  );

  const focusOption = React.useCallback(
    (direction: 'down' | 'up', index: number) => {
      // Try to find next index only if there are any options to
      // avoid infinite while loop
      /* istanbul ignore next */
      if (listLength - disabledIndices.length <= 0) {
        return;
      }

      let nextIndex = getNextIndex(direction, index);

      while (nextIndex !== index && disabledIndices.includes(nextIndex)) {
        nextIndex = getNextIndex(direction, nextIndex);
      }
      setFocusedIndex(nextIndex);

      setIsInitialNavigation(false);
    },
    [disabledIndices, getNextIndex, listLength]
  );

  const handleArrowKey = useCallback(
    (direction: 'up' | 'down', indexModifier: number = 0) => {
      const targetIndex =
        isInitialNavigation && typeof initialFocusedIndex === 'number'
          ? initialFocusedIndex + indexModifier
          : focusedIndex;

      focusOption(direction, targetIndex);
    },
    [focusOption, focusedIndex, initialFocusedIndex, isInitialNavigation]
  );

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      // Handle keyboard events only if current element is focused
      if (!isComponentFocused()) return;

      onKeyDown?.(event);
      switch (event.key) {
        case 'ArrowUp':
          handleArrowKey('up');
          event.preventDefault();
          break;
        case 'ArrowDown':
          handleArrowKey('down', -1);
          event.preventDefault();
          break;
        case 'Escape':
          setFocusedIndex(-1);
          event.preventDefault();
          break;
      }
    },
    [handleArrowKey, isComponentFocused, onKeyDown]
  );

  const setup = React.useCallback(() => {
    document.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const teardown = React.useCallback(() => {
    document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  React.useEffect(() => {
    setIsInitialNavigation(true);
  }, [initialFocusedIndex]);

  React.useEffect(() => {
    // Whenever the list changes, reset focused index
    setFocusedIndex(-1);
  }, [listLength]);

  return { focusedIndex, setFocusedIndex, setup, teardown };
};

export default useDropdownKeyboardNavigation;
