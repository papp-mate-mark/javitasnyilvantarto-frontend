import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSearch } from './job-search';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { routes } from '../../app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('JobSearch', () => {
  let component: JobSearch;
  let fixture: ComponentFixture<JobSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSearch],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter(routes),
        MessageService,
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
