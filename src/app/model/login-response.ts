import TokenResponse from './token-response';

export default class LoginResponse {
  constructor(
    public tokens: TokenResponse,
    public name?: string,
  ) {}
}
