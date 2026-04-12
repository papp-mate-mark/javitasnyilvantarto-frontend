import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsTable } from './jobs-table';
import { FullPersonData } from '../../model/full-person-data';

describe('JobsTable', () => {
  let component: JobsTable;
  let fixture: ComponentFixture<JobsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(JobsTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('person', {} as FullPersonData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
