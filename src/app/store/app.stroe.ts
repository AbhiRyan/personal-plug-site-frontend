import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { initialState } from '../types/states/AppState';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthMode } from '../enums/authMode';
import { AuthenticationRequestDto } from '../types/authenticationRequestDto';
import { RegisterRequestDto } from '../types/registerRequestDto';
import * as constants from '../app.constants';
import { ApiCentralService } from '../services/api-central.service';
import { Router } from '@angular/router';

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      apiCentralService = inject(ApiCentralService),
      router = inject(Router)
    ) => ({
      //--------------------------------------------------------
      registerUser(registerRequestDto: RegisterRequestDto) {
        patchState(store, { authMode: AuthMode.registerLoading });
        authService.register(registerRequestDto).subscribe({
          next: (res) => {
            patchState(store, {
              authState: { user: res.userDto },
              authMode: AuthMode.logout,
            });
            router.navigate(['/user-landing']);
          },
          error: (error: any) => {
            patchState(store, {
              authState: { user: null },
              authMode: AuthMode.error,
            });
            console.error(constants.REGISTER_ERROR_MESSAGE, error);
          },
        });
      },
      //--------------------------------------------------------
      loginUser(authRequestDto: AuthenticationRequestDto) {
        patchState(store, { authMode: AuthMode.loginLoading });
        authService.login(authRequestDto).subscribe({
          next: (res) => {
            patchState(store, {
              authState: { user: res.userDto },
              authMode: AuthMode.logout,
            });
            router.navigate(['/user-landing']);
          },
          error: (error: any) => {
            patchState(store, {
              authState: { user: null },
              authMode: AuthMode.error,
            });
            console.error(constants.LOGIN_ERROR_MESSAGE, error);
          },
        });
      },
      //--------------------------------------------------------
      logoutUser() {
        patchState(store, { authMode: AuthMode.logoutLoading });
        authService.logout().subscribe({
          next: () => {
            patchState(store, {
              authState: { user: null },
              authMode: AuthMode.login,
            });
          },
          error: (error: any) => {
            patchState(store, { authMode: AuthMode.error });
            console.error(constants.LOGOUT_ERROR_MESSAGE, error);
          },
        });
      },
      //--------------------------------------------------------
      refreshSession() {
        authService.reloadSessionRefresh().subscribe((res) => {
          if (res) {
            patchState(store, {
              authState: { user: res.userDto },
              authMode: AuthMode.logout,
            });
          } else {
            patchState(store, {
              authState: { user: null },
              authMode: AuthMode.login,
            });
            console.warn(constants.REFRESH_SESSION_FAILURE_MESSAGE);
          }
        });
      },
      //--------------------------------------------------------
      getTestString() {
        apiCentralService.getTestString().subscribe({
          next: (res) => {
            patchState(store, { apiCentralState: { testString: res.message } });
          },
          error: (error: any) => {
            console.error(constants.GET_TESTSTRING_ERROR_MESSAGE, error);
          },
        });
      },
      //--------------------------------------------------------
      setAuthMode(mode: AuthMode) {
        patchState(store, { authMode: mode });
      },
      //--------------------------------------------------------
    })
  )
);
