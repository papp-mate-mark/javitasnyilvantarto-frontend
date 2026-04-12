import {
  ChangeDetectorRef,
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
import { FormControl, FormGroup } from '@angular/forms';
import { DatePicker } from '../date-picker/date-picker';
import { PriceInput } from '../price-input/price-input';
import { TextInput } from '../text-input/text-input';
import { JobService } from '../../service/job.service';
import { JobComplete } from '../../model/job-complete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JobGroupService } from '../../service/job-group.service';
import { finalize, switchMap, tap } from 'rxjs';
import { JobGroupStore } from '../../store/job-group.store';
import { validationErrorValidator } from '../../service/form-validation';
import ImageWithId from '../../model/image-with-id';
import { imagesNotFinishedValidator } from '../../helper/images-not-finished.validator';
import { JobStore } from '../../store/job.store';
import { serializeNullableDateToLocalOffsetString } from '../../helper/date-formatter';
import { PictureUpload } from '../picture-upload/picture-upload';

@Component({
  selector: 'app-set-to-done-dialog',
  imports: [SubmitDialog, DatePicker, PriceInput, TextInput, PictureUpload],
  templateUrl: './set-to-done-dialog.html',
  styleUrl: './set-to-done-dialog.scss',
})
export class SetToDoneDialog {
  /**
   * Two-way binding for dialog visibility state.
   */
  readonly dialogVisible: ModelSignal<boolean> = model.required();
  /**
   * The job ID to complete.
   */
  readonly jobId: InputSignal<number | undefined> = input();
  /**
   * The job name to display in the dialog.
   */
  readonly jobName: InputSignal<string | undefined> = input();
  protected readonly images = signal<ImageWithId[]>([]);
  private readonly jobService = inject(JobService);
  private readonly jobGroupService = inject(JobGroupService);
  private readonly jobGroupStore = inject(JobGroupStore);
  private readonly jobStore = inject(JobStore);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly dialogTitle = computed(
    () =>
      $localize`:@@setToDoneDialog.title:Are you sure you want to change the status of ${this.jobName()}'s job to done?`,
  );

  readonly parentGroup = new FormGroup({
    finishDateControl: new FormControl<string | undefined>(undefined, [
      validationErrorValidator(this.jobStore.validationMessages, 'date'),
    ]),
    finalPriceControl: new FormControl<number | undefined>(undefined, [
      validationErrorValidator(this.jobStore.validationMessages, 'price'),
    ]),
    noteControl: new FormControl(),
    pictureUploadControl: new FormControl<ImageWithId[]>([], {
      nonNullable: true,
      validators: [imagesNotFinishedValidator()],
    }),
  });

  updateControls() {
    this.parentGroup.get('finishDateControl')?.updateValueAndValidity();
    this.parentGroup.get('finalPriceControl')?.updateValueAndValidity();
    this.parentGroup.get('pictureUploadControl')?.updateValueAndValidity();
  }

  submit() {
    this.jobStore.clearValidationErrors();
    this.updateControls();

    if (!this.parentGroup.valid) {
      return;
    }

    const jobData = new JobComplete(
      this.parentGroup.controls.finalPriceControl?.value || undefined,
      this.parentGroup.controls.noteControl?.value || undefined,
      serializeNullableDateToLocalOffsetString(this.parentGroup.controls.finishDateControl?.value),
      this.parentGroup.controls.pictureUploadControl?.value?.map((img: ImageWithId) => img.id!) ||
        [],
    );

    const jobId = this.jobId();

    if (jobId !== undefined) {
      this.jobService
        .completeJob(jobId, jobData)
        .pipe(
          tap(() => {
            this.dialogVisible.set(false);
            this.jobGroupStore.setActiveJobsLoading(true);
          }),
          switchMap(() => this.jobGroupService.getActiveJobs()),
          finalize(() => this.updateControls()),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((value) => {
          this.jobGroupStore.setActiveJobs(value);
          this.jobGroupStore.setActiveJobsLoading(false);
        });
    }
  }
}
