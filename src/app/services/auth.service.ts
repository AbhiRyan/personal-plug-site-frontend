import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, inject } from '@angular/core';
import { AuthenticationRequestDto } from '../types/authenticationRequestDto';
import { AuthenticationResponceDto } from '../types/authenticationResponceDto';
import { EMPTY, Observable, catchError, throwError } from 'rxjs';
import { RegisterRequestDto } from '../types/registerRequestDto';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import * as constants from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  https = inject(HttpClient);
  cookieService = inject(CookieService);
  private inactivityTimeout: any;

  constructor(@Inject(DOCUMENT) private document: Document) {
    ['click', 'keydown', 'mousemove'].forEach((event) => {
      document.addEventListener(event, () => this.resetInactivityTimeout());
    });
  }

  public login(
    authRequest: AuthenticationRequestDto
  ): Observable<AuthenticationResponceDto> {
    return this.https.post<AuthenticationResponceDto>(
      environment.API_URL + `/auth/user/authenticate`,
      authRequest,
      { withCredentials: true }
    );
  }

  public logout(): Observable<any> {
    return this.https.post(
      environment.API_URL + `/auth/user/logout`,
      {},
      { withCredentials: true }
    );
  }

  public register(
    regRequest: RegisterRequestDto
  ): Observable<AuthenticationResponceDto> {
    return this.https.post<AuthenticationResponceDto>(
      environment.API_URL + `/auth/user/register`,
      regRequest,
      { withCredentials: true }
    );
  }

  public reloadSessionRefresh(): Observable<AuthenticationResponceDto | null> {
    return this.https
      .get<AuthenticationResponceDto>(
        environment.API_URL + `/auth/user/validateTokenAndRefreshSession`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            console.debug('No session cookie found');
            return EMPTY;
          }
          console.debug('Error refreshing session', error.message);
          return EMPTY;
        })
      );
  }

  private resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);

    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, constants.INACTIVITY_TIMEOUT_DURATION);
  }
}
