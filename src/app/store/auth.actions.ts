import { createAction, props } from '@ngrx/store';
import { AuthenticationRequestDto } from '../types/authenticationRequestDto';
import { RegisterRequestDto } from '../types/registerRequestDto';
import { User } from '../types/user';

export const registerUser = createAction(
  '[Auth] Register User',
  props<{ registerRequestDto: RegisterRequestDto }>()
);
export const loginUser = createAction(
  '[Auth] Login User',
  props<{ authRequestDto: AuthenticationRequestDto }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);
export const logoutUser = createAction('[Auth] Logout User');
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: any }>()
);
