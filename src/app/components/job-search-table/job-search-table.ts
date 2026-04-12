import { Component, inject, output } from '@angular/core';
import Pageable from '../../model/pageable';
import { DataTable } from '../data-table/data-table';
import { CardModule } from 'primeng/card';
import { JobStore } from '../../store/job.store';
import Column from '../../model/column';
import { DateFormatter } from '../../helper/date-formatter';
import RowAction from '../../model/row-actions';
import JobSearchResponse from '../../model/job-search-response';
import { Router } from '@angular/router';
import { PageTitle } from '../../model/enums/PageTitle';

@Component({
  selector: 'app-job-search-table',
  imports: [DataTable, CardModule],
  templateUrl: './job-search-table.html',
  styleUrl: './job-search-table.scss',
})
export class JobSearchTable {
  protected readonly jobStore = inject(JobStore);
  private readonly dateFormatter = inject(DateFormatter);
  private readonly router = inject(Router);
  /**
   * Emitted when pagination or sorting options change.
   */
  readonly pageOptionsChanged = output<Pageable>();

  emitPageOptionsChanged(event: Pageable) {
    this.pageOptionsChanged.emit(event);
  }

  /**
   * Emitted when pagination or sorting options change.
   */
  readonly pageOptionsChange = output<Pageable>();
  protected readonly rowActions = [
    new RowAction<JobSearchResponse>(
      $localize`:@@personSearch.table.rowActions.select:Select`,
      (row: JobSearchResponse) => {
        this.router.navigate([PageTitle.PERSON_INFO, row.personid, PageTitle.JOB_INFO, row.jobid]);
      },
    ),
  ];

  protected readonly columns = [
    new Column('personName', $localize`:@@jobSearch.table.personName:Person name`, true),
    new Column('objectName', $localize`:@@jobSearch.table.objectName:Object name`, true),
    new Column('description', $localize`:@@jobSearch.table.description:Description`, true),
    new Column('done', $localize`:@@jobSearch.table.done:Done date`, true),
  ];

  formatDate = (date: string) => {
    if (!date) {
      return '-';
    }

    return this.dateFormatter.formatDate(new Date(date));
  };
}
