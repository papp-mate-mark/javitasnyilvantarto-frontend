import { Component, input, InputSignal } from '@angular/core';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';
import { ScrollIntoViewOnFocusDirective } from '../../directive/scroll-into-view-on-focus.directive';

@Component({
  selector: 'app-text-input',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    DynamicSkeleton,
    ValidationFeedback,
    ScrollIntoViewOnFocusDirective,
  ],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput extends BaseReactiveForm {
  /**
   * Native autocomplete hint used by browsers/password managers.
   */
  readonly autocomplete: InputSignal<string | undefined> = input();
}
