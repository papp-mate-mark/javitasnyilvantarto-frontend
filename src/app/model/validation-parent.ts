import { FormGroup } from '@angular/forms';

export default class ValidationParent {
  constructor(public prefix: string, public formGroupArray: FormGroup[]) {}
}
