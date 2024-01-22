import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from './store/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  store = inject(Store);
  router = inject(Router);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isLoggedin().pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

  isLoggedin(): Observable<boolean> {
    return this.store.select(selectIsLoggedIn);
  }
}
