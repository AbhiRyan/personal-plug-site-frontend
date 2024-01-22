import { createAction } from '@ngrx/store';

export const getTestString = createAction('[ApiCentral] Get Test String');
export const getTestStringSuccess = createAction(
  '[ApiCentral] Get Test String Success',
  (testString: string) => ({ testString })
);
export const getTestStringFailure = createAction(
  '[ApiCentral] Get Test String Failure',
  (error: any) => ({ error })
);
export const clearTestString = createAction('[ApiCentral] Clear Test String');
