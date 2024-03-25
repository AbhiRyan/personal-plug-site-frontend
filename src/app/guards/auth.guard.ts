import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AppStore } from '../store/app.stroe';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  store = inject(AppStore);
  router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLoggedin()) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }

  isLoggedin(): boolean {
    return this.store.authState().user !== null;
  }
}
