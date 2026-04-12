import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { ValidationFeedback } from './validation-feedback';

describe('ValidationFeedback', () => {
  let component: ValidationFeedback;
  let fixture: ComponentFixture<ValidationFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationFeedback],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationFeedback);
    component = fixture.componentInstance;

    const parentGroup = new FormGroup({
      testControl: new FormControl<string | null>(null),
    });
    fixture.componentRef.setInput('controlName', 'testControl');
    fixture.componentRef.setInput('parentGroup', parentGroup);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
