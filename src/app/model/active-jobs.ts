interface InProgressJob {
  id: number;
  description: string;
  objectname: string;
  pricemin: number;
  pricemax: number;
}

interface DoneJob {
  id: number;
  description: string;
  objectname: string;
  finalPrice: number;
  finishTime: string; // Use string for ISO datetime from backend
}

interface JobGroup {
  groupId: number;
  personId: number;
  personname: string;
  uploadDate: string; // ISO datetime
  deadline: string; // ISO datetime
  inProgressJobs: InProgressJob[];
  doneJobs: DoneJob[];
}

export interface ActiveJobsRequestDTO {
  groups: JobGroup[];
}
