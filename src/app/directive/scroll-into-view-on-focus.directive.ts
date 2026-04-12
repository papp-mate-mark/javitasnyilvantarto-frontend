import { Directive, HostListener } from '@angular/core';
import { scrollIntoViewHelper } from '../helper/scroll-into-view.helper';

@Directive({
  selector: '[appScrollIntoViewOnFocus]',
  standalone: true,
})
export class ScrollIntoViewOnFocusDirective {
  @HostListener('focus', ['$event.target'])
  onFocus(target: EventTarget | null) {
    if (target instanceof HTMLElement) {
      scrollIntoViewHelper(target);
    }
  }
}
