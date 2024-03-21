import { AuthMode } from '../../enums/authMode';
import { ApiCentralState } from './ApiCentralState';
import { AuthState } from './authState';

export type AppState = {
  apiCentralState: ApiCentralState;
  authState: AuthState;
  authMode: AuthMode;
};

export const initialState: AppState = {
  apiCentralState: {
    testString: null,
  },
  authState: {
    user: null,
  },
  authMode: AuthMode.login,
};
