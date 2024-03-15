import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { Store } from '@ngrx/store';
import { appActions } from '../../../store/app.actions';
import { map, Subscription } from 'rxjs';
import { appFeature } from '../../../store/app.reducers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  store = inject(Store);
  currentAuthMode: AuthMode = AuthMode.login;
  private subscription: Subscription | undefined;
  user$ = this.store.select(appFeature.selectAuthUser);
  userName$ = this.store.select(appFeature.selectAuthUserName);
  enabled: boolean = false;

  ngOnInit(): void {
    this.subscription = this.store
      .select(appFeature.selectAuthUser)
      .pipe(
        map((user) => {
          if (user) {
            this.currentAuthMode = AuthMode.logout;
            return true;
          }
          this.currentAuthMode = AuthMode.login;
          return false;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

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
    if (this.currentAuthMode === AuthMode.login) {
      this.currentAuthMode = AuthMode.register;
      return;
    }
    this.currentAuthMode = AuthMode.login;
  }

  public logout(): void {
    this.store.dispatch(appActions.logoutUser());
  }

  onSubmit(): void {
    switch (this.currentAuthMode) {
      case AuthMode.login:
        this.store.dispatch(
          appActions.loginUser({
            authRequestDto: this.formLogin.value as AuthenticationRequestDto,
          })
        );
        // this.store
        //   .select(appFeature.selectAuthUser)
        //   .pipe(map((user) => console.log('user from store: ', user)));
        break;
      case AuthMode.register:
        this.store.dispatch(
          appActions.registerUser({
            registerRequestDto: this.userDtoFromRegisterForm(this.formRegister),
          })
        );
        break;
      case AuthMode.logout:
        console.warn('Already logged in');
        break;
      default:
        console.warn('Invalid auth mode');
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
}
