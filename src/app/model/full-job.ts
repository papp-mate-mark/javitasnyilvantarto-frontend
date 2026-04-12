import { FullJobImageRequest } from './full-job-image';

export class FullJob {
  constructor(
    public id: number,
    public description: string,
    public finalprice: number,
    public objectname: string,
    public material: string,
    public weight: number,
    public pricemin: number,
    public pricemax: number | null,
    public uploadnote: string | null,
    public done: string | null, // ISO date string
    public finishnote: string | null,
    public pickup: string | null, // ISO date string
    public beforeImage: FullJobImageRequest[],
    public afterImages: FullJobImageRequest[]
  ) {}
}
