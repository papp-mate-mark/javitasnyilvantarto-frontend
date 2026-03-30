import { Component } from '@angular/core';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollIntoViewOnFocusDirective } from '../../directive/scroll-into-view-on-focus.directive';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox-input',
  imports: [CheckboxModule,
    ReactiveFormsModule,
    DynamicSkeleton,
    ValidationFeedback,
    ],
  templateUrl: './checkbox-input.html',
  styleUrl: './checkbox-input.scss',
})
export class CheckboxInput extends BaseReactiveForm {

}
