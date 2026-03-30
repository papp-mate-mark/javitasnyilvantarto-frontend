import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { CheckboxInput } from './checkbox-input';

let parentGroup: FormGroup;
const controlName = 'testControl';

describe('CheckboxInput', () => {
  let component: CheckboxInput;
  let fixture: ComponentFixture<CheckboxInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxInput);

    parentGroup = new FormGroup({
      testControl: new FormControl<boolean | null>(null),
    });
    fixture.componentRef.setInput('id', 'test-id');
    fixture.componentRef.setInput('controlName', controlName);
    fixture.componentRef.setInput('parentGroup', parentGroup);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be disabled when input is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(input.disabled).toBeTrue();
  });

  it('should display the correct label', () => {
    const labelText = 'test label';
    fixture.componentRef.setInput('label', labelText);
    fixture.detectChanges();

    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain(labelText);
  });

  it('should update value in the form control when checkbox value changes', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(parentGroup.get(controlName)?.value).toBeTrue();
  });

  it('should update checkbox value when form control value changes', () => {
    parentGroup.get(controlName)?.setValue(true);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    expect(input.checked).toBeTrue();
  });

  it('should emit searchChanged on input with debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.searchChanged, 'emit');
    parentGroup.get(controlName)?.setValue(true);
    tick(300); //since debounce is 500ms, emit should not have been called yet
    parentGroup.get(controlName)?.setValue(false);
    tick(500);

    expect(searchSpy).toHaveBeenCalledOnceWith(false);
  }));
});
