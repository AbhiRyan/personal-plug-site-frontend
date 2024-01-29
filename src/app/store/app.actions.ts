import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthenticationRequestDto } from '../types/authenticationRequestDto';
import { RegisterRequestDto } from '../types/registerRequestDto';
import { User } from '../types/user';

export const appActions = createActionGroup({
  source: 'App',
  events: {
    registerUser: props<{ registerRequestDto: RegisterRequestDto }>(),
    loginUser: props<{ authRequestDto: AuthenticationRequestDto }>(),
    loginSuccess: props<{ user: User }>(),
    logoutUser: emptyProps(),
    refreshSession: emptyProps(),
    loginFailure: props<{ error: any }>(),
    logoutFailure: props<{ error: any }>(),
    logoutSuccess: emptyProps(),
    getTestString: emptyProps(),
    getTestStringSuccess: props<{ testString: string }>(),
    getTestStringFailure: props<{ error: any }>(),
    clearTestString: emptyProps(),
  },
});
