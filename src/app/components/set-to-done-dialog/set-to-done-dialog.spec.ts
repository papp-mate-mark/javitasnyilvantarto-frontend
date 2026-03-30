import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetToDoneDialog } from './set-to-done-dialog';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('SetToDoneDialog', () => {
  let component: SetToDoneDialog;
  let fixture: ComponentFixture<SetToDoneDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetToDoneDialog],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SetToDoneDialog);
    component = fixture.componentInstance;
    component.dialogVisible.set(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
