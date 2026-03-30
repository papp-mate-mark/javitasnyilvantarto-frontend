import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectDoesUserHaveActiveRefreshToken } from '../state/current-user.selector';
import { inject } from '@angular/core';

export const loggedOutGuard: CanActivateFn = () => {
  const store = inject(Store);

  if (store.selectSignal(selectDoesUserHaveActiveRefreshToken)()) {
    return false;
  }

  return true;
};
