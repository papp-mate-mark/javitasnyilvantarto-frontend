export class JwtPayload {
  constructor(public sub: string, public exp: number) {}
}
