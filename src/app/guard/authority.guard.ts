import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserAuthorites } from '../model/user-autorities';
import { checkAuthority } from '../helper/authority-helper';

const getRequiredAuthorityFromRouteTree = (
  route: ActivatedRouteSnapshot,
): UserAuthorites | string | undefined => {
  let cursor: ActivatedRouteSnapshot | null = route;
  let requiredAuthority: UserAuthorites | string | undefined = cursor.data?.['requiredAuthority'];

  while (cursor?.firstChild) {
    cursor = cursor.firstChild;
    const candidate = cursor.data?.['requiredAuthority'] as UserAuthorites | string | undefined;

    if (candidate) {
      requiredAuthority = candidate;
    }
  }

  return requiredAuthority;
};

export const authorityGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const requiredAuthority = getRequiredAuthorityFromRouteTree(route);

  if (!requiredAuthority) {
    return true;
  }

  const store = inject(Store);
  const router = inject(Router);

  if (!checkAuthority(store, UserAuthorites[requiredAuthority as keyof typeof UserAuthorites])) {
    return router.createUrlTree([]);
  }

  return true;
};
