import { Directive, input, InputSignal } from '@angular/core';

@Directive()
export abstract class BaseForm {
  /**
   * Unique field name.
   */
  readonly id: InputSignal<string> = input.required();
  /**
   * Label for the field.
   */
  readonly label: InputSignal<string | undefined> = input();
  /**
   * control name in the parent group.
   */
  readonly controlName: InputSignal<string> = input.required();

  /**
   * If it should be disabled.
   */
  readonly disabled: InputSignal<boolean> = input(false);

  /**
   * The classes applied to the input field.
   */
  readonly fieldClasses: InputSignal<string> = input('');

  /**
   * If is should be fluid
   */
  readonly fluid: InputSignal<boolean> = input(false);
}
