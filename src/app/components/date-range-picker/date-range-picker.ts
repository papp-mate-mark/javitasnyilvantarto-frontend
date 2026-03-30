import { Component } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';
@Component({
  selector: 'app-date-range-picker',
  imports: [DatePickerModule, DynamicSkeleton, ReactiveFormsModule, ValidationFeedback],
  templateUrl: './date-range-picker.html',
  styleUrl: './date-range-picker.scss',
})
export class DateRangePicker extends BaseReactiveForm {}
