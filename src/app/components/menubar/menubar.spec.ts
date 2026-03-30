import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menubar } from './menubar';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('Menubar', () => {
  let component: Menubar;
  let fixture: ComponentFixture<Menubar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menubar],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter([]),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Menubar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
