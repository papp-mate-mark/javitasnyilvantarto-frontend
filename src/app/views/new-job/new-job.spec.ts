import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJob } from './new-job';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('NewJob', () => {
  let component: NewJob;
  let fixture: ComponentFixture<NewJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewJob],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
