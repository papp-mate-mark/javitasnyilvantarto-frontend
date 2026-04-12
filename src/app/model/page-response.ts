export default class PageResponse<T> {
  constructor(
    public content: T[],
    public totalElements: number,
    public totalPages: number,
    public page: number,
    public size: number,
    public first: boolean,
    public last: boolean
  ) {}
}
