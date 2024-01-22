import { createReducer, on } from '@ngrx/store';
import { loginFailure, loginSuccess, logoutUser } from './auth.actions';
import { AuthState } from '../types/states/authState';
import { User } from '../types/user';

export const initialState: AuthState = {
  user: null,
};

function updateUser(state: AuthState, { user }: { user: User }): AuthState {
  return { ...state, user };
}

export const authReducer = createReducer<AuthState>(
  initialState,
  on(loginSuccess, updateUser),
  on(logoutUser, (state) => ({ ...state, user: null })),
  on(loginFailure, (state) => ({ ...state, user: null }))
);
