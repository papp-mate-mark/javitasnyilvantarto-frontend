export default class JobSearchResponse {
  constructor(
    public personid?: number,
    public jobGroupid?: number,
    public jobid?: number,
    public personName?: string,
    public objectname?: string,
    public description?: string,
    public bringedin?: string,
    public done?: string,
    public pickup?: string
  ) {}
}
