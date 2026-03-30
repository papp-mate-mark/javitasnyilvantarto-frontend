import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import ErrorMessage from '../model/error-message';
import { JobComplete } from '../model/job-complete';
import { finalize, Observable } from 'rxjs';
import { validateOnServerError } from './form-validation';
import JobPickedUp from '../model/job-picked-up';
import JobSearchParams from '../model/job-search-params';
import Pageable, { toPageableParams } from '../model/pageable';
import { JobStore } from '../store/job.store';
import PageResponse from '../model/page-response';
import JobSearchResponse from '../model/job-search-response';
import { toHttpParams } from '../helper/to-http-params';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly apiService = inject(ApiService);
  private readonly jobStore = inject(JobStore);

  completeJob(jobId: number, jobData: JobComplete) {
    return this.apiService
      .patchReq<void>(
        `/jobs/${jobId}/change-to-done`,
        new ErrorMessage(
          $localize`:@@jobService.completeTitle:Complete Job`,
          $localize`:@@jobService.completeFailed:Changing job to "done" failed`
        ),
        jobData
      )
      .pipe(validateOnServerError(this.jobStore));
  }

  pickUpJob(jobId: number, jobData: JobPickedUp) {
    return this.apiService
      .patchReq<void>(
        `/jobs/${jobId}/change-to-pickedup`,
        new ErrorMessage(
          $localize`:@@jobService.pickupTitle:Job pickup`,
          $localize`:@@jobService.pickupFiailed:Changing job to "picked up" failed`
        ),
        jobData
      )
      .pipe(validateOnServerError(this.jobStore));
  }

  searchJobs(params: JobSearchParams, pageable: Pageable) {
    this.jobStore.setJobsLoading(true);

    return this.apiService
      .getReq<PageResponse<JobSearchResponse>>(
        `/jobs/fullsearch`,
        new ErrorMessage(
          $localize`:@@jobService.searchTitle:Job search`,
          $localize`:@@jobService.searchFailed:Searching jobs failed`
        ),
        toHttpParams({ ...toPageableParams(pageable), ...params })
      )
      .pipe(
        finalize(() => {
          this.jobStore.setJobsLoading(false);
        })
      );
  }

  getJobSummary(jobId: number): Observable<Blob> {
    return this.apiService.getBlob(
      `/jobs/${jobId}/summary`,
      new ErrorMessage(
        $localize`:@@jobService.summaryTitle:Job summary`,
        $localize`:@@jobService.summaryFailed:Downloading job summary failed`
      )
    );
  }

  deleteJob(jobId: number) {
    return this.apiService.deleteReq<void>(
      `/jobs/${jobId}`,
      new ErrorMessage(
        $localize`:@@jobService.deleteTitle:Delete Job`,
        $localize`:@@jobService.deleteFailed:Deleting job failed`
      )
    );
  }
}
