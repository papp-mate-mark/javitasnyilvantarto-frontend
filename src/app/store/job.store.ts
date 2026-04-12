import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import PageResponse from '../model/page-response';
import JobSearchResponse from '../model/job-search-response';
import {
  initialValidationState,
  ValidationState,
  withValidationOperations,
} from '../service/form-validation';

interface JobState extends ValidationState {
  jobs: PageResponse<JobSearchResponse>;
  jobsLoading: boolean;
}

const initialState: JobState = {
  jobs: {} as PageResponse<JobSearchResponse>,
  jobsLoading: false,
  ...initialValidationState,
};
export const JobStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withValidationOperations(),
  withMethods((store) => ({
    setJobs(jobs: PageResponse<JobSearchResponse>) {
      patchState(store, { jobs });
    },
    setJobsLoading(jobsLoading: boolean) {
      patchState(store, { jobsLoading });
    },
  }))
);
