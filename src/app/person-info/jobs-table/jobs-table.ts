import { Component, computed, inject, input, InputSignal } from '@angular/core';
import { DataTable } from '../../components/data-table/data-table';
import Column from '../../model/column';
import JobTableData from '../../model/job-table-data';
import { CardModule } from 'primeng/card';
import { DateFormatter } from '../../helper/date-formatter';
import { TagModule } from 'primeng/tag';
import { JobStatus, translateJobStatus } from '../../model/enums/job-status';
import { Severity } from '../../model/enums/severity';
import RowAction from '../../model/row-actions';
import { Router } from '@angular/router';
import { PageTitle } from '../../model/enums/PageTitle';
import { FullPersonData } from '../../model/full-person-data';

@Component({
  selector: 'app-jobs-table',
  imports: [DataTable, CardModule, TagModule],
  templateUrl: './jobs-table.html',
  styleUrl: './jobs-table.scss',
})
export class JobsTable {
  /**
   * The person data containing job information to display.
   */
  readonly person: InputSignal<FullPersonData> = input.required();
  private readonly dateFormatter = inject(DateFormatter);
  private readonly router = inject(Router);
  columns = [
    new Column('object', $localize`:@@jobsTable.object:Object`, true),
    new Column('bringedin', $localize`:@@jobsTable.bringedin:Upload date`, true),
    new Column('pickup', $localize`:@@jobsTable.pickup:Pickup date`, true),
    new Column('status', $localize`:@@jobsTable.status:Status`, true),
  ];

  rowActions = [
    new RowAction($localize`:@@jobsTable.rowActions.details:Details`, (row: JobTableData) =>
      this.router.navigate([
        PageTitle.PERSON_INFO,
        this.person().id,
        PageTitle.JOB_INFO,
        row.jobId,
      ]),
    ),
  ];

  protected readonly data = computed(() => {
    const jobGroups = this.person()?.jobGroups;

    if (!jobGroups) {
      return [] as JobTableData[];
    }

    return jobGroups.flatMap((group) =>
      group.jobs.map(
        (job) =>
          new JobTableData(
            job.id,
            job.objectname,
            group.bringedin,
            job.pickup,
            job.pickup
              ? JobStatus.PICKED_UP
              : job.done
                ? JobStatus.READY_FOR_PICKUP
                : JobStatus.IN_PROGRESS,
          ),
      ),
    );
  });

  formatDate = (date: string) => {
    if (!date) {
      return '-';
    }

    return this.dateFormatter.formatDate(new Date(date));
  };

  getSeverity(status: JobStatus) {
    switch (status) {
      case JobStatus.IN_PROGRESS:
        return Severity.WARN;
      case JobStatus.READY_FOR_PICKUP:
        return Severity.INFO;
      case JobStatus.PICKED_UP:
        return Severity.SUCCESS;
    }
  }

  getTagValue = translateJobStatus;
}
