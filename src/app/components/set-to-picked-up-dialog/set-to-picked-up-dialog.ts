import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  signal,
} from '@angular/core';
import { SubmitDialog } from '../submit-dialog/submit-dialog';
import { DatePicker } from '../date-picker/date-picker';
import JobPickedUp from '../../model/job-picked-up';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, switchMap, finalize } from 'rxjs';
import { validationErrorValidator } from '../../service/form-validation';
import { JobGroupService } from '../../service/job-group.service';
import { JobService } from '../../service/job.service';
import { JobGroupStore } from '../../store/job-group.store';
import DoneJobRowData from '../../model/done-job-row-data';
import { JobStore } from '../../store/job.store';
import { serializeNullableDateToLocalOffsetString } from '../../helper/date-formatter';

@Component({
  selector: 'app-set-to-picked-up-dialog',
  imports: [SubmitDialog, DatePicker],
  templateUrl: './set-to-picked-up-dialog.html',
  styleUrl: './set-to-picked-up-dialog.scss',
})
export class SetToPickedUpDialog {
  /**
   * Two-way binding for dialog visibility state.
   */
  readonly dialogVisible: ModelSignal<boolean> = model.required();
  /**
   * The job to mark as picked up.
   */
  readonly job: InputSignal<DoneJobRowData | undefined> = input();
  protected readonly images = signal<string[]>([]);
  private readonly jobService = inject(JobService);
  private readonly jobGroupService = inject(JobGroupService);
  private readonly jobGroupStore = inject(JobGroupStore);
  private readonly jobStore = inject(JobStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly dialogTitle = computed(
    () =>
      $localize`:@@setToPickedUp.title:Are you sure you want to change the status of ${
        this.job()?.name
      }'s job to "picked up"?`,
  );

  readonly parentGroup: FormGroup;

  constructor() {
    this.parentGroup = new FormGroup({
      pickedUpDateControl: new FormControl<string | undefined>(undefined, [
        validationErrorValidator(this.jobStore.validationMessages, 'date'),
      ]),
    });
  }

  submit() {
    this.jobStore.clearValidationErrors();
    this.parentGroup.controls['pickedUpDateControl'].updateValueAndValidity();

    if (!this.parentGroup.valid) {
      return;
    }

    const jobData = new JobPickedUp(
      serializeNullableDateToLocalOffsetString(this.parentGroup.get('pickedUpDateControl')?.value),
    );

    const job = this.job();

    if (job == undefined) {
      return;
    }

    this.jobService
      .pickUpJob(job.id, jobData)
      .pipe(
        tap(() => {
          this.dialogVisible.set(false);
          this.jobGroupStore.setActiveJobsLoading(true);
        }),
        switchMap(() => this.jobGroupService.getActiveJobs()),
        finalize(() => this.parentGroup.controls['pickedUpDateControl'].updateValueAndValidity()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.jobGroupStore.setActiveJobs(value);
        this.jobGroupStore.setActiveJobsLoading(false);
      });
  }
}
