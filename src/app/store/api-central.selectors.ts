import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApiCentralState } from '../types/states/ApiCentralState';

export const selectApiCentralState =
  createFeatureSelector<ApiCentralState>('apiCentral');

export const selectTestString = createSelector(
  selectApiCentralState,
  (state) => state.testString
);
