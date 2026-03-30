import JobGorupUpload from './job-group-upload';
import JobUpload from './jobupload';

export default class PersonUpload extends JobGorupUpload {
  constructor(
    public name?: string,
    public address?: string,
    public phone?: string,
    deadline?: string,
    jobs?: JobUpload[],
    bringin?: string
  ) {
    super(deadline, jobs, bringin);
  }
}
