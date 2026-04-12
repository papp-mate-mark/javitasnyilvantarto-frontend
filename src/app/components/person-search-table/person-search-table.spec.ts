import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonSearchTable } from './person-search-table';

describe('PersonSearchTable', () => {
  let component: PersonSearchTable;
  let fixture: ComponentFixture<PersonSearchTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonSearchTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonSearchTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
