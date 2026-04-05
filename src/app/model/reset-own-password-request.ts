export default class ResetOwnPasswordRequest {
  constructor(
    public newPassword: string,
    public refreshToken: string
  ) {}
}