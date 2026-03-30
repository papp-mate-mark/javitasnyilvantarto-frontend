import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { requestInterceptor } from './reqest-interceptor-interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import LoginResponse from '../model/login-response';
import TokenResponse from '../model/token-response';
import { HttpHeader } from '../model/enums/http-header';
import {
  selectDoesUserHaveActiveRefreshToken,
  selectHasAccessToken,
  selectCurrentUser,
} from '../state/current-user.selector';
import CurrentUser from '../model/current-user';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { CurrentUserApiActions } from '../state/current-user.actions';

const TEST_URL = 'https://api.example.com/test';

const getProviders = (initialNgRxStoreState: CurrentUser) => [
  provideHttpClient(withInterceptors([requestInterceptor])),
  provideHttpClientTesting(),
  MessageService,
  provideMockStore({
    initialState: initialNgRxStoreState,
    selectors: [
      {
        selector: selectHasAccessToken,
        value: selectHasAccessToken.projector(initialNgRxStoreState),
      },
      {
        selector: selectDoesUserHaveActiveRefreshToken,
        value: selectDoesUserHaveActiveRefreshToken.projector(initialNgRxStoreState),
      },
      {
        selector: selectCurrentUser,
        value: selectCurrentUser.projector(initialNgRxStoreState),
      },
    ],
  }),
];

describe('reqestInterceptorInterceptor', () => {
  let apiService: HttpClient;
  let httpTesting: HttpTestingController;

  describe('when access token is not expired', () => {
    let store: MockStore;

    const initialState = {
      accessToken: 'mockAccessToken',
      accessTokenExpiration: Date.now() + 3600 * 1000,
      refreshToken: 'mockRefreshToken',
      refreshTokenExpiration: Date.now() + 7 * 24 * 3600 * 1000,
    } as CurrentUser;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: getProviders(initialState),
      });
      httpTesting = TestBed.inject(HttpTestingController);
      apiService = TestBed.inject(HttpClient);
      store = TestBed.inject(MockStore);
    });

    afterEach(() => httpTesting.verify());

    it('should attach authorization header when token is not expired', () => {
      apiService.get(TEST_URL).subscribe();

      const req = httpTesting.expectOne(TEST_URL);
      expect(req.request.headers.get(HttpHeader.AUTHORIZATION)).toBe('Bearer mockAccessToken');
    });

    it('should refresh if the token is valid but the server responds with 401', () => {
      let result: unknown;
      apiService.get(TEST_URL).subscribe((res) => (result = res));

      const firstReq = httpTesting.expectOne(TEST_URL);
      firstReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      const refreshReq = httpTesting.expectOne(environment.API_URL + environment.REFRESH_ENDPOINT);
      expect(refreshReq.request.method).toBe('POST');
      expect(refreshReq.request.body).toBe('mockRefreshToken');
      refreshReq.flush(
        new LoginResponse([], new TokenResponse('newAccessToken', 'newRefreshToken')),
      );

      const retriedReq = httpTesting.expectOne(TEST_URL);
      expect(retriedReq.request.headers.get(HttpHeader.AUTHORIZATION)).toBe(
        'Bearer newAccessToken',
      );

      retriedReq.flush({ ok: true });

      expect(result).toEqual({ ok: true });
    });
    it('should logout if refreshing fails', () => {
      spyOn(store, 'dispatch');

      apiService.get(TEST_URL).subscribe();

      const firstReq = httpTesting.expectOne(TEST_URL);
      firstReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      const refreshReq = httpTesting.expectOne(environment.API_URL + environment.REFRESH_ENDPOINT);
      refreshReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(store.dispatch).toHaveBeenCalledWith(CurrentUserApiActions.unsetCurrentUser());
    });
    it('should not attach header for login and refresh endpoints', () => {
      apiService.post(environment.API_URL + environment.LOGIN_ENDPOINT, {}).subscribe();
      const loginReq = httpTesting.expectOne(environment.API_URL + environment.LOGIN_ENDPOINT);
      expect(loginReq.request.headers.has(HttpHeader.AUTHORIZATION)).toBeFalse();

      apiService.post(environment.API_URL + environment.REFRESH_ENDPOINT, {}).subscribe();
      const authReq = httpTesting.expectOne(environment.API_URL + environment.REFRESH_ENDPOINT);
      expect(authReq.request.headers.has(HttpHeader.AUTHORIZATION)).toBeFalse();
    });
  });
  describe('when access token is expired', () => {
    const initialState = {
      accessToken: 'mockAccessToken',
      accessTokenExpiration: Date.now() - 3600 * 1000,
      refreshToken: 'mockRefreshToken',
      refreshTokenExpiration: Date.now() + 7 * 24 * 3600 * 1000,
    } as CurrentUser;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: getProviders(initialState),
      });

      httpTesting = TestBed.inject(HttpTestingController);
      apiService = TestBed.inject(HttpClient);
    });

    afterEach(() => httpTesting.verify());

    it('should not attach header for login and refresh endpoints', () => {
      apiService.post(environment.API_URL + environment.LOGIN_ENDPOINT, {}).subscribe();
      const loginReq = httpTesting.expectOne(environment.API_URL + environment.LOGIN_ENDPOINT);
      expect(loginReq.request.headers.has(HttpHeader.AUTHORIZATION)).toBeFalse();

      apiService.post(environment.API_URL + environment.REFRESH_ENDPOINT, {}).subscribe();
      const authReq = httpTesting.expectOne(environment.API_URL + environment.REFRESH_ENDPOINT);
      expect(authReq.request.headers.has(HttpHeader.AUTHORIZATION)).toBeFalse();
    });

    it('should refresh when access token is expired but refresh isnt', () => {
      let result: unknown;
      apiService.get(TEST_URL).subscribe((res) => (result = res));

      const refreshReq = httpTesting.expectOne(environment.API_URL + environment.REFRESH_ENDPOINT);
      expect(refreshReq.request.method).toBe('POST');
      expect(refreshReq.request.body).toBe('mockRefreshToken');
      refreshReq.flush(
        new LoginResponse([], new TokenResponse('newAccessToken', 'newRefreshToken')),
      );

      const req = httpTesting.expectOne(TEST_URL);
      expect(req.request.headers.get(HttpHeader.AUTHORIZATION)).toBe('Bearer newAccessToken');
      req.flush({ ok: true });
      expect(result).toEqual({ ok: true });
    });
  });
  describe('when all tokens are not expired', () => {
    let store: MockStore;

    const initialState = {
      accessToken: 'mockAccessToken',
      accessTokenExpiration: Date.now() - 3600 * 1000,
      refreshToken: 'mockRefreshToken',
      refreshTokenExpiration: Date.now() - 7 * 24 * 3600 * 1000,
    } as CurrentUser;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: getProviders(initialState),
      });
      httpTesting = TestBed.inject(HttpTestingController);
      apiService = TestBed.inject(HttpClient);
      store = TestBed.inject(MockStore);
    });

    afterEach(() => httpTesting.verify());

    it('should logout if both tokens are expired', () => {
      spyOn(store, 'dispatch');
      apiService.get(TEST_URL).subscribe();

      expect(store.dispatch).toHaveBeenCalledWith(CurrentUserApiActions.unsetCurrentUser());
    });
  });
});
