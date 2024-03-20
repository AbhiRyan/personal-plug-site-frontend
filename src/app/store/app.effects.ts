import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { appActions } from './app.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthenticationResponceDto } from '../types/authenticationResponceDto';
import { Store } from '@ngrx/store';
import { AuthMode } from '../enums/authMode';

@Injectable()
export class AuthEffects {
  auth = inject(AuthService);
  store = inject(Store);
  constructor(private actions$: Actions, private router: Router) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.loginUser),
      exhaustMap((action) => {
        this.auth.currentAuthMode.set(AuthMode.loginLoading);
        return this.auth.login(action.authRequestDto).pipe(
          map((res: AuthenticationResponceDto) => {
            this.auth.currentAuthMode.set(AuthMode.logout);
            return appActions.loginSuccess({ user: res.userDto });
          }),
          tap(() => {
            this.router.navigate(['/user-landing']);
          }),
          catchError((error) => {
            this.auth.currentAuthMode.set(AuthMode.error);
            return of(appActions.loginFailure({ error }));
          })
        );
      })
    )
  );

  refreshSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.refreshSession),
      exhaustMap((action) => {
        return this.auth.reloadSessionRefresh().pipe(
          map((res: AuthenticationResponceDto | null) => {
            if (res) {
              return appActions.loginSuccess({ user: res.userDto });
            }
            return appActions.refreshSessionFailure();
          })
        );
      })
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.registerUser),
      exhaustMap((action) => {
        this.auth.currentAuthMode.set(AuthMode.registerLoading);
        return this.auth.register(action.registerRequestDto).pipe(
          map((res: AuthenticationResponceDto) => {
            this.auth.currentAuthMode.set(AuthMode.logout);
            return appActions.loginSuccess({ user: res.userDto });
          }),
          tap(() => {
            this.router.navigate(['/user-landing']);
          }),
          catchError((error) => {
            this.auth.currentAuthMode.set(AuthMode.error);
            return of(appActions.loginFailure({ error }));
          })
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.logoutUser),
      exhaustMap((action) => {
        return this.auth.logout().pipe(
          map(() => {
            return appActions.logoutSuccess();
          }),
          catchError((error) => {
            this.auth.currentAuthMode.set(AuthMode.error);
            return of(appActions.logoutFailure({ error }));
          })
        );
      })
    )
  );
}
