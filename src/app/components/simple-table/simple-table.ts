import { Component, computed, input, InputSignal } from '@angular/core';
import { DataTable } from '../data-table/data-table';
import SimpleTableData from '../../model/simple-table-data';
import Column from '../../model/column';

@Component({
  selector: 'app-simple-table',
  imports: [DataTable],
  templateUrl: './simple-table.html',
  styleUrl: './simple-table.scss',
})
export class SimpleTable {
  /**
   * Rows to display in the table.
   */
  readonly data: InputSignal<SimpleTableData[]> = input.required();
  protected readonly columns = computed(() =>
    this.data().map((value) => new Column(value.key, value.title, false)),
  );

  protected readonly rows = computed(() => {
    const data = this.data();
    const result: Record<string, string> = {};

    for (const item of data) {
      result[item.key] = item.value ?? '-';
    }

    return [result];
  });
}
