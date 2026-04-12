import { FullJob } from './full-job';

export class FullJobGroup {
  constructor(
    public id: number,
    public jobs: FullJob[],
    public deadline: string, // ISO date string
    public bringedin: string // ISO date string
  ) {}
}
