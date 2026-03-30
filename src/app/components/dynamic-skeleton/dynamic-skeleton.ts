import { Component, input, InputSignal } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-dynamic-skeleton',
  imports: [SkeletonModule],
  templateUrl: './dynamic-skeleton.html',
  styleUrl: './dynamic-skeleton.scss',
})
export class DynamicSkeleton {
  /**
   * Wheter to show a skeleton instead of the content.
   */
  readonly showSkeleton: InputSignal<boolean> = input(false);
}
