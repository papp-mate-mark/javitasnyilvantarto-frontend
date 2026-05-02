import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasAuthorityDirective } from './has-authority.directive';
import { Store } from '@ngrx/store';
import { UserAuthorites } from '../model/user-autorities';

@Component({
  standalone: true,
  imports: [HasAuthorityDirective],
  template: `<button hasAuthority [hasAuthority]="required">Click</button>`,
})
class TestHost {
  required = UserAuthorites.MODIFY_JOBS;
}

const removeAuthorityTooltips = (): void => {
  document.body.querySelectorAll('.has-authority-tooltip').forEach((node) => node.remove());
};

describe('HasAuthorityDirective', () => {
  let fixture: ComponentFixture<TestHost>;

  afterEach(() => {
    removeAuthorityTooltips();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        {
          provide: Store,
          useValue: {
            selectSignal: (_: any) => () => false,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('wraps host and adds tooltip when authority missing', () => {
    const container = fixture.nativeElement.querySelector('.has-authority-container');
    expect(container).toBeTruthy();

    const wrapper = container.querySelector('fieldset.has-authority-disabled-wrapper');
    expect(wrapper).toBeTruthy();
    expect(wrapper.hasAttribute('disabled')).toBeTrue();

    const tooltip = document.body.querySelector('.has-authority-tooltip');
    expect(tooltip).toBeTruthy();
    expect((tooltip as HTMLElement).textContent).toContain('You do not have the required permissions');
  });

  it('keeps the original host inside the disabled wrapper', () => {
    const container = fixture.nativeElement.querySelector('.has-authority-container');
    const wrapper = container.querySelector('fieldset.has-authority-disabled-wrapper');
    const hostButton = wrapper.querySelector('button');

    expect(hostButton).toBeTruthy();
    expect((hostButton as HTMLElement).textContent).toContain('Click');
  });
});

describe('HasAuthorityDirective when user has required authority', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    removeAuthorityTooltips();

    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        {
          provide: Store,
          useValue: {
            selectSignal: (_: any) => () => true,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    removeAuthorityTooltips();
  });

  it('does not wrap host and does not add tooltip', () => {
    const container = fixture.nativeElement.querySelector('.has-authority-container');
    expect(container).toBeFalsy();

    const tooltip = document.body.querySelector('.has-authority-tooltip');
    expect(tooltip).toBeFalsy();

    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.closest('fieldset')).toBeFalsy();
  });
});
