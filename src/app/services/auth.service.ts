import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, inject } from '@angular/core';
import { AuthenticationRequestDto } from '../types/authenticationRequestDto';
import { AuthenticationResponceDto } from '../types/authenticationResponceDto';
import { Observable, of } from 'rxjs';
import { RegisterRequestDto } from '../types/registerRequestDto';
import { API_URL, INACTIVITY_TIMEOUT_DURATION } from '../app.constants';
import { CookieService } from 'ngx-cookie-service';

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

  public login(authRequest: AuthenticationRequestDto) {
    return this.https.post<AuthenticationResponceDto>(
      API_URL + `/auth/user/authenticate`,
      authRequest,
      { withCredentials: true }
    );
  }

  public logout(): Observable<any> {
    return this.https.post(
      API_URL + `/auth/user/logout`,
      {},
      { withCredentials: true }
    );
  }

  public register(regRequest: RegisterRequestDto) {
    return this.https.post<AuthenticationResponceDto>(
      API_URL + `/auth/user/register`,
      regRequest,
      { withCredentials: true }
    );
  }

  public checkCookie(): boolean {
    const cookieExists: boolean = this.cookieService.check('cookie-name');
    return cookieExists;
  }

  public reloadSessionRefresh(): Observable<AuthenticationResponceDto | null> {
    if (!this.checkCookie()) {
      return of(null);
    }
    return this.https.get<AuthenticationResponceDto>(
      API_URL + `/auth/user/validateTokenAndRefreshSession`,
      {
        withCredentials: true,
      }
    );
  }

  private resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);

    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, INACTIVITY_TIMEOUT_DURATION);
  }
}
