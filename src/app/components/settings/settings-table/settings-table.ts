import { Component, inject, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DataTable } from '../../data-table/data-table';
import Column from '../../../model/column';
import { SettingsStore } from '../../../store/settings.store';
import Pageable from '../../../model/pageable';
import RowAction from '../../../model/row-actions';
import SystemSettings from '../../../model/system-settings';
import { translateSystemSettingDescription } from '../../../helper/system-setting-description-translator';

@Component({
  selector: 'app-settings-table',
  imports: [CardModule, DataTable],
  templateUrl: './settings-table.html',
  styleUrl: './settings-table.scss',
})
export class SettingsTable {
  protected readonly settingsStore = inject(SettingsStore);
  /**
   * Emitted when pagination or sorting options change.
   */
  pageOptionsChange = output<Pageable>();
  /**
   * Emitted when the edit action is triggered for a setting.
   */
  editPressed = output<SystemSettings>();
  protected readonly columns = [
    new Column('key', $localize`:@@settingsTable.key:Key`, true),
    new Column('descriptionKey', $localize`:@@settingsTable.description:Description`, false),
    new Column('value', $localize`:@@settingsTable.value:Value`, true),
  ];

  protected readonly rowActions = [
    new RowAction($localize`:@@settingsTable.edit:Edit`, (row: SystemSettings) =>
      this.editPressed.emit(row),
    ),
  ];

  translateDescription = translateSystemSettingDescription;
}
