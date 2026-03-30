import TokenResponse from './token-response';
import { UserAuthorites } from './user-autorities';

export default class LoginResponse {
  constructor(public authorities: UserAuthorites[], public tokens: TokenResponse) {}
}
