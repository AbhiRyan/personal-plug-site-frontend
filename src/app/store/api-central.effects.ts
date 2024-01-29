import { Injectable, inject } from '@angular/core';
import { ApiCentralService } from '../services/api-central.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { appActions } from './app.actions';

@Injectable()
export class ApiCentralEffects {
  apiCentral = inject(ApiCentralService);
  constructor(private actions$: Actions, private router: Router) {}

  getTestString$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.getTestString),
      exhaustMap(() => {
        return this.apiCentral.getTestString().pipe(
          map((res) => {
            return appActions.getTestStringSuccess({
              testString: res.message,
            });
          }),
          catchError((error) => {
            return of(appActions.getTestStringFailure({ error }));
          })
        );
      })
    )
  );
}
