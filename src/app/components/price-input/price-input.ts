import { Component, inject, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicSkeleton } from '../dynamic-skeleton/dynamic-skeleton';
import { ValidationFeedback } from '../validation-feedback/validation-feedback';
import { BaseReactiveForm } from '../../model/derictive/form/base-reactive-form';
import { PriceFormatter } from '../../helper/price-formatter.service';
import { scrollIntoViewHelper } from '../../helper/scroll-into-view.helper';

@Component({
  selector: 'app-price-input',
  imports: [InputNumberModule, DynamicSkeleton, ReactiveFormsModule, ValidationFeedback],
  templateUrl: './price-input.html',
  styleUrl: './price-input.scss',
})
export class PriceInput extends BaseReactiveForm {
  protected readonly priceFormatter = inject(PriceFormatter);
  protected readonly locale = inject(LOCALE_ID) as string;

  onInputFocus(event: Event) {
    const target = event.target as HTMLElement;

    if (target) {
      scrollIntoViewHelper(target);
    }
  }
}
