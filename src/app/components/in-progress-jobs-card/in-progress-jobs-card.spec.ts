import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressJobsCard } from './in-progress-jobs-card';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('InProgressJobsCard', () => {
  let component: InProgressJobsCard;
  let fixture: ComponentFixture<InProgressJobsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InProgressJobsCard],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InProgressJobsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
