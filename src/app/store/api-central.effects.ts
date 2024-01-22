import { Injectable, inject } from '@angular/core';
import { ApiCentralService } from '../services/api-central.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import {
  getTestString,
  getTestStringFailure,
  getTestStringSuccess,
} from './api-central.actions';
import { of } from 'rxjs';

@Injectable()
export class ApiCentralEffects {
  apiCentral = inject(ApiCentralService);
  constructor(private actions$: Actions, private router: Router) {}

  getTestString$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTestString),
      exhaustMap((action) => {
        return this.apiCentral.getTestString().pipe(
          map((res: { testString: string }) => {
            return getTestStringSuccess(res.testString);
          }),
          catchError((error) => {
            console.error(
              'There was an error during the getTestString process',
              error
            );
            return of(getTestStringFailure({ error }));
          })
        );
      })
    )
  );
}
