import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Role } from '../enums/role';
import { AppStore } from '../store/app.stroe';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  store = inject(AppStore);
  router = inject(Router);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isAdmin()) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }

  isAdmin(): boolean {
    const user = this.store.authState().user;
    if (user) {
      return user.role === Role.admin;
    }
    return false;
  }
}
