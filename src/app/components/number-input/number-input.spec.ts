import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { NumberInput } from './number-input';

let parentGroup: FormGroup;
const controlName = 'testControl';

describe('NumberInput', () => {
  let component: NumberInput;
  let fixture: ComponentFixture<NumberInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInput],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberInput);
    component = fixture.componentInstance;

    parentGroup = new FormGroup({
      testControl: new FormControl<number | null>(null),
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
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const testValue = 10;
    input.value = testValue.toString();
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(parentGroup.get(controlName)?.value).toBe(testValue);
  });

  it('should update input value when form control value changes', () => {
    const testValue = 40;
    parentGroup.get(controlName)?.setValue(testValue);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toContain(testValue.toString());
  });

  it('should emit searchChanged on input with debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.searchChanged, 'emit');
    const testValue1 = 10;
    const testValue2 = 20;
    parentGroup.get(controlName)?.setValue(testValue1);
    tick(300); //since debounce is 500ms, emit should not have been called yet
    parentGroup.get(controlName)?.setValue(testValue2);
    tick(500);
    expect(searchSpy).toHaveBeenCalledOnceWith(testValue2);
  }));
});
