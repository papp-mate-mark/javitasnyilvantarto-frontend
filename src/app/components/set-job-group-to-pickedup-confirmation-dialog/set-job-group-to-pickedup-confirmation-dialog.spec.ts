import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetJobGroupToPickedupConfirmationDialog } from './set-job-group-to-pickedup-confirmation-dialog';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('SetJobGroupToPickedupConfirmationDialog', () => {
  let component: SetJobGroupToPickedupConfirmationDialog;
  let fixture: ComponentFixture<SetJobGroupToPickedupConfirmationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetJobGroupToPickedupConfirmationDialog],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SetJobGroupToPickedupConfirmationDialog);
    component = fixture.componentInstance;
    component.dialogVisible.set(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
