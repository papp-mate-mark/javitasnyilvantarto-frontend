import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { DatePicker } from './date-picker';

let parentGroup: FormGroup;
const controlName = 'testControl';

describe('DatePicker', () => {
  let component: DatePicker;
  let fixture: ComponentFixture<DatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePicker],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePicker);
    component = fixture.componentInstance;

    parentGroup = new FormGroup({
      testControl: new FormControl<string | null>(null),
    });
    fixture.componentRef.setInput('id', 'test-id');
    fixture.componentRef.setInput('controlName', 'testControl');
    fixture.componentRef.setInput('parentGroup', parentGroup);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be disabled when input is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBeTrue();
  });

  it('should display the correct label', () => {
    const labelText = 'test label';
    fixture.componentRef.setInput('label', labelText);
    fixture.detectChanges();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain(labelText);
  });

  it('should update value in the form control when input value changes', () => {
    const testValue = '2025-01-05T00:00';
    component.getFormElement()?.setValue(testValue);
    fixture.detectChanges();
    expect(parentGroup.get(controlName)?.value).toEqual(testValue);
  });

  it('should update input value when form control value changes', () => {
    const testValue = '2025-01-05T00:00';
    parentGroup.get(controlName)?.setValue(testValue);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe(testValue);
  });

  it('should emit searchChanged on input with debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.searchChanged, 'emit');
    const testValue1 = '2025-01-05T00:00';
    const testValue2 = '2025-01-10T00:00';
    parentGroup.get(controlName)?.setValue(testValue1);
    tick(300); //since debounce is 500ms, emit should not have been called yet
    parentGroup.get(controlName)?.setValue(testValue2);
    tick(500);
    expect(searchSpy).toHaveBeenCalledOnceWith(testValue2);
  }));
});
