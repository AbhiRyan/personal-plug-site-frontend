import { ApiCentralState } from './ApiCentralState';
import { AuthState } from './authState';

export interface AppState {
  apiCentralState: ApiCentralState;
  authState: AuthState;
}

export const initialState: AppState = {
  apiCentralState: {
    testString: null,
  },
  authState: {
    user: null,
  },
};
