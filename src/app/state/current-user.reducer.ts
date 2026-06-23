import { createReducer, on } from '@ngrx/store';

import { jwtDecode } from 'jwt-decode';
import { RefreshJwtPayload } from '../model/refresh-jwt-payload';
import CurrentUser from '../model/current-user';
import { CurrentUserApiActions } from './current-user.actions';
import { AccessJwtPayload } from '../model/access-jwt-payload';
import { UserAuthorites } from '../model/user-autorities';

export const initialState: CurrentUser = {} as CurrentUser;

export const currentUserReducer = createReducer(
  initialState,
  on(CurrentUserApiActions.retrievedCurrentUser, (_state, { loginResponse }) => {
    const accessTokenPayload = jwtDecode<AccessJwtPayload>(loginResponse.tokens.accessToken);
    const refreshTokenPayload = jwtDecode<RefreshJwtPayload>(loginResponse.tokens.refreshToken);
    const authorities: UserAuthorites[] = accessTokenPayload.authorities.filter(
      (authority): authority is UserAuthorites =>
        Object.values<string>(UserAuthorites).includes(authority),
    ); //Safely parse, drop out missing ones.

    return {
      name: loginResponse.name,
      username: accessTokenPayload.sub,
      accessToken: loginResponse.tokens.accessToken,
      refreshToken: loginResponse.tokens.refreshToken,
      authorities: authorities,
      accessTokenExpiration: accessTokenPayload.exp * 1000,
      refreshTokenExpiration: refreshTokenPayload.exp * 1000,
    } as CurrentUser;
  }),
  on(CurrentUserApiActions.unsetCurrentUser, () => {
    return {} as CurrentUser;
  }),
);
