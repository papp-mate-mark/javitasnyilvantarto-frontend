import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonStore } from '../../../store/person.store';
import { PersonData } from '../../../components/person-data/person-data';
import { JobInfoTable } from '../../../components/job-info-table/job-info-table';
import { FullPersonData } from '../../../model/full-person-data';
import { PageTitle } from '../../../model/enums/PageTitle';
import { ButtonModule } from 'primeng/button';
import { Severity } from '../../../model/enums/severity';
import { JobGroupService } from '../../../service/job-group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JobImageComponent } from '../../../job-image.component/job-image.component';
import { openBlobInNewTab } from '../../../helper/open-blob-in-new-tab.helper';
import { FullJob } from '../../../model/full-job';
import { CardModule } from 'primeng/card';
import { JobService } from '../../../service/job.service';
import { AppConfirmationService } from '../../../service/confirmation.service';
import { HasAuthorityDirective } from '../../../directive/has-authority.directive';
import { UserAuthorites } from '../../../model/user-autorities';
import { AppMessageService } from '../../../service/app-message.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-job',
  imports: [
    PersonData,
    JobInfoTable,
    ButtonModule,
    JobImageComponent,
    CardModule,
    HasAuthorityDirective,
  ],
  templateUrl: './job.html',
  styleUrl: './job.scss',
})
export class Job implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly personStore = inject(PersonStore);
  protected readonly appMessageService = inject(AppMessageService);
  private readonly jobGroupService = inject(JobGroupService);
  private readonly jobService = inject(JobService);
  private readonly confirmService = inject(AppConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly jobIdStr = this.route.snapshot.paramMap.get('jobId');
  protected readonly generating = signal(false);
  protected readonly requiredDeleteAuthority = UserAuthorites.MODIFY_JOBS;
  protected readonly jobId = signal<number | undefined>(undefined);

  private personId = this.route.snapshot.paramMap.get('personId');
  //TODO: Add buttons to modify the status of the job.
  ngOnInit(): void {
    if (this.jobIdStr && !isNaN(+this.jobIdStr)) {
      this.jobId.set(+this.jobIdStr);
    } else {
      const personId = this.personStore.person().id;
      this.personStore.setPerson({} as FullPersonData);
      let navigateTo = ['/'];

      if (personId) {
        navigateTo = [PageTitle.PERSON_INFO, personId.toString()];
      }

      this.router.navigate(navigateTo);
    }
  }

  deleteSeverity = Severity.DANGER;
  protected readonly beforeImages = computed(() => {
    const person = this.personStore.person();
    const jobId = this.jobId();
    let images: number[] = [];

    if (person && jobId) {
      const job = this.findJobById(person, jobId);

      if (job) {
        images = job.beforeImage.map((img) => img.id);
      }
    }

    return images;
  });

  protected readonly afterImages = computed(() => {
    const person = this.personStore.person();
    const jobId = this.jobId();
    let images: number[] = [];

    if (person && jobId) {
      const job = this.findJobById(person, jobId);

      if (job) {
        images = job.afterImages.map((img) => img.id);
      }
    }

    return images;
  });

  printReceiptPressed() {
    const groupId = this.personStore
      .person()
      .jobGroups.find((g) => g.jobs.find((j) => j.id == this.jobId()))?.id;

    this.generating.set(true);

    this.jobGroupService
      .getReceipt(groupId!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.generating.set(false)),
      )

      .subscribe((blob) => {
        openBlobInNewTab(blob);
      });
  }

  printSummaryPressed() {
    const jobId = this.jobId();
    this.generating.set(true);
    this.appMessageService.info(
      $localize`:@@job.generatingJobSummary:Job summary`,
      $localize`:@@job.generatingJobSummary:Started generating job summary, please wait`,
    );
    this.jobService
      .getJobSummary(jobId!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.generating.set(false)),
      )
      .subscribe((blob) => {
        openBlobInNewTab(blob);
      });
  }

  deleteJobPressed() {
    this.confirmService.proceed(
      () => {
        this.jobService
          .deleteJob(this.jobId()!)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            const personId = this.personStore.person().id;
            this.personStore.setPerson({} as FullPersonData);
            this.router.navigate([PageTitle.PERSON_INFO, personId]);
          });
      },
      undefined,
      $localize`:@@job.deleteJobConfirm:Are you sure you want to delete this job? This action cannot be undone.`,
      $localize`:@@job.deleteJobTitle:Job deletion`,
    );
  }

  findJobById = (person: FullPersonData, jobId: number): FullJob | undefined => {
    let returnVal = undefined;

    if (person.jobGroups) {
      returnVal = person.jobGroups.flatMap((group) => group.jobs).find((job) => job.id === jobId);
    }

    return returnVal;
  };
}
