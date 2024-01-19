import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthMode } from '../../../enums/authMode';
import { AuthService } from '../../../services/auth.service';
import { AuthenticationRequestDto } from '../../../interfaces/authenticationRequestDto';
import { RegisterRequestDto } from '../../../interfaces/registerRequestDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  currentAuthMode: AuthMode = AuthMode.login;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.currentAuthMode = AuthMode.loggedin;
    }
  }

  formLogin = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  formRegister = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  public onSwitchMode(): void {
    if (this.currentAuthMode === AuthMode.login) {
      this.currentAuthMode = AuthMode.register;
      return;
    }
    this.currentAuthMode = AuthMode.login;
  }

  public logout(): void {
    this.authService.logout();
    this.currentAuthMode = AuthMode.login;
  }

  onSubmit(): void {
    switch (this.currentAuthMode) {
      case AuthMode.login:
        this.authService.login(this.formLogin.value as AuthenticationRequestDto);
        this.currentAuthMode = AuthMode.loggedin;
        console.log(this.formLogin.value);
        this.router.navigateByUrl('/user-landing');
        break;
      case AuthMode.register:
        this.authService.register(this.formRegister.value as RegisterRequestDto);
        this.currentAuthMode = AuthMode.loggedin;
        console.log(this.formRegister.value);
        this.router.navigateByUrl('/user-landing');
        break;
      case AuthMode.loggedin:
        console.log('Already logged in')
        break;
      default:
        console.error('Invalid auth mode');
        break;
    }
  }

}
