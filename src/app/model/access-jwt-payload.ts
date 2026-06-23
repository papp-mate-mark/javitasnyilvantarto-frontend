export class AccessJwtPayload {
  constructor(
    public sub: string,
    public exp: number,
    public iat: number,
    public token_type: string,
    public authorities: string[],
  ) {}
}
