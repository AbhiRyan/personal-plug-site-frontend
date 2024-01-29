import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { appActions } from './app.actions';
import { initialState } from '../types/states/AppState';

export const appReducer = createReducer(
  initialState,
  on(appActions.loginSuccess, (appState, { user }) => {
    console.info('Login success');
    return {
      ...appState,
      authState: {
        ...appState.authState,
        user: user,
      },
    };
  }),
  on(appActions.loginFailure, (appState, { error }) => {
    console.error('There was an error during the login process:-', error);
    console.error('current state: ', appState);
    return { ...appState };
  }),
  on(appActions.logoutSuccess, (appState) => {
    console.info('Logout success');
    return {
      ...appState,
      authState: {
        ...appState.authState,
        user: null,
      },
    };
  }),
  on(appActions.logoutFailure, (appState, { error }) => {
    console.error('There was an error during the logout process:-', error);
    console.error('current state: ', appState);
    return { ...appState };
  }),
  on(appActions.getTestStringSuccess, (appState, { testString }) => {
    console.info('Get test string success: ', testString);
    return {
      ...appState,
      apiCentralState: {
        ...appState.apiCentralState,
        testString: testString,
      },
    };
  }),
  on(appActions.getTestStringFailure, (appState, { error }) => {
    console.info('Get test string failure: ', error);
    return {
      ...appState,
      apiCentralState: {
        ...appState.apiCentralState,
        testString: null,
      },
    };
  })
);

export const appFeature = createFeature({
  name: 'app',
  reducer: appReducer,
  extraSelectors: ({ selectAppState }) => ({
    selectAuthUser: createSelector(
      selectAppState,
      (state) => state.authState.user
    ),
    selectAuthUserName: createSelector(selectAppState, (state) => {
      const user = state.authState.user;
      if (user) {
        return user.firstName + ' ' + user.lastName;
      }
      return null;
    }),
    selectIsLoggedIn: createSelector(
      selectAppState,
      (state) => !!state.authState.user
    ),
    selectTestString: createSelector(
      selectAppState,
      (state) => state.apiCentralState.testString
    ),
  }),
});
