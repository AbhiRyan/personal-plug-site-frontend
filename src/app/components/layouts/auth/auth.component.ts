import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthMode } from '../../../enums/authMode';
import { AuthenticationRequestDto } from '../../../types/authenticationRequestDto';
import { RegisterRequestDto } from '../../../types/registerRequestDto';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as constants from '../../../app.constants';
import { AuthService } from '../../../services/auth.service';
import { AppStore } from '../../../store/app.stroe';
import { SpinnerComponent } from '../../sub-components/spinner/spinner.component';
import { ErrorMessageComponent } from '../../sub-components/error-message/error-message.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SpinnerComponent,
    ErrorMessageComponent,
  ],
})
export class AuthComponent {
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  store = inject(AppStore);
  authService = inject(AuthService);
  constants = constants;

  loadingMessage: string = constants.LOADING_MESSAGE;
  user = this.store.authState().user;
  userName$ = this.user ? this.user.firstName + ' ' + this.user.lastName : '';
  enabled = false;
  authModeEnum = AuthMode;

  formLogin = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  formRegister = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    validatePassword: ['', [Validators.required, this.passwordMatchValidator]],
  });

  public onSwitchMode(): void {
    if (this.getCurrentAuthMode() === AuthMode.login) {
      this.store.setAuthMode(AuthMode.register);
      return;
    }
    this.store.setAuthMode(AuthMode.login);
  }

  public logout(): void {
    this.store.logoutUser();
  }

  onSubmit(): void {
    switch (this.getCurrentAuthMode()) {
      case AuthMode.login:
        this.store.loginUser(this.formLogin.value as AuthenticationRequestDto);
        break;
      case AuthMode.register:
        this.store.registerUser(this.formRegister.value as RegisterRequestDto);
        break;
      case AuthMode.logout:
        console.warn(constants.ALREADY_LOGGED_IN_MESSAGE);
        break;
      default:
        console.warn(constants.APP_ERROR_MESSAGE);
        break;
    }
  }

  passwordMatchValidator(formGroup: FormGroup): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get('password');
      const validatePasswordControl = formGroup.get('validatePassword');

      if (passwordControl && validatePasswordControl) {
        return passwordControl.value === validatePasswordControl.value
          ? null
          : { mismatch: true };
      }
      return null;
    };
  }

  userDtoFromRegisterForm(form: FormGroup): RegisterRequestDto {
    return {
      firstName: form.get('firstName')?.value,
      lastName: form.get('lastName')?.value,
      email: form.get('email')?.value,
      password: form.get('password')?.value,
    };
  }

  getCurrentAuthMode(): AuthMode {
    return this.store.authMode();
  }
}
