import { Pipe, PipeTransform, inject } from '@angular/core';
import { PriceFormatter } from './price-formatter.service';

@Pipe({
  name: 'price',
  standalone: true,
})
export class PricePipe implements PipeTransform {
  private readonly priceFormatter = inject(PriceFormatter);

  transform(value: number | null | undefined, currency = 'HUF'): string {
    return this.priceFormatter.formatPrice(value, currency);
  }
}
