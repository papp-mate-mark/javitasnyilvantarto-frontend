import { UserAuthorites } from './user-autorities';

export default class RowAction<T> {
  constructor(
    public title: string,
    public funct: (row: T) => void,
    public disabled?: boolean,
    public visible?: boolean,
    public requiredAuthority?: UserAuthorites
  ) {}

  static fromPartial<T>(
    partial: Partial<RowAction<T>> & { title: string; funct: (row: T) => void }
  ): RowAction<T> {
    return new RowAction(
      partial.title,
      partial.funct,
      partial.disabled,
      partial.visible,
      partial.requiredAuthority
    );
  }
}
