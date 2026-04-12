import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import ErrorMessage from '../model/error-message';
import { ActiveJobsRequestDTO } from '../model/active-jobs';
import { JobGroupStore } from '../store/job-group.store';
import { finalize } from 'rxjs';
import JobPickedUp from '../model/job-picked-up';
import { validateOnServerError } from './form-validation';
import { JobStore } from '../store/job.store';

@Injectable({
  providedIn: 'root',
})
export class JobGroupService {
  private readonly apiService = inject(ApiService);
  private readonly jobGroupStore = inject(JobGroupStore);
  private readonly jobStore = inject(JobStore);
  getActiveJobs() {
    this.jobGroupStore.setActiveJobsLoading(true);

    return this.apiService
      .getReq<ActiveJobsRequestDTO>(
        '/person/getActiveJobs',
        new ErrorMessage(
          $localize`:@@jobGroupService.activeJob.title:Active jobs`,
          $localize`:@@jobGroupService.activeJob.fetchFailed:Fetching active jobs failed`,
        ),
      )
      .pipe(finalize(() => this.jobGroupStore.setActiveJobsLoading(false)));
  }

  pickUpJobGroup(jobId: number, jobData: JobPickedUp) {
    return this.apiService
      .patchReq<void>(
        `/jobgroup/${jobId}/change-donejobs-to-pickedup`,
        new ErrorMessage(
          $localize`:@@jobService.pickupTitle:Job pickup`,
          $localize`:@@jobService.pickupFiailed:Changing job to "picked up" failed`,
        ),
        jobData,
      )
      .pipe(validateOnServerError(this.jobStore)); //TODO: Test if it works properly
  }

  getReceipt(groupId: number) {
    return this.apiService.getBlob(
      `/jobgroup/${groupId}/get-receipt`,
      new ErrorMessage(
        $localize`:@@jobGroupService.receiptDownloadFailedTitle:Receipt download`,
        $localize`:@@jobGroupService.receiptDownloadFailed:Downloading receipt failed`,
      ),
    );
  }
}
