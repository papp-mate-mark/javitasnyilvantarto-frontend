import { WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import ImageWithId from './image-with-id';

export default class NewJobFormData {
  constructor(
    public beforeImages: WritableSignal<ImageWithId[]>,
    public afterImages: WritableSignal<ImageWithId[]>,
    public formGroup: FormGroup
  ) {}
}
