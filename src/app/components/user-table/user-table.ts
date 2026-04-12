import { Component, inject, output } from '@angular/core';
import { DataTable } from '../data-table/data-table';
import Column from '../../model/column';
import RowAction from '../../model/row-actions';
import User from '../../model/user';
import { UserStore } from '../../store/user.store';
import Pageable from '../../model/pageable';
import { CardModule } from 'primeng/card';
import { UserAuthorites } from '../../model/user-autorities';

@Component({
  selector: 'app-user-table',
  imports: [CardModule, DataTable],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTable {
  /**
   * Emitted when the edit action is triggered for a user.
   */
  readonly editPressed = output<User>();
  /**
   * Emitted when the delete action is triggered for a user.
   */
  readonly deletePressed = output<User>();
  /**
   * Emitted when the reset action is triggered for a user.
   */
  readonly resetPressed = output<User>();
  /**
   * Emitted when pagination or sorting options change.
   */
  readonly pageOptionChanged = output<Pageable>();
  protected readonly userStore = inject(UserStore);
  protected readonly columns = [
    new Column('id', $localize`:@@userTable.id:ID`, true),
    new Column('name', $localize`:@@userTable.name:Name`, true),
    new Column('username', $localize`:@@userTable.username:Username`, true),
  ];

  protected readonly rowActions = [
    RowAction.fromPartial({
      title: $localize`:@@userTable.editAction:Edit`,
      funct: (row: User) => {
        this.editPressed.emit(row);
      },
      requiredAuthority: UserAuthorites.MODIFY_USERS,
    }),

    RowAction.fromPartial({
      title: $localize`:@@userTable.deleteAction:Delete`,
      funct: (row: User) => {
        this.deletePressed.emit(row);
      },
      requiredAuthority: UserAuthorites.MODIFY_USERS,
    }),
    RowAction.fromPartial({
      title: $localize`:@@userTable.resetPassword:Reset Password`,
      funct: (row: User) => {
        this.resetPressed.emit(row);
      },
      requiredAuthority: UserAuthorites.MODIFY_USERS,
    }),
  ];
}
