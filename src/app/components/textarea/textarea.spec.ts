import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Textarea } from './textarea';

let parentGroup: FormGroup;
const controlName = 'testControl';

describe('Textarea', () => {
  let component: Textarea;
  let fixture: ComponentFixture<Textarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textarea],
    }).compileComponents();

    fixture = TestBed.createComponent(Textarea);
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

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.disabled).toBeTrue();
  });

  it('should display the correct label', () => {
    const labelText = 'test label';
    fixture.componentRef.setInput('label', labelText);
    fixture.detectChanges();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain(labelText);
  });

  it('should update value in the form control when textarea value changes', () => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    const testValue = 'secret';
    textarea.value = testValue;
    textarea.dispatchEvent(new Event('input'));
    textarea.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(parentGroup.get(controlName)?.value).toBe(testValue);
  });

  it('should update textarea value when form control value changes', () => {
    const testValue = 'secret';
    parentGroup.get(controlName)?.setValue(testValue);
    fixture.detectChanges();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.value).toBe(testValue);
  });

  it('should emit searchChanged on input with debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.searchChanged, 'emit');
    const testValue1 = 'first';
    const testValue2 = 'second';
    parentGroup.get(controlName)?.setValue(testValue1);
    tick(300); //since debounce is 500ms, emit should not have been called yet
    parentGroup.get(controlName)?.setValue(testValue2);
    tick(500);
    expect(searchSpy).toHaveBeenCalledOnceWith(testValue2);
  }));
});
