import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthenticationService } from '../service/authentication.service';
import { selectDoesUserHaveActiveRefreshToken } from '../state/current-user.selector';

export const loginGuard: CanActivateFn = () => {
  const store = inject(Store);
  const authService = inject(AuthenticationService);
  const hasActiveRefreshToken = store.selectSignal(selectDoesUserHaveActiveRefreshToken);

  if (hasActiveRefreshToken()) {
    return true;
  }

  authService.clearTokenAndRedirect();

  return false;
};
