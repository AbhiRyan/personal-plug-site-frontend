import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService: AuthService = inject(AuthService);
  router = inject(Router);


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isLoggedin()) {
      return true;
    } else {
      this.router.navigateByUrl('/auth');
      return false;
    }
  }

  isLoggedin(): boolean {
    return this.authService.currentUserSignal !== null && this.authService.currentUserSignal !== undefined;
  }
}