export class JobComplete {
  constructor(
    public price?: number,
    public note?: string,
    public date?: string,
    public imagesAfter?: number[]
  ) {}
}
