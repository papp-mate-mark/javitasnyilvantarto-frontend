import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

/**
 * Updates validity for all descendants and marks invalid controls as dirty.
 * Useful before showing validation feedback on submit.
 */
export function updateAndMarkInvalidDirty(control: AbstractControl, onlyValErrors = false): void {
  // Recurse into children first so their status is up to date.
  if (control instanceof FormGroup) {
    Object.values(control.controls).forEach((child) =>
      updateAndMarkInvalidDirty(child, onlyValErrors)
    );
  } else if (control instanceof FormArray) {
    control.controls.forEach((child) => updateAndMarkInvalidDirty(child, onlyValErrors));
  }

  control.updateValueAndValidity({ emitEvent: false }); // Updates the status

  if (
    control.invalid &&
    (!onlyValErrors || (control.errors && control.errors['validationMessages']))
  ) {
    control.markAsDirty({ onlySelf: true, emitEvent: true });
    control.markAsTouched({ onlySelf: true, emitEvent: true });
  }

  control.updateValueAndValidity({ emitEvent: true }); // Emit event after marking dirty/touched for feedback components
}
