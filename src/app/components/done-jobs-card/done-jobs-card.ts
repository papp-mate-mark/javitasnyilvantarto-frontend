import { Component, computed, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import Column from '../../model/column';
import DoneJobRowData from '../../model/done-job-row-data';
import { JobGroupStore } from '../../store/job-group.store';
import { DataTable } from '../data-table/data-table';
import { PricePipe } from '../../helper/price.pipe';
import { DateFormatter } from '../../helper/date-formatter';
import RowAction from '../../model/row-actions';
import { SetToPickedUpDialog } from '../set-to-picked-up-dialog/set-to-picked-up-dialog';
import { PageTitle } from '../../model/enums/PageTitle';
import { Router } from '@angular/router';
import { UserAuthorites } from '../../model/user-autorities';
import { SetJobGroupToPickedupConfirmationDialog } from '../set-job-group-to-pickedup-confirmation-dialog/set-job-group-to-pickedup-confirmation-dialog';

@Component({
  selector: 'app-done-jobs-card',
  imports: [
    DataTable,
    CardModule,
    PricePipe,
    SetToPickedUpDialog,
    SetJobGroupToPickedupConfirmationDialog,
  ],
  templateUrl: './done-jobs-card.html',
  styleUrl: './done-jobs-card.scss',
})
export class DoneJobsCard {
  protected readonly jobGroupStore = inject(JobGroupStore);
  private readonly dateFormatter = inject(DateFormatter);
  private readonly router = inject(Router);
  protected readonly singleSetToDoneDialogVisible = signal(false);
  protected readonly selectedJob = signal<DoneJobRowData | undefined>(undefined);
  protected readonly multipleSetToDoneDialogVisible = signal(false);
  protected readonly jobsInGroup = signal<DoneJobRowData[]>([]);
  doneCols = [
    new Column('name', $localize`:@@doneJobs.name:Name`, false),
    new Column('object', $localize`:@@doneJobs.object:Object name`, false),
    new Column('description', $localize`:@@doneJobs.description:Job description`, false),
    new Column('finalPrice', $localize`:@@doneJobs.finalPrice:Final price`, false),
    new Column('upload', $localize`:@@doneJobs.upload:Upload date`, false),
    new Column('finishDate', $localize`:@@doneJobs.finishDate:Finish date`, false),
  ];

  rowActions = [
    new RowAction(
      $localize`:@@doneJobs.table.rowActions.details:Details`,
      (row: DoneJobRowData) => {
        this.router.navigate([PageTitle.PERSON_INFO, row.personId, PageTitle.JOB_INFO, row.id]);
      },
    ),
    new RowAction(
      $localize`:@@inProgressJobs.table.rowActions.setToPickedUp:Picked up`,
      (row: DoneJobRowData) => {
        const inSameGroup = this.doneJobs().filter((job) => job.groupId === row.groupId);

        if (inSameGroup.length > 1) {
          this.multipleSetToDoneDialogVisible.set(true);
          this.jobsInGroup.set(inSameGroup);
        } else {
          this.singleSetToDoneDialogVisible.set(true);
          this.selectedJob.set(row);
        }
      },
      false,
      true,
      UserAuthorites.MODIFY_JOBS,
    ),
  ];

  doneJobs = computed(() => {
    const groups = this.jobGroupStore.activeJobs().groups;

    if (!groups) {
      return [];
    }

    return groups.flatMap((group) =>
      group.doneJobs.map(
        (job) =>
          new DoneJobRowData(
            group.personId,
            job.id,
            group.personname,
            job.objectname,
            job.description,
            job.finalPrice,
            new Date(group.uploadDate),
            new Date(job.finishTime),
            group.groupId,
          ),
      ),
    );
  });

  formatDate = (date: Date) => this.dateFormatter.formatDate(date);
}
