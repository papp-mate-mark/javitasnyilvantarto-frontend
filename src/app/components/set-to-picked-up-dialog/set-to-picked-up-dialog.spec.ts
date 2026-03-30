import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetToPickedUpDialog } from './set-to-picked-up-dialog';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import DoneJobRowData from '../../model/done-job-row-data';

describe('SetToPickedUpDialog', () => {
  let component: SetToPickedUpDialog;
  let fixture: ComponentFixture<SetToPickedUpDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetToPickedUpDialog],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SetToPickedUpDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dialogVisible', true);
    fixture.componentRef.setInput(
      'job',
      new DoneJobRowData(1, 1, 'Test job', 'Obj', 'Desc', 0, new Date(), new Date(), 1)
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
