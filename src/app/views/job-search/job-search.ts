import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { JobSearchFilter } from '../../components/job-search-filter/job-search-filter';
import JobSearchParams from '../../model/job-search-params';
import Pageable from '../../model/pageable';
import { JobSearchTable } from '../../components/job-search-table/job-search-table';
import { JobStore } from '../../store/job.store';
import { JobService } from '../../service/job.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-job-search',
  imports: [JobSearchFilter, JobSearchTable],
  templateUrl: './job-search.html',
  styleUrl: './job-search.scss',
})
export class JobSearch implements OnInit {
  private readonly searchData = signal<JobSearchParams>({} as JobSearchParams);
  private readonly pageOptions = signal<Pageable>(new Pageable());
  private readonly jobStore = inject(JobStore);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly jobService = inject(JobService);

  ngOnInit(): void {
    this.fetchJobs();
  }

  filterChanged(newFilter: JobSearchParams) {
    this.searchData.set(newFilter);
    this.fetchJobs();
  }

  pageOptionsChanged(event: Pageable) {
    this.pageOptions.set(event);
    this.fetchJobs();
  }

  fetchJobs() {
    this.jobService
      .searchJobs(this.searchData(), this.pageOptions())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.jobStore.setJobs(value));
  }
}
