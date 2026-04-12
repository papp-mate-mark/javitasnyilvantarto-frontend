import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  untracked,
} from '@angular/core';
import { JobImageStore } from '../store/job-image.store';
import { JobImageService } from '../service/job-image.service';
import { ImageModule } from 'primeng/image';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DynamicSkeleton } from '../components/dynamic-skeleton/dynamic-skeleton';

@Component({
  selector: 'app-job-image',
  imports: [ImageModule, DynamicSkeleton],
  templateUrl: './job-image.component.html',
  styleUrl: './job-image.component.scss',
})
export class JobImageComponent {
  /**
   * Array of image IDs to display.
   */
  readonly imageIds: InputSignal<number[]> = input.required();
  protected readonly imageStore = inject(JobImageStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly jobImageService = inject(JobImageService);
  constructor() {
    effect(() => {
      const imageIds = this.imageIds();
      untracked(() => {
        const images = this.imageStore.thumbnails();
        imageIds.forEach((imgid) => {
          if (!images.get(imgid)) {
            this.imageStore.setThumbnailLoading(imgid, true);

            this.jobImageService
              .loadThumbnail(imgid)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe((imgBlob) => {
                const reader = new FileReader();
                reader.readAsDataURL(imgBlob);

                reader.onloadend = () => {
                  const base64 = reader.result as string;
                  this.imageStore.addThumbnail(imgid, base64);
                  this.imageStore.setThumbnailLoading(imgid, false);
                };
              });
          }
        });
      });
    });
  }

  loadFullImage(id: number) {
    const images = this.imageStore.images();

    if (!images.get(id)) {
      this.jobImageService
        .loadImage(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((imgBlob) => {
          const reader = new FileReader();
          reader.readAsDataURL(imgBlob);

          reader.onloadend = () => {
            const base64 = reader.result as string;
            this.imageStore.addImage(id, base64);
          };
        });
    }
  }
}
