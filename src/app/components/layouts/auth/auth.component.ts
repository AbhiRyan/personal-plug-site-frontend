import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthMode } from '../../../enums/authMode';
import { AuthService } from '../../../services/auth.service';
import { AuthenticationRequestDto } from '../../../types/authenticationRequestDto';
import { RegisterRequestDto } from '../../../types/registerRequestDto';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  loginUser,
  logoutUser,
  registerUser,
} from '../../../store/auth.actions';
import { selectIsLoggedIn } from '../../../store/auth.selectors';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  store = inject(Store);
  currentAuthMode: AuthMode = AuthMode.login;

  ngOnInit(): void {
    if (this.store.select(selectIsLoggedIn)) {
      this.currentAuthMode = AuthMode.logout;
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
    password: ['', Validators.required],
  });

  public onSwitchMode(): void {
    if (this.currentAuthMode === AuthMode.login) {
      this.currentAuthMode = AuthMode.register;
      return;
    }
    this.currentAuthMode = AuthMode.login;
  }

  public logout(): void {
    this.store.dispatch(logoutUser());
    this.currentAuthMode = AuthMode.login;
  }

  onSubmit(): void {
    switch (this.currentAuthMode) {
      case AuthMode.login:
        this.store.dispatch(
          loginUser({
            authRequestDto: this.formLogin.value as AuthenticationRequestDto,
          })
        );
        this.currentAuthMode = AuthMode.logout;
        console.log(this.formLogin.value);
        break;
      case AuthMode.register:
        this.store.dispatch(
          registerUser({
            registerRequestDto: this.formRegister.value as RegisterRequestDto,
          })
        );
        this.currentAuthMode = AuthMode.logout;
        console.log(this.formRegister.value);
        break;
      case AuthMode.logout:
        console.log('Already logged in');
        break;
      default:
        console.error('Invalid auth mode');
        break;
    }
  }
}
