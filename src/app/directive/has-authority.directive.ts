import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, OnInit, Renderer2, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserAuthorites } from '../model/user-autorities';
import { checkAuthority } from '../helper/authority-helper';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasAuthority]',
  standalone: true,
})
export class HasAuthorityDirective implements OnInit {
  /**
   * Required authority to enable the host element.
   */
  hasAuthority = input<UserAuthorites | null | undefined>(undefined);
  /**
   * Tooltip text shown when the user lacks the required authority.
   */
  hasAuthorityTooltip = input<string | null | undefined>(undefined);
  //TODO: Improve toltip design

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly store = inject(Store);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    const requiredAuthority = this.hasAuthority();

    if (requiredAuthority && !checkAuthority(this.store, requiredAuthority)) {
      const host = this.elementRef.nativeElement;
      const parent = host.parentNode;
      if (!parent) return;

      const container = this.renderer.createElement('span');
      this.renderer.addClass(container, 'has-authority-container');

      const wrapper = this.renderer.createElement('fieldset');
      this.renderer.setAttribute(wrapper, 'disabled', 'true');
      this.renderer.addClass(wrapper, 'has-authority-disabled-wrapper');

      this.renderer.insertBefore(parent, container, host);
      this.renderer.appendChild(container, wrapper);
      this.renderer.appendChild(wrapper, host);

      const tooltip = this.renderer.createElement('div');
      this.renderer.addClass(tooltip, 'has-authority-tooltip');

      const message = $localize`:@@hasAuthority.tooltip:You do not have the required permissions for this task.`;
      this.renderer.appendChild(tooltip, this.renderer.createText(message));

      this.renderer.appendChild(this.document.body, tooltip);

      this.elementRef.nativeElement.addEventListener('mouseenter', () => {
        const hostPos = host.getBoundingClientRect();
        const offsetPx = 16;

        let top = hostPos.bottom + offsetPx;
        let left = hostPos.left;

        const tooltipPos = tooltip.getBoundingClientRect();
        const padding = 8;
        const maxLeft = Math.max(padding, window.innerWidth - tooltipPos.width - padding);
        left = Math.min(Math.max(left, padding), maxLeft);

        const wouldOverflowBottom = top + tooltipPos.height + padding > window.innerHeight;

        if (wouldOverflowBottom) {
          top = Math.max(padding, hostPos.top - tooltipPos.height - offsetPx);
        }

        this.renderer.setStyle(tooltip, 'top', `${Math.round(top)}px`);
        this.renderer.setStyle(tooltip, 'left', `${Math.round(left)}px`);
        this.renderer.setStyle(tooltip, 'visibility', 'visible');
      });

      this.elementRef.nativeElement.addEventListener('mouseleave', () => {
        this.renderer.setStyle(tooltip, 'visibility', 'hidden');
      });
    }
  }
}
