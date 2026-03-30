import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneJobsTable } from './done-jobs-table';

describe('DoneJobsTable', () => {
  let component: DoneJobsTable;
  let fixture: ComponentFixture<DoneJobsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneJobsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneJobsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
