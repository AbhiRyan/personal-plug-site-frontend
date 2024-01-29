import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { appFeature } from './store/app.reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  store = inject(Store);
  router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isLoggedin().pipe(
      map((isLoggedIn) => {
        return isLoggedIn;
      })
    );
  }

  isLoggedin(): Observable<boolean> {
    return this.store.select(appFeature.selectAuthUser).pipe(
      map((user) => {
        console.info('[AuthGuard] user in state: ', user);
        return !!user;
      })
    );
  }
}
