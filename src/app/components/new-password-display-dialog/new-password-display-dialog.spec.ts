import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordDisplayDialog } from './new-password-display-dialog';

describe('NewPasswordDisplayDialog', () => {
  let component: NewPasswordDisplayDialog;
  let fixture: ComponentFixture<NewPasswordDisplayDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordDisplayDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPasswordDisplayDialog);
    component = fixture.componentInstance;
    component.dialogVisible.set(false);
    fixture.componentRef.setInput('password', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
