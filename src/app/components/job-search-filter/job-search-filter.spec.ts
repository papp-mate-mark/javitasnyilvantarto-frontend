import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSearchFilter } from './job-search-filter';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('JobSearchFilter', () => {
  let component: JobSearchFilter;
  let fixture: ComponentFixture<JobSearchFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSearchFilter],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(JobSearchFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
