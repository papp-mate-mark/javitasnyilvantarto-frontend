import { FullJobGroup } from './full-job-group';

export class FullPersonData {
  constructor(
    public id: number | null,
    public name: string | null,
    public phone: string | null,
    public address: string | null,
    public jobGroups: FullJobGroup[]
  ) {}
}
