import { createReducer, on } from '@ngrx/store';

import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../model/jwt-payload';
import CurrentUser from '../model/current-user';
import { CurrentUserApiActions } from './current-user.actions';

export const initialState: CurrentUser = {} as CurrentUser;

export const currentUserReducer = createReducer(
  initialState,
  on(CurrentUserApiActions.retrievedCurrentUser, (_state, { loginResponse }) => {
    const accessTokenPayload = jwtDecode<JwtPayload>(loginResponse.tokens.accessToken);
    const refreshTokenPayload = jwtDecode<JwtPayload>(loginResponse.tokens.refreshToken);

    return {
      username: accessTokenPayload.sub,
      accessToken: loginResponse.tokens.accessToken,
      refreshToken: loginResponse.tokens.refreshToken,
      authorities: loginResponse.authorities,
      accessTokenExpiration: accessTokenPayload.exp * 1000,
      refreshTokenExpiration: refreshTokenPayload.exp * 1000,
    } as CurrentUser;
  }),
  on(CurrentUserApiActions.unsetCurrentUser, () => {
    return {} as CurrentUser;
  })
);
