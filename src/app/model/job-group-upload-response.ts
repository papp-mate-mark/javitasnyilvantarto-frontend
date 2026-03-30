export default class JobGroupUploadResponse {
  constructor(
    public groupId: number,
    public receiptGenerated = false,
  ) {}
}
