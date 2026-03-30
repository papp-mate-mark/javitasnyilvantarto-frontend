import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Job } from './job';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { testHttpClientProviders } from '../../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../../state/current-user.reducer';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('Job', () => {
  let component: Job;
  let fixture: ComponentFixture<Job>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Job],
      providers: [
        provideRouter(routes),
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Job);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
