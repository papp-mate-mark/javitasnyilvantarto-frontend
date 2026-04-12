import { Component, input } from '@angular/core';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';
import { scrollIntoViewHelper } from '../../helper/scroll-into-view.helper';

@Component({
  selector: 'app-number-input',
  imports: [InputNumberModule, DynamicSkeleton, ReactiveFormsModule, ValidationFeedback],
  templateUrl: './number-input.html',
  styleUrl: './number-input.scss',
})
export class NumberInput extends BaseReactiveForm {
  /**
   * Whether only integer values are allowed.
   */
  readonly isInteger = input<boolean>(true);
  onInputFocus(event: Event) {
    const target = event.target as HTMLElement;

    if (target) {
      scrollIntoViewHelper(target);
    }
  }
}
