import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthenticationService } from '../service/authentication.service';
import {
  selectHasAccessToken,
  selectDoesUserHaveActiveRefreshToken,
  selectCurrentUser,
} from '../state/current-user.selector';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { environment } from '../../envirements/envirements';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authService = inject(AuthenticationService);

  const hasAccessToken = store.selectSignal(selectHasAccessToken)();
  const hasRefreshToken = store.selectSignal(selectDoesUserHaveActiveRefreshToken)();
  const currentUser = store.selectSignal(selectCurrentUser)();

  // Skip refreshing or attaching headers for auth endpoints
  if (
    req.url.includes(environment.LOGIN_ENDPOINT) ||
    req.url.includes(environment.REFRESH_ENDPOINT)
  ) {
    return next(req);
  }

  // If access token is valid, we attach it
  if (hasAccessToken) {
    const cloned = addAuthHeader(req, currentUser.accessToken);

    return next(cloned).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Access token invalid despite being marked valid, we try refreshing
          if (hasRefreshToken && currentUser.refreshToken) {
            return authService.refreshTokens(currentUser.refreshToken).pipe(
              switchMap((newUser) => {
                const refreshedClone = addAuthHeader(req, newUser.tokens.accessToken);

                return next(refreshedClone);
              }),
              catchError((refreshError) => {
                if (refreshError.status === 401) {
                  authService.clearTokenAndRedirect();
                }

                return EMPTY;
              }),
            );
          } else {
            // No refresh token available → logout
            authService.clearTokenAndRedirect();
          }
        }

        return throwError(() => error);
      }),
    );
  }

  // If access token expired but refresh token valid, refresh before continuing
  if (!hasAccessToken && hasRefreshToken) {
    return authService.refreshTokens(currentUser.refreshToken).pipe(
      switchMap((newUser) => {
        const cloned = addAuthHeader(req, newUser.tokens.accessToken);

        return next(cloned);
      }),
      catchError((error) => {
        if (error.status === 401) {
          authService.clearTokenAndRedirect();

          return EMPTY;
        }

        return throwError(() => error);
      }),
    );
  }

  // No valid tokens left, logout
  authService.clearTokenAndRedirect();

  return EMPTY;
};

function addAuthHeader(req: HttpRequest<unknown>, token: string) {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}
