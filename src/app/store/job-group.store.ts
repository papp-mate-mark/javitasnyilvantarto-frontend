import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { ActiveJobsRequestDTO } from '../model/active-jobs';

interface JobGroupState {
  activeJobs: ActiveJobsRequestDTO;
  activeJobsLoading: boolean;
}

const initialState: JobGroupState = {
  activeJobs: {} as ActiveJobsRequestDTO,
  activeJobsLoading: false,
};
export const JobGroupStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setActiveJobs(activeJobs: ActiveJobsRequestDTO) {
      patchState(store, { activeJobs });
    },
    setActiveJobsLoading(activeJobsLoading: boolean) {
      patchState(store, { activeJobsLoading });
    },
  }))
);
