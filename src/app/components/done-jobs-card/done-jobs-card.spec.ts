import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneJobsCard } from './done-jobs-card';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('DoneJobsCard', () => {
  let component: DoneJobsCard;
  let fixture: ComponentFixture<DoneJobsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneJobsCard],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DoneJobsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
