import { Component, input, InputSignal } from '@angular/core';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { PasswordModule } from 'primeng/password';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';

@Component({
  selector: 'app-password-input',
  imports: [PasswordModule, ReactiveFormsModule, DynamicSkeleton, ValidationFeedback],
  templateUrl: './password-input.html',
  styleUrl: './password-input.scss',
})
export class PasswordInput extends BaseReactiveForm {
  /**
   * Whether to show the "view password" toggle.
   */
  readonly feedback: InputSignal<boolean> = input(false);
  /**
   * Native autocomplete hint used by browsers/password managers.
   */
  readonly autocomplete: InputSignal<string | undefined> = input();
}
