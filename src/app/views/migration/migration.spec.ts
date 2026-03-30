import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Migration } from './migration';
import { testHttpClientProviders } from '../../provider/test-providers';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideStore } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('Migration', () => {
  let component: Migration;
  let fixture: ComponentFixture<Migration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Migration],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Migration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
