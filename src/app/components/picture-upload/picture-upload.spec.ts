import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureUpload } from './picture-upload';
import { FormControl, FormGroup } from '@angular/forms';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { currentUserReducer } from '../../state/current-user.reducer';

let parentGroup: FormGroup;
const controlName = 'testControl';

describe('PictureUpload', () => {
  let component: PictureUpload;
  let fixture: ComponentFixture<PictureUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictureUpload],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        MessageService,
      ],
    }).compileComponents();

    parentGroup = new FormGroup({
      testControl: new FormControl([]),
    });
    fixture = TestBed.createComponent(PictureUpload);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('parentGroup', parentGroup);
    fixture.componentRef.setInput('controlName', controlName);
    fixture.componentRef.setInput('id', 'test-id');
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

  it('should render picture upload form element', () => {
    const uploadFormElement = fixture.nativeElement.querySelector('app-picture-upload-formelement');
    expect(uploadFormElement).toBeTruthy();
  });
});
