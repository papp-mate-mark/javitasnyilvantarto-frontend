import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonData } from './person-data';
import { FullPersonData } from '../../model/full-person-data';

describe('PersonData', () => {
  let component: PersonData;
  let fixture: ComponentFixture<PersonData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonData],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonData);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('person', {} as FullPersonData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
