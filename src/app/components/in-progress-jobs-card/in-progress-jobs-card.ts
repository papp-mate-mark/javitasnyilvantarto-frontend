import { Component, computed, inject, signal } from '@angular/core';
import Column from '../../model/column';
import InProgressJobRowData from '../../model/in-progress-job-row-data';
import { JobGroupStore } from '../../store/job-group.store';
import { DataTable } from '../data-table/data-table';
import { CardModule } from 'primeng/card';
import RowAction from '../../model/row-actions';
import { SetToDoneDialog } from '../set-to-done-dialog/set-to-done-dialog';
import { DateFormatter } from '../../helper/date-formatter';
import { Router } from '@angular/router';
import { PageTitle } from '../../model/enums/PageTitle';
import { UserAuthorites } from '../../model/user-autorities';

@Component({
  selector: 'app-in-progress-jobs-card',
  imports: [DataTable, CardModule, SetToDoneDialog],
  templateUrl: './in-progress-jobs-card.html',
  styleUrl: './in-progress-jobs-card.scss',
})
export class InProgressJobsCard {
  protected readonly jobGroupStore = inject(JobGroupStore);
  private readonly dateFormatter = inject(DateFormatter);
  private readonly router = inject(Router);
  protected readonly dialogVisible = signal(false);
  protected readonly selectedJobId = signal(0);
  protected readonly selectedJobName = signal('');

  columns = [
    new Column('name', $localize`:@@inProgessJobs.name:Name`, false),
    new Column('object', $localize`:@@inProgessJobs.object:Object name`, false),
    new Column('description', $localize`:@@inProgessJobs.description:Job description`, false),
    new Column('upload', $localize`:@@inProgessJobs.upload:Upload date`, false),
    new Column('deadLine', $localize`:@@inProgessJobs.deadLine:Deadline`, false),
  ];

  rowActions = [
    new RowAction(
      $localize`:@@inProgressJobs.table.rowActions.details:Details`,
      (row: InProgressJobRowData) => {
        this.router.navigate([PageTitle.PERSON_INFO, row.personId, PageTitle.JOB_INFO, row.jobId]);
      }
    ),
    new RowAction(
      $localize`:@@inProgressJobs.table.rowActions.setToDone:Done`,
      (row: InProgressJobRowData) => {
        this.dialogVisible.set(true);
        this.selectedJobId.set(row.jobId);
        this.selectedJobName.set(row.name);
      },
      false,
      true,
      UserAuthorites.MODIFY_JOBS
    ),
  ];

  jobs = computed(() => {
    const groups = this.jobGroupStore.activeJobs().groups;

    if (!groups) {
      return [];
    }

    return groups.flatMap((group) =>
      group.inProgressJobs.map(
        (job) =>
          new InProgressJobRowData(
            group.personId,
            job.id,
            group.personname,
            job.objectname,
            job.description,
            new Date(group.uploadDate),
            new Date(group.deadline)
          )
      )
    );
  });

  formatDate = (date: Date) => this.dateFormatter.formatDate(date);
}
