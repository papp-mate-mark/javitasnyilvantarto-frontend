import { JobStatus } from './enums/job-status';

export default class JobTableData {
  constructor(
    public jobId: number,
    public object: string,
    public bringedin: string,
    public pickup: string | null,
    public status: JobStatus
  ) {}
}
