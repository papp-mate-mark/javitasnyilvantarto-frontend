import { UserAuthorites } from './user-autorities';

export default class UserRegisterRequest {
  constructor(public username: string, public name: string, public authorities: UserAuthorites[]) {}
}
