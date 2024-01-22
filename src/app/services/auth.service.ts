import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { AuthenticationRequestDto } from '../types/authenticationRequestDto';
import { AuthenticationResponceDto } from '../types/authenticationResponceDto';
import { catchError, map, of, throwError } from 'rxjs';
import { RegisterRequestDto } from '../types/registerRequestDto';
import { User } from '../types/user';
import { API_URL, INACTIVITY_TIMEOUT_DURATION } from '../app.constants';
import { Store } from '@ngrx/store';
import { loginUser, logoutUser } from '../store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  https = inject(HttpClient);
  private inactivityTimeout: any;

  constructor() {
    // Reset the inactivity timeout whenever a click, keydown, or mousemove event occurs
    ['click', 'keydown', 'mousemove'].forEach((event) => {
      document.addEventListener(event, () => this.resetInactivityTimeout());
    });
  }

  public login(authRequest: AuthenticationRequestDto) {
    return this.https.post<AuthenticationResponceDto>(
      API_URL + `/api/user/authenticate`,
      { authRequest }
    );
  }

  public logout() {
    this.https.post(API_URL + `/api/user/logout`, {});
    return of(null);
  }

  public register(authRequest: RegisterRequestDto) {
    return this.https.post<AuthenticationResponceDto>(
      API_URL + `/api/user/register`,
      { authRequest }
    );
  }

  private resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);

    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, INACTIVITY_TIMEOUT_DURATION);
  }
}
