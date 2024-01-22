import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../types/states/authState';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsLoggedIn = createSelector(selectUser, (user) => !!user);
