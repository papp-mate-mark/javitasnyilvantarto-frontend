/**
 * Represents a single active refresh token entry for the authenticated user.
 */
export default class RefreshTokenData {
  /**
   * @param userAgent Browser and device information captured for the token.
   * @param ipAddress IP address from which the token was issued.
   * @param id Unique identifier of the refresh token record.
   */
  constructor(
    public userAgent: string,
    public ipAddress: string,
    public id: number,
  ) {}
}