import { Component } from '@angular/core';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';
import { TextareaModule } from 'primeng/textarea';
import { ScrollIntoViewOnFocusDirective } from '../../directive/scroll-into-view-on-focus.directive';

@Component({
  selector: 'app-textarea',
  imports: [
    TextareaModule,
    ReactiveFormsModule,
    DynamicSkeleton,
    ValidationFeedback,
    ScrollIntoViewOnFocusDirective,
  ],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
})
export class Textarea extends BaseReactiveForm {}
