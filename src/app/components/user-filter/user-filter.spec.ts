import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFilter } from './user-filter';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';

describe('UserFilter', () => {
  let component: UserFilter;
  let fixture: ComponentFixture<UserFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFilter],
      providers: [provideStore({ currentUser: currentUserReducer })],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
