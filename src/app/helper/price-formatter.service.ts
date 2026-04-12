import { Injectable, LOCALE_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PriceFormatter {
  private readonly localeId = inject(LOCALE_ID);

  formatPrice(value: number | null | undefined, currency = 'HUF'): string {
    if (value == null) {
      return '';
    }

    return new Intl.NumberFormat(this.localeId, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}
