export default class DoneJobRowData {
  constructor(
    public personId: number,
    public id: number,
    public name: string,
    public object: string,
    public description: string,
    public finalPrice: number,
    public upload: Date,
    public finishDate: Date,
    public groupId: number
  ) {}
}
