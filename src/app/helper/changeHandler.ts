import { WritableSignal } from '@angular/core';

/**
 * Creates a change handler that updates the provided signal with the given value and key.
 * 
 * @param filter The writable signal to update. This should contain the whole search parameter object.
 * @param onChange The function to call after updating the signal. Tipically used for emitting or fetching.
 * @returns The change handler function that can be used in form controls.
 */
export const createChangeHandler = <T>(filter: WritableSignal<T>, onChange: () => void) => {
  return (value: string | number | null | undefined, key: keyof T) => {
    const normalized =
      value === null || value === undefined || value === ''
        ? undefined
        : (value as string | number);
    filter.set({
      ...filter(),
      [key]: normalized,
    } as T);
    onChange();
  };
};
