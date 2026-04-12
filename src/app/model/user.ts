import { UserAuthorites } from './user-autorities';

export default class User {
  constructor(
    public id: number,
    public username: string,
    public name: string,
    public authorities: UserAuthorites[]
  ) {}
}
