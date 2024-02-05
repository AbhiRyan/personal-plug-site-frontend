import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { appFeature } from '../store/app.reducers';
import { Role } from '../enums/role';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  store = inject(Store);
  router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isAdmin().pipe(
      map((isAdmin) => {
        if (!isAdmin) {
          this.router.navigate(['/home']);
        }
        return isAdmin;
      })
    );
  }

  isAdmin(): Observable<boolean> {
    return this.store.select(appFeature.selectAuthUser).pipe(
      map((user) => {
        return user?.role === Role.admin;
      })
    );
  }
}
