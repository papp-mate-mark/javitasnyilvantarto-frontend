import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import LoginRequest from '../../model/login-request';
import { AuthenticationService } from '../../service/authentication.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CurrentUserApiActions } from '../../state/current-user.actions';
import { TextInput } from '../text-input/text-input';
import { PasswordInput } from '../password-input/password-input';
import { Router } from '@angular/router';
import { PageTitle } from '../../model/enums/PageTitle';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, ReactiveFormsModule, InputTextModule, TextInput, PasswordInput],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthenticationService);
  protected readonly store = inject(Store);
  private readonly router = inject(Router);
  parentGroup = new FormGroup({
    usernameControl: new FormControl<string>(''),
    passwordControl: new FormControl<string>(''),
  });

  submit() {
    this.authService
      .login(
        new LoginRequest(
          this.parentGroup.controls.usernameControl.value!,
          this.parentGroup.controls.passwordControl.value!
        )
      )
      .subscribe((value) => {
        this.store.dispatch(CurrentUserApiActions.retrievedCurrentUser({ loginResponse: value }));
        this.router.navigate([PageTitle.ACTIVE_JOBS]);
      });
  }
}
