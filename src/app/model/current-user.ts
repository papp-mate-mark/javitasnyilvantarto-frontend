import { UserAuthorites } from './user-autorities';

export default class CurrentUser {
  constructor(
    public name: string,
    public username: string,
    public accessToken: string,
    public accessTokenExpiration: number,
    public refreshToken: string,
    public refreshTokenExpiration: number,
    public authorities: UserAuthorites[] = []
  ) {}
}
