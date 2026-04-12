export default class InProgressJobRowData {
  constructor(
    public personId: number,
    public jobId: number,
    public name: string,
    public object: string,
    public description: string,
    public upload: Date,
    public deadLine: Date
  ) {}
}
