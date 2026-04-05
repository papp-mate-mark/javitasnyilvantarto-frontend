import { inject, Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import ErrorMessage from '../model/error-message';
import RefreshTokenData from '../model/refresh-token-data';
import { RefreshTokenStore } from '../store/refresh-token.store';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  private readonly apiService = inject(ApiService);
  private readonly refreshTokenStore = inject(RefreshTokenStore);

  fetchActiveTokens() {
    this.refreshTokenStore.setActiveTokensLoading(true);

    return this.apiService
      .getReq<RefreshTokenData[]>(
        `/refresh-tokens/active`,
        new ErrorMessage(
          $localize`:@@refreshTokenService.fetchTitle:Active Sessions`,
          $localize`:@@refreshTokenService.fetchFailed:Fetching active sessions failed`,
        ),
      )
      .pipe(finalize(() => this.refreshTokenStore.setActiveTokensLoading(false)));
  }

  invalidateToken(id: number) {
    return this.apiService.postReq<void>(
      `/refresh-tokens/${id}/invalidate`,
      new ErrorMessage(
        $localize`:@@refreshTokenService.invalidateTitle:Invalidate Session`,
        $localize`:@@refreshTokenService.invalidateFailed:Invalidating active session failed`,
      ),
      {},
    );
  }
}