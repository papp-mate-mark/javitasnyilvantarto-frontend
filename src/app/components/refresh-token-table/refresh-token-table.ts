import { Component, inject, output } from '@angular/core';
import Column from '../../model/column';
import RefreshTokenData from '../../model/refresh-token-data';
import RowAction from '../../model/row-actions';
import { RefreshTokenStore } from '../../store/refresh-token.store';
import { DataTable } from '../data-table/data-table';

@Component({
  selector: 'app-refresh-token-table',
  imports: [DataTable],
  templateUrl: './refresh-token-table.html',
  styleUrls: ['./refresh-token-table.scss'],
})
export class RefreshTokenTable {
  /**
   * Emitted when a refresh token invalidation is requested for a row.
   */
  readonly invalidatePressed = output<RefreshTokenData>();

  protected readonly refreshTokenStore = inject(RefreshTokenStore);

  protected readonly columns = [
    new Column('id', $localize`:@@userPage.refreshTokenTable.id:ID`, true),
    new Column('userAgent', $localize`:@@userPage.refreshTokenTable.userAgent:User Agent`, true),
    new Column('ipAddress', $localize`:@@userPage.refreshTokenTable.ipAddress:IP Address`, true),
  ];

  protected readonly rowActions = [
    new RowAction(
      $localize`:@@userPage.refreshTokenTable.invalidate:Invalidate`,
      (row: RefreshTokenData) => {
        this.invalidatePressed.emit(row);
      },
    ),
  ];
}