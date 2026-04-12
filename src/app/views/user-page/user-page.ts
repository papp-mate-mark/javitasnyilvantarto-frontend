import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import RefreshTokenData from '../../model/refresh-token-data';
import { AppConfirmationService } from '../../service/confirmation.service';
import { RefreshTokenService } from '../../service/refresh-token.service';
import { RefreshTokenStore } from '../../store/refresh-token.store';
import { NewPasswordDialog } from '../../components/new-password-dialog/new-password-dialog';
import { RefreshTokenTable } from '../../components/refresh-token-table/refresh-token-table';

@Component({
  selector: 'app-user-page',
  imports: [ButtonModule, CardModule, NewPasswordDialog, RefreshTokenTable],
  templateUrl: './user-page.html',
  styleUrl: './user-page.scss',
})
export class UserPage implements OnInit {
  private readonly refreshTokenService = inject(RefreshTokenService);
  private readonly refreshTokenStore = inject(RefreshTokenStore);
  private readonly confirmationService = inject(AppConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly newPasswordDialogVisible = signal(false);

  ngOnInit(): void {
    this.fetchActiveTokens();
  }

  protected openNewPasswordDialog() {
    this.newPasswordDialogVisible.set(true);
  }

  protected fetchActiveTokens() {
    this.refreshTokenService
      .fetchActiveTokens()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tokens) => {
        this.refreshTokenStore.setActiveTokens(tokens);
      });
  }

  protected openInvalidateTokenConfirmation(tokenData: RefreshTokenData) {
    this.confirmationService.proceed(
      () => {
        this.refreshTokenService
          .invalidateToken(tokenData.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.fetchActiveTokens();
          });
      },
      undefined,
      $localize`:@@userPage.invalidateTokenConfirmation:Are you sure you want to invalidate this session?`,
    );
  }
}
