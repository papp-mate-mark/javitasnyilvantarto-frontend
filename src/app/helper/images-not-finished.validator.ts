import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import ImageWithId from '../model/image-with-id';

/**
 * Validates that all images have a non-null id.
 *
 * If any image has id === null, the control becomes invalid with `{ notFinished: true }`
 * and is marked dirty.
 */
export function imagesNotFinishedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.disabled) return null;

    const value = control.value as ImageWithId[] | null | undefined;
    if (!value || value.length === 0) return null;

    const notFinished = value.some((img) => img?.id === null);
    if (!notFinished) return null;

    // Sets the control as dirty for feedback purposes.
    if (!control.dirty) {
      control.markAsDirty({ onlySelf: true, emitEvent: false });
    }

    return { notFinished: true };
  };
}
