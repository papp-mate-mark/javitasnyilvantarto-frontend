import { Injectable, inject } from '@angular/core';
import { Confirmation, ConfirmationService, ConfirmEventType } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AppConfirmationService {
  private readonly confirmationService = inject(ConfirmationService);
  proceed(accept: () => void, reject?: () => void, message?: string, title?: string) {
    this.confirmationService.confirm({
      message:
        message ||
        $localize`:@@confirmationService.defaultMessage:Are you sure you want to proceed?`,
      header: title || $localize`:@@confirmationService.defaultTitle:Please Confirm`,
      acceptButtonProps: { label: $localize`:@@confirmationService.proceed:Proceed` },
      rejectButtonProps: {
        label: $localize`:@@confirmationService.cancel:Cancel`,
        outlined: true,
        severity: 'secondary',
      },
      accept,
      reject: (type: ConfirmEventType) => type === ConfirmEventType.REJECT && reject?.(),
    });
  }

  /**
   * Show a custom confirmation popup with arbitrary PrimeNG Confirmation options.
   * Usage: pass any Confirmation config, including custom templates, buttons, etc.
   */
  custom(options: Confirmation) {
    this.confirmationService.confirm(options);
  }
}
