import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveJobs } from './active-jobs';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('ActiveJobs', () => {
  let component: ActiveJobs;
  let fixture: ComponentFixture<ActiveJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveJobs],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
