import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import {
  loginFailure,
  loginSuccess,
  loginUser,
  logoutFailure,
  logoutUser,
  registerUser,
} from './auth.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { User } from '../types/user';
import { AuthenticationResponceDto } from '../types/authenticationResponceDto';

@Injectable()
export class AuthEffects {
  auth = inject(AuthService);
  constructor(private actions$: Actions, private router: Router) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      exhaustMap((action) => {
        return this.auth.login(action.authRequestDto).pipe(
          map((res: AuthenticationResponceDto) => {
            this.router.navigate(['/user-landing']);
            return loginSuccess({ user: res as User });
          }),
          catchError((error) => {
            console.error('There was an error during the login process', error);
            return of(loginFailure({ error }));
          })
        );
      })
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      exhaustMap((action) => {
        return this.auth.register(action.registerRequestDto).pipe(
          map((res: AuthenticationResponceDto) => {
            this.router.navigate(['/user-landing']);
            return loginSuccess({ user: res as User });
          }),
          catchError((error) => {
            console.error(
              'There was an error during the registration process',
              error
            );
            return of(loginFailure({ error }));
          })
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),
      exhaustMap((action) => {
        return this.auth.logout().pipe(
          map(() => {
            this.router.navigate(['/']);
            return logoutUser();
          }),
          catchError((error) => {
            console.error(
              'There was an error during the logout process',
              error
            );
            return of(logoutFailure({ error }));
          })
        );
      })
    )
  );
}
