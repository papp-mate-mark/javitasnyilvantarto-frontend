import { Component, input } from '@angular/core';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-multiselect',
  imports: [ReactiveFormsModule, DynamicSkeleton, ValidationFeedback, MultiSelectModule],
  templateUrl: './multiselect.html',
  styleUrl: './multiselect.scss',
})
export class Multiselect<T> extends BaseReactiveForm {
  /**
   * Property name used as the display label.
   */
  readonly optionLabel = input.required<string>();
  /**
   * Property name used as the option value.
   */
  readonly optionValue = input.required<string>();
  /**
   * Options available for selection.
   */
  readonly options = input.required<T[]>();
  /**
   * Placeholder text to display when no value is selected.
   */
  readonly placeholder = input<string>();
}
