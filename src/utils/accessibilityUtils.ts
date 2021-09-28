/* eslint-disable @typescript-eslint/no-explicit-any */
import { A11yStatusMessageOptions } from 'downshift';
import { TFunction } from 'i18next';

export const getA11yStatusMessage = (
  { isOpen, resultCount, previousResultCount }: A11yStatusMessageOptions<any>,
  t: TFunction
): string => {
  if (!isOpen) {
    return '';
  }

  if (!resultCount) {
    return t('dropdownSelect.accessibility.noResults');
  }

  if (resultCount !== previousResultCount) {
    return t('dropdownSelect.accessibility.statusMessage', {
      count: resultCount,
    });
  }

  return '';
};

export const getA11ySelectionMessage = (
  { selectedItem, itemToString }: A11yStatusMessageOptions<any>,
  t: TFunction
): string => {
  return t('dropdownSelect.accessibility.selectionMessage', {
    value: itemToString(selectedItem),
  });
};
