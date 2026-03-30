import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonInfo } from './person-info';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('PersonInfo', () => {
  let component: PersonInfo;
  let fixture: ComponentFixture<PersonInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonInfo],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
