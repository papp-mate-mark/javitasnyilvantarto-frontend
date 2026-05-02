import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { ValidationFeedback } from './validation-feedback';

describe('ValidationFeedback', () => {
  let component: ValidationFeedback;
  let fixture: ComponentFixture<ValidationFeedback>;
  let parentGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationFeedback],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationFeedback);
    component = fixture.componentInstance;

    parentGroup = new FormGroup({
      testControl: new FormControl<string | null>(null),
    });
    fixture.componentRef.setInput('controlName', 'testControl');
    fixture.componentRef.setInput('parentGroup', parentGroup);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render message when `errorMessages` is set', () => {
    (component as any).errorMessages.set(['This field is required.']);

    fixture.detectChanges();

    const p: HTMLElement | null = fixture.nativeElement.querySelector('p');
    expect(p).toBeTruthy();
    expect(p!.textContent).toContain('This field is required.');
  });

  it('should not render when `errorMessages` is undefined', () => {
    (component as any).errorMessages.set(undefined);

    fixture.detectChanges();

    const p: HTMLElement | null = fixture.nativeElement.querySelector('p');
    expect(p).toBeFalsy();
  });
});
