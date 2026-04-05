import { Component, DestroyRef, inject, input, model, signal } from '@angular/core';
import { SubmitDialog } from '../submit-dialog/submit-dialog';
import DoneJobRowData from '../../model/done-job-row-data';
import { DataTable } from '../data-table/data-table';
import Column from '../../model/column';
import { FormControl, FormGroup } from '@angular/forms';
import { validationErrorValidator } from '../../service/form-validation';
import { DatePicker } from '../date-picker/date-picker';
import { JobGroupService } from '../../service/job-group.service';
import JobPickedUp from '../../model/job-picked-up';
import { finalize, switchMap, tap } from 'rxjs';
import { JobGroupStore } from '../../store/job-group.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JobStore } from '../../store/job.store';
import { serializeNullableDateToLocalOffsetString } from '../../helper/date-formatter';
import { Dialog } from '../dialog/dialog';
import { Button } from 'primeng/button';
import { Severity } from '../../model/enums/severity';
import { JobService } from '../../service/job.service';
import { updateAndMarkInvalidDirty } from '../../helper/form-validation.helper';

@Component({
  selector: 'app-set-job-group-to-pickedup-confirmation-dialog',
  imports: [Dialog, DataTable, DatePicker, Button],
  templateUrl: './set-job-group-to-pickedup-confirmation-dialog.html',
  styleUrl: './set-job-group-to-pickedup-confirmation-dialog.scss',
})
export class SetJobGroupToPickedupConfirmationDialog {
  /**
   * Jobs in the group to be marked as picked up.
   */
  readonly jobs = input<DoneJobRowData[]>([]);
  /**
   * Dialog visibility state.
   */  
  readonly dialogVisible = model.required<boolean>();  
  /**
   * Whether the save operation is in progress.
   */
  readonly isSaving = signal(false);
  
  private readonly jobService = inject(JobService);
  readonly jobStore = inject(JobStore);
  private readonly jobGroupService = inject(JobGroupService);
  private readonly jobGroupStore = inject(JobGroupStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly columns = [
    new Column('object', $localize`:@@doneJobs.objectCol:Object`, false),
    new Column('description', $localize`:@@doneJobs.description:Job description`, false),
  ];

  protected readonly parentGroup = new FormGroup({
    pickedUpDateControl: new FormControl<string | undefined>(undefined, [
      validationErrorValidator(this.jobStore.validationMessages, 'date'),
    ]),
  });

  submitOne(){
    this.isSaving.set(true);
    updateAndMarkInvalidDirty(this.parentGroup);

    this.jobService
      .pickUpJob(
        this.jobs()[0].id,
        new JobPickedUp(
          serializeNullableDateToLocalOffsetString(
            this.parentGroup.controls['pickedUpDateControl'].value,
          ),
        ),
      )
      .pipe(
        tap(() => {
          this.dialogVisible.set(false);
          this.jobGroupStore.setActiveJobsLoading(true);
        }),
        switchMap(() => this.jobGroupService.getActiveJobs()),
        finalize(() => {
          this.isSaving.set(false);
          updateAndMarkInvalidDirty(this.parentGroup, true);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.jobGroupStore.setActiveJobs(value);
        this.jobGroupStore.setActiveJobsLoading(false);
      });
  }

  submitAll() {
    this.isSaving.set(true);
    updateAndMarkInvalidDirty(this.parentGroup);

    this.jobGroupService
      .pickUpJobGroup(
        this.jobs()[0].groupId,
        new JobPickedUp(
          serializeNullableDateToLocalOffsetString(
            this.parentGroup.controls['pickedUpDateControl'].value,
          ),
        ),
      )
      .pipe(
        tap(() => {
          this.dialogVisible.set(false);
          this.jobGroupStore.setActiveJobsLoading(true);
        }),
        switchMap(() => this.jobGroupService.getActiveJobs()),
        finalize(() => {
          updateAndMarkInvalidDirty(this.parentGroup, true);
          this.isSaving.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.jobGroupStore.setActiveJobs(value);
        this.jobGroupStore.setActiveJobsLoading(false);
      });
  }
  clearData(){
    this.parentGroup.reset();
  }
  protected readonly closeSeverity = Severity.SECONDARY;
  protected readonly saveOneSeverity = Severity.PRIMARY;
  protected readonly saveAllSeverity = Severity.WARN;
}
