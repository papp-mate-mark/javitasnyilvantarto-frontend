import { createFeatureSelector, createSelector } from '@ngrx/store';
import CurrentUser from '../model/current-user';
import { UserAuthorites } from '../model/user-autorities';

export const selectCurrentUser = createFeatureSelector<CurrentUser>('currentUser');
export const selectHasAccessToken = createSelector(
  selectCurrentUser,
  (currentUser: CurrentUser) => {
    return !!currentUser.accessToken && Date.now() < currentUser.accessTokenExpiration;
  }
);

export const selectDoesUserHaveActiveRefreshToken = createSelector(
  selectCurrentUser,
  (currentUser: CurrentUser) => {
    return !!currentUser.refreshToken && Date.now() < currentUser.refreshTokenExpiration;
  }
);

export const selectUserAuthorities = createSelector(
  selectCurrentUser,
  (currentUser: CurrentUser) => {
    return currentUser.authorities ?? [];
  }
);

export const hasAuthority = (authority: UserAuthorites) =>
  createSelector(selectUserAuthorities, (authorities: UserAuthorites[] | undefined) => {
    return authorities?.includes(authority) ?? false;
  });
