import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordDialog } from './new-password-dialog';

describe('NewPasswordDialog', () => {
  let component: NewPasswordDialog;
  let fixture: ComponentFixture<NewPasswordDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPasswordDialog);
    component = fixture.componentInstance;
    component.dialogVisible.set(false);
    fixture.componentRef.setInput('password', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
