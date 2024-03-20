import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, inject, signal } from '@angular/core';
import { AuthenticationRequestDto } from '../types/authenticationRequestDto';
import { AuthenticationResponceDto } from '../types/authenticationResponceDto';
import { Observable } from 'rxjs';
import { RegisterRequestDto } from '../types/registerRequestDto';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthMode } from '../enums/authMode';
import * as constants from '../app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  https = inject(HttpClient);
  cookieService = inject(CookieService);
  public currentAuthMode = signal(AuthMode.login);
  public loadingMessage = signal(constants.LOADING_MESSAGE);
  private inactivityTimeout: any;

  constructor(@Inject(DOCUMENT) private document: Document) {
    ['click', 'keydown', 'mousemove'].forEach((event) => {
      document.addEventListener(event, () => this.resetInactivityTimeout());
    });
  }

  public login(authRequest: AuthenticationRequestDto) {
    this.currentAuthMode.set(AuthMode.loginLoading);
    return this.https.post<AuthenticationResponceDto>(
      environment.API_URL + `/auth/user/authenticate`,
      authRequest,
      { withCredentials: true }
    );
  }

  public logout(): Observable<any> {
    this.currentAuthMode.set(AuthMode.logoutLoading);
    return this.https.post(
      environment.API_URL + `/auth/user/logout`,
      {},
      { withCredentials: true }
    );
  }

  public register(regRequest: RegisterRequestDto) {
    this.currentAuthMode.set(AuthMode.registerLoading);
    return this.https.post<AuthenticationResponceDto>(
      environment.API_URL + `/auth/user/register`,
      regRequest,
      { withCredentials: true }
    );
  }

  public reloadSessionRefresh(): Observable<AuthenticationResponceDto | null> {
    return this.https.get<AuthenticationResponceDto>(
      environment.API_URL + `/auth/user/validateTokenAndRefreshSession`,
      {
        withCredentials: true,
      }
    );
  }

  private resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);

    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, constants.INACTIVITY_TIMEOUT_DURATION);
  }
}
