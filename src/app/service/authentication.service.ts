import { inject, Injectable } from '@angular/core';
import LoginRequest from '../model/login-request';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CurrentUserApiActions } from '../state/current-user.actions';
import { map, finalize, shareReplay } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { PageTitle } from '../model/enums/PageTitle';
import ErrorMessage from '../model/error-message';
import LoginResponse from '../model/login-response';
import { selectCurrentUser } from '../state/current-user.selector';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly apiService = inject(ApiService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly TITLE = $localize`:@@auth.title:Authenticaion`;
  private refreshRequest: Observable<LoginResponse> | null = null;

  login(request: LoginRequest) {
    return this.apiService.postReq<LoginResponse>(
      environment.LOGIN_ENDPOINT,
      new ErrorMessage(
        $localize`:@@loginFailed.title:Login failed`,
        $localize`:@@loginFailed.message:Incorrect username or password`
      ),
      request
    );
  }

  refreshTokens(refreshToken: string) {
    if (this.refreshRequest) {
      return this.refreshRequest;
    }

    this.refreshRequest = this.apiService
      .postReq<LoginResponse>(
        environment.REFRESH_ENDPOINT,
        new ErrorMessage(
          this.TITLE,
          $localize`:@@auth.refreshFailed:Requesting refresh token failed`
        ),
        refreshToken
      )
      .pipe(
        map((response) => {
          this.store.dispatch(
            CurrentUserApiActions.retrievedCurrentUser({ loginResponse: response })
          );

          return response;
        }),
        finalize(() => {
          this.refreshRequest = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    return this.refreshRequest;
  }

  logout() {
    const currentUser = this.store.selectSignal(selectCurrentUser)();
    this.apiService
      .postReq<void>(
        '/auth/logout',
        new ErrorMessage(
          $localize`:@@logoutFailed.title:Logout failed`,
          $localize`:@@logoutFailed.message:Sending logout request failed`
        ),
        currentUser.refreshToken
      )
      .subscribe(() => {
        this.clearTokenAndRedirect();
      });
  }

  clearTokenAndRedirect() {
    this.store.dispatch(CurrentUserApiActions.unsetCurrentUser());
    this.router.navigate([PageTitle.LOGIN]);
  }
}
