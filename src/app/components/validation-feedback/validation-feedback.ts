import { Component, computed, effect, input, InputSignal, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import ValidationErrorTranslator from '../../helper/validation-error-translator';

@Component({
  selector: 'app-validation-feedback',
  imports: [],
  templateUrl: './validation-feedback.html',
  styleUrl: './validation-feedback.scss',
})
export class ValidationFeedback {
  /**
   * The parent form group containing the control.
   */
  readonly parentGroup: InputSignal<FormGroup> = input.required();
  /**
   * The name of the control to validate.
   */
  readonly controlName: InputSignal<string> = input.required();

  // Trigger updates by reading the control's status and errors
  private readonly getControl = computed(() => this.parentGroup().get(this.controlName())!);

  protected readonly isFormInvalid = computed(
    () => this.getControl().invalid && (this.getControl().dirty || this.getControl().touched),
  );

  protected readonly errorMessages = signal<string[] | undefined>(undefined);

  constructor() {
    // Watch for control status changes and update the trigger signal
    effect(() => {
      const control = this.parentGroup().get(this.controlName());

      if (control) {
        // Subscribe to status changes to trigger recomputation
        control.statusChanges.subscribe(() => {
          const control = this.parentGroup().get(this.controlName());
          const errors = control?.errors;

          if (!errors || !control?.dirty) {
            this.errorMessages.set(undefined);

            return;
          }

          if (errors['required']) {
            this.errorMessages.set([
              $localize`:@@validationFeedback.requiredField:This field is required.`,
            ]);

            return;
          }

          if (errors['validationMessages']) {
            this.errorMessages.set(
              (errors['validationMessages'] as string[]).map((key) =>
                ValidationErrorTranslator.translateValidationErrorCode(key),
              ),
            );
          }
        });
      }
    });
  }
}
