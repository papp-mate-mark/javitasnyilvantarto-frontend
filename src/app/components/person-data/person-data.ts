import { Component, computed, input, InputSignal } from '@angular/core';
import { SimpleTable } from '../simple-table/simple-table';
import SimpleTableData from '../../model/simple-table-data';
import { CardModule } from 'primeng/card';
import { FullPersonData } from '../../model/full-person-data';

@Component({
  selector: 'app-person-data',
  imports: [SimpleTable, CardModule],
  templateUrl: './person-data.html',
  styleUrl: './person-data.scss',
})
export class PersonData {
  /**
   * The person data to display.
   */
  readonly person: InputSignal<FullPersonData> = input.required();
  protected readonly data = computed(() => [
    new SimpleTableData('name', $localize`:@@personData.name:Name`, this.person()?.name),
    new SimpleTableData(
      'address',
      $localize`:@@personData.address:Address`,
      this.person()?.address,
    ),
    new SimpleTableData('phone', $localize`:@@personData.phone:Phone`, this.person()?.phone),
  ]);
}
