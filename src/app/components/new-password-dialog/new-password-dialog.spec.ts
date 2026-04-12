import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPasswordDialog } from './new-password-dialog';
import { testHttpClientProviders } from '../../provider/test-providers';
import { provideStore } from '@ngrx/store';
import { currentUserReducer } from '../../state/current-user.reducer';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { MessageService } from 'primeng/api';

describe('NewPasswordDialog', () => {
  let component: NewPasswordDialog;
  let fixture: ComponentFixture<NewPasswordDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordDialog],
      providers: [
        ...testHttpClientProviders,
        provideStore({ currentUser: currentUserReducer }),
        provideRouter(routes),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPasswordDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dialogVisible', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
