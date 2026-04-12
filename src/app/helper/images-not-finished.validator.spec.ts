import { FormControl } from '@angular/forms';
import ImageWithId from '../model/image-with-id';
import { imagesNotFinishedValidator } from './images-not-finished.validator';

describe('imagesNotFinishedValidator', () => {
  it('returns null for empty arrays', () => {
    const control = new FormControl<ImageWithId[]>([], {
      nonNullable: true,
      validators: [imagesNotFinishedValidator()],
    });

    control.updateValueAndValidity();
    expect(control.errors).toBeNull();
  });

  it('returns null when all image ids are non-null', () => {
    const control = new FormControl<ImageWithId[]>([new ImageWithId(1, 'x')], {
      nonNullable: true,
      validators: [imagesNotFinishedValidator()],
    });

    control.updateValueAndValidity();
    expect(control.errors).toBeNull();
  });

  it('sets notFinished error and marks dirty when any image id is null', () => {
    // Create the control first, then attach the validator.
    // (Angular may execute validators during construction, which would mark dirty immediately.)
    const control = new FormControl<ImageWithId[]>([new ImageWithId(null, 'x')], {
      nonNullable: true,
    });

    expect(control.dirty).toBeFalse();

    control.setValidators([imagesNotFinishedValidator()]);
    control.updateValueAndValidity();

    expect(control.hasError('notFinished')).toBeTrue();
    expect(control.dirty).toBeTrue();
  });
});
