import { createReducer, on } from '@ngrx/store';
import { ApiCentralState } from '../types/states/ApiCentralState';
import { clearTestString, getTestStringSuccess } from './api-central.actions';

export const initialState: ApiCentralState = {
  testString: null,
};

export const apiCentralReducer = createReducer<ApiCentralState>(
  initialState,
  on(getTestStringSuccess, (state, { testString }) => ({
    ...state,
    testString,
  })),
  on(clearTestString, (state) => ({ ...state, testString: null }))
);
