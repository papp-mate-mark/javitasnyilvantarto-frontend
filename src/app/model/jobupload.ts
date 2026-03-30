export default class JobUpload {
  constructor(
    public objectname?: string,
    public description?: string,
    public material?: string,
    public pricemin?: number,
    public pricemax?: number,
    public weight?: number,
    public finishTime?: string,
    public pickedUpTime?: string,
    public finalPrice?: number,
    public uploadnote?: string,
    public finishnote?: string,
    public imagesBefore?: number[],
    public imagesAfter?: number[]
  ) {}
}
