import { Component, inject, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DataTable } from '../data-table/data-table';
import Column from '../../model/column';
import { PersonStore } from '../../store/person.store';
import RowAction from '../../model/row-actions';
import PersonSearch from '../../model/person-search';
import Pageable from '../../model/pageable';

@Component({
  selector: 'app-person-search-table',
  imports: [CardModule, DataTable],
  templateUrl: './person-search-table.html',
  styleUrl: './person-search-table.scss',
})
export class PersonSearchTable {
  protected readonly personStore = inject(PersonStore);
  /**
   * Emitted when pagination or sorting options change.
   */
  readonly pageOptionsChange = output<Pageable>();
  /**
   * Whether interactions with the table are disabled.
   */
  readonly disabled = input<boolean>(false);
  /**
   * Actions available for each row.
   */
  readonly rowActions = input<RowAction<PersonSearch>[]>([]);

  protected readonly columns = [
    new Column('name', $localize`:@@newJobForm.personTable.name:Name`, true),
    new Column('address', $localize`:@@newJobForm.personTable.address:Address`, true),
    new Column('phone', $localize`:@@newJobForm.personTable.phone:Phone`, true),
  ];

  emitPageOptionsChanged(event: Pageable) {
    this.pageOptionsChange.emit(event);
  }
}
