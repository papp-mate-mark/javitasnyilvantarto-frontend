import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobImageComponent } from './job-image.component';
import { testHttpClientProviders } from '../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('JobImageComponent', () => {
  let component: JobImageComponent;
  let fixture: ComponentFixture<JobImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobImageComponent],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobImageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('imageIds', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
