import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSearchFilter } from './person-search-filter';

describe('PersonSearchFilter', () => {
  let component: PersonSearchFilter;
  let fixture: ComponentFixture<PersonSearchFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonSearchFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonSearchFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
