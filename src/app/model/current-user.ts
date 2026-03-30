import { UserAuthorites } from './user-autorities';

export default class CurrentUser {
  constructor(
    public username: string,
    public accessToken: string,
    public accessTokenExpiration: number,
    public refreshToken: string,
    public refreshTokenExpiration: number,
    public authorities: UserAuthorites[] = []
  ) {}
}
