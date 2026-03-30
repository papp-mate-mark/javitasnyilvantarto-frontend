export default class JobSearchParams {
  constructor(
    public name?: string,
    public address?: string,
    public phone?: string,
    public objectname?: string,
    public description?: string,
    public material?: string,
    public finalpricemin?: number,
    public finalpricemax?: number,
    public weightmin?: number,
    public weightmax?: number,
    public uploadstart?: Date,
    public uploadend?: Date,
    public donestart?: Date,
    public doneend?: Date,
    public pickupstart?: Date,
    public pickupend?: Date,
    public deadlinestart?: Date,
    public deadlineend?: Date,
    public donenote?: string,
    public uploadnote?: string,
    public onlywithphotos?: boolean,

  ) {}
}
