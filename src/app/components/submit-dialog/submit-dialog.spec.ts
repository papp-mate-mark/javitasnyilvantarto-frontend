import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitDialog } from './submit-dialog';

describe('SubmitDialog', () => {
  let component: SubmitDialog;
  let fixture: ComponentFixture<SubmitDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitDialog);
    component = fixture.componentInstance;
    component.dialogVisible.set(false);
    fixture.componentRef.setInput('dialogTitle', 'Test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
