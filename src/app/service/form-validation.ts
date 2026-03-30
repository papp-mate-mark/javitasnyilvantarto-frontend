import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { catchError, OperatorFunction, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { withMethods, patchState, signalStoreFeature } from '@ngrx/signals';
import { Signal } from '@angular/core';
import { ErrorTypes } from '../model/enums/error-types';
import { ValidationErrorResponse } from '../model/validation-error-response';
import { ValidationFieldError } from '../model/validation-field-error';

export interface ValidationState {
  validationMessages: ValidationFieldError[];
}

export const initialValidationState = {
  validationMessages: [] as ValidationFieldError[],
};

export function validationErrorValidator(
  validationMessages: Signal<ValidationFieldError[]>,
  fieldName?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let prefix = '';

    let parent = control.parent as FormArray | FormGroup;
    let previousParent = control;

    if (parent) {
      if (fieldName) {
        //If fieldname is given, we ignore the first parent.
        previousParent = parent;
        parent = parent.parent as FormArray | FormGroup;
      }
    }

    while (parent) {
      if (parent instanceof FormArray) {
        const index = parent.controls.indexOf(previousParent);
        prefix = `[${index}].${prefix}`;
      }

      if (parent instanceof FormGroup) {
        prefix =
          Object.entries(parent.controls).find(([, value]) => value === previousParent)?.[0] +
          (previousParent instanceof FormGroup ? '.' : '') +
          prefix;
      }

      previousParent = parent;
      parent = parent.parent as FormArray | FormGroup;
    }

    const validationMessagesObj = validationMessages();

    if (validationMessagesObj.length > 0) {
      const finalFieldName = prefix + (fieldName ?? '');
      const fieldErrors = validationMessagesObj
        .filter((v) => v.fieldName === finalFieldName)
        .map((e) => e.messageKey);

      if (fieldErrors && fieldErrors.length > 0) {
        return { validationMessages: fieldErrors };
      }
    }

    return null;
  };
}

export function validateOnServerError<T>(store: {
  setValidationErrors: (validationMap: ValidationFieldError[]) => void;
}): OperatorFunction<T, T> {
  return catchError((err: HttpErrorResponse) => {
    console.log('asd');

    if (
      err.status === 400 &&
      err.error &&
      err.error.errorType &&
      err.error.errorType === ErrorTypes.VALIDATION_ERROR &&
      err.error.errorKey === 'error.validation.failed'
    ) {
      const validationErrorResponse = err.error as ValidationErrorResponse;
      store.setValidationErrors(validationErrorResponse.fieldErrors);
    }

    return throwError(() => err);
  });
}

export function withValidationOperations() {
  return signalStoreFeature(
    withMethods((store) => ({
      clearValidationErrors(): void {
        patchState(store, { validationMessages: [] });
      },
      setValidationErrors(validationMap: ValidationFieldError[]): void {
        patchState(store, { validationMessages: validationMap });
      },
    }))
  );
}
