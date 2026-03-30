import { Component, DestroyRef, inject, forwardRef, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { tablerPlus } from '@ng-icons/tabler-icons';
import { FileUploadModule } from 'primeng/fileupload';
import { JobImageService } from '../../service/job-image.service';
import ImageWithId from '../../model/image-with-id';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
/* eslint-disable @typescript-eslint/no-explicit-any */
@Component({
  selector: 'app-picture-upload-formelement',
  imports: [FileUploadModule, ButtonModule, NgIcon],
  templateUrl: './picture-upload-formelement.html',
  styleUrl: './picture-upload-formelement.scss',
  providers: [
    provideIcons({ tablerPlus }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PictureUploadFormelement),
      multi: true,
    },
  ],
})
export class PictureUploadFormelement implements ControlValueAccessor {
  protected readonly images: WritableSignal<ImageWithId[]> = signal([]);
  protected readonly disabled: WritableSignal<boolean> = signal(false);
  //eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: ImageWithId[]) => void = () => {};

  //eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};
  private readonly imageService = inject(JobImageService);
  private readonly destroyRef = inject(DestroyRef);

  async handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const base64 = await this.toBase64(file);
    const newImage = new ImageWithId(null, base64);

    this.images.update((imgs) => [...imgs, newImage]);
    this.onChange(this.images());
    input.value = ''; // Clear the input value to allow re-uploading the same file
    this.onTouched();

    this.imageService
      .uploadImage(file)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.images.update((imgs) => imgs.filter((i) => i !== newImage)); // Remove the image on error, toast message is handled by the apiservice

          return throwError(() => err);
        }),
      )
      .subscribe((value) => {
        newImage.id = value;
        this.onChange(this.images());
      });
  }

  toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Remove an image when clicked
  removeImage(img: ImageWithId) {
    if (this.disabled()) return;

    if (img.id !== null) {
      this.imageService
        .deleteImage(img.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.images.update((imgs) => imgs.filter((i) => i !== img));
          this.onChange(this.images());
        });
    } else {
      this.images.update((imgs) => imgs.filter((i) => i !== img));
      this.onChange(this.images());
    }

    this.onTouched();
  }

  // Angular calls this to set values via formControl.setValue()
  writeValue(value: any): void {
    this.images.set(value ? [...value] : []);
    this.onChange(this.images());
  }

  registerOnChange(fn: (value: ImageWithId[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
