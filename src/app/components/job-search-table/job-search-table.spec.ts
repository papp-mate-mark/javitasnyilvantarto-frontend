import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSearchTable } from './job-search-table';

describe('JobSearchTable', () => {
  let component: JobSearchTable;
  let fixture: ComponentFixture<JobSearchTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSearchTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSearchTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
