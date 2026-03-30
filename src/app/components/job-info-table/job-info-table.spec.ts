import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInfoTable } from './job-info-table';
import { FullPersonData } from '../../model/full-person-data';

describe('JobInfoTable', () => {
  let component: JobInfoTable;
  let fixture: ComponentFixture<JobInfoTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobInfoTable],
    }).compileComponents();

    fixture = TestBed.createComponent(JobInfoTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('person', {} as FullPersonData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
