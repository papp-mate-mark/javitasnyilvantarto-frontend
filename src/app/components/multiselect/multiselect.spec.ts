import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Multiselect } from './multiselect';

let parentGroup: FormGroup;
const controlName = 'testControl';

enum TestEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

describe('Multiselect', () => {
  let component: Multiselect<TestEnum>;
  let fixture: ComponentFixture<Multiselect<TestEnum>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Multiselect],
    }).compileComponents();

    fixture = TestBed.createComponent(Multiselect<TestEnum>);
    component = fixture.componentInstance;

    parentGroup = new FormGroup({
      testControl: new FormControl<string[] | null>(null),
    });
    fixture.componentRef.setInput('id', 'test-id');
    fixture.componentRef.setInput('controlName', 'testControl');
    fixture.componentRef.setInput('parentGroup', parentGroup);

    fixture.componentRef.setInput('optionLabel', 'label');
    fixture.componentRef.setInput('optionValue', 'value');
    fixture.componentRef.setInput('options', [
      { label: 'Admin', name: 'Admin', value: 'ADMIN' },
      { label: 'User', name: 'User', value: 'USER' },
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be disabled when input is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(parentGroup.get(controlName)?.disabled).toBeTrue();
  });

  it('should display the correct label', () => {
    const labelText = 'test label';
    fixture.componentRef.setInput('label', labelText);
    fixture.detectChanges();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain(labelText);
  });

  it('should update value in the form control when input value changes', () => {
    const testValue = ['ADMIN'];
    parentGroup.get(controlName)?.setValue(testValue);
    fixture.detectChanges();
    expect(parentGroup.get(controlName)?.value).toEqual(testValue);
  });

  it('should update input value when form control value changes', () => {
    const testValue = ['USER'];
    parentGroup.get(controlName)?.setValue(testValue);
    fixture.detectChanges();
    expect(parentGroup.get(controlName)?.value).toEqual(testValue);
  });

  it('should emit searchChanged on input with debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.searchChanged, 'emit');
    const testValue1 = ['ADMIN'];
    const testValue2 = ['USER'];
    parentGroup.get(controlName)?.setValue(testValue1);
    tick(300); //since debounce is 500ms, emit should not have been called yet
    parentGroup.get(controlName)?.setValue(testValue2);
    tick(500);
    expect(searchSpy).toHaveBeenCalledOnceWith(testValue2);
  }));

  it('should display the placeholder text from input', () => {
    const placeholderText = 'Select your roles';
    fixture.componentRef.setInput('placeholder', placeholderText);
    fixture.detectChanges();
    const pMultiselectElement = fixture.debugElement.query(
      el => el.nativeElement.tagName === 'P-MULTISELECT'
    );
    expect(pMultiselectElement.componentInstance.placeholder()).toBe(placeholderText);
  });
});
