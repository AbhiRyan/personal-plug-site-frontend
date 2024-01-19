import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { AuthenticationRequestDto } from '../interfaces/authenticationRequestDto';
import { AuthenticationResponceDto } from '../interfaces/authenticationResponceDto';
import { catchError, map, throwError } from 'rxjs';
import { RegisterRequestDto } from '../interfaces/registerRequestDto';
import { User } from '../interfaces/user';
import { API_URL, INACTIVITY_TIMEOUT_DURATION } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  https = inject(HttpClient);
  currentUserSignal = signal<User | undefined | null>(undefined);
  private inactivityTimeout: any;

  constructor() {
    // Reset the inactivity timeout whenever a click, keydown, or mousemove event occurs
    ['click', 'keydown', 'mousemove'].forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimeout());
    });
  }

  public login(authRequest: AuthenticationRequestDto) {
    return this.https.post<AuthenticationResponceDto>(API_URL + `/api/user/authenticate`, { authRequest })
      .pipe(
        map(res => {
          if (res) {
            this.currentUserSignal.set(res as User);
          }
        }),
        catchError(error => {
          console.error('There was an error during the login process', error);
          return throwError(() => new Error('login error'));
        })
      );
  }

  public logout() {
    this.https.post(API_URL + `/api/user/logout`, {})
      .pipe(map(() => {
        this.currentUserSignal.set(null);
      }),
        catchError(error => {
          console.error('There was an error during the logout process', error);
          return throwError(() => new Error('logout error'));
        })
      );
  }

  public isLoggedIn(): boolean {
    return this.currentUserSignal !== null && this.currentUserSignal !== undefined;
  }

  public register(authRequest: RegisterRequestDto) {
    return this.https.post<AuthenticationResponceDto>(API_URL + `/api/user/register`, { authRequest })
      .pipe(
        map(res => {
          if (res) {
            this.currentUserSignal.set(res as User);
          }
        }),
        catchError(error => {
          console.error('There was an error during the registration process', error);
          return throwError(() => new Error('registration error'));
        })
      );
  }

  private resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);

    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, INACTIVITY_TIMEOUT_DURATION);
  }
}
