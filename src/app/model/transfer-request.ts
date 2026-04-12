import { z } from 'zod';

export class ImageTransferRequest {
  constructor(
    public image?: string,
    public fullContentType?: string,
    public createTime?: string
  ) {}
}

export class JobTransferRequest {
  constructor(
    public description?: string,
    public objectname?: string,
    public material?: string,
    public weight?: number,
    public pricemin?: number,
    public pricemax?: number,
    public finalprice?: number,
    public done?: string,
    public pickup?: string,
    public uploadnote?: string,
    public finishnote?: string,
    public beforeImage?: ImageTransferRequest[],
    public afterImages?: ImageTransferRequest[]
  ) {}
}

export class JobGroupTransferRequest {
  constructor(
    public jobs?: JobTransferRequest[],
    public bringedin?: string,
    public deadline?: string
  ) {}
}

export default class TransferRequest {
  constructor(
    public name?: string,
    public address?: string,
    public phone?: string,
    public jobGroups?: JobGroupTransferRequest[]
  ) {}
}

export const ImageTransferRequestSchema = z.object({
  image: z.string().nullable().optional(),
  fullContentType: z.string().nullable().optional(),
  createTime: z.string().nullable().optional()
}).strict();

export const JobTransferRequestSchema = z.object({
  description: z.string().nullable().optional(),
  objectname: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  weight: z.number().nullable().optional(),
  pricemin: z.number().nullable().optional(),
  pricemax: z.number().nullable().optional(),
  finalprice: z.number().nullable().optional(),
  done: z.string().nullable().optional(),
  pickup: z.string().nullable().optional(),
  uploadnote: z.string().nullable().optional(),
  finishnote: z.string().nullable().optional(),
  beforeImage: z.array(ImageTransferRequestSchema).nullable().optional(),
  afterImages: z.array(ImageTransferRequestSchema).nullable().optional()
}).strict();

export const JobGroupTransferRequestSchema = z.object({
  jobs: z.array(JobTransferRequestSchema).nullable().optional(),
  bringedin: z.string().nullable().optional(),
  deadline: z.string().nullable().optional()
}).strict();

export const TransferRequestSchema = z.object({
  name: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  jobGroups: z.array(JobGroupTransferRequestSchema).nullable().optional()
}).strict();

