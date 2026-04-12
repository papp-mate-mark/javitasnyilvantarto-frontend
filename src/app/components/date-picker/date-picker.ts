import { Component } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';
import { scrollIntoViewHelper } from '../../helper/scroll-into-view.helper';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-date-picker',
  imports: [
    DatePickerModule,
    DynamicSkeleton,
    ReactiveFormsModule,
    ValidationFeedback,
    InputTextModule,
  ],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
})
export class DatePicker extends BaseReactiveForm {
  onInputFocus(event: Event) {
    const target = event.target as HTMLElement;

    if (target) {
      scrollIntoViewHelper(target);
    }
  }
}
