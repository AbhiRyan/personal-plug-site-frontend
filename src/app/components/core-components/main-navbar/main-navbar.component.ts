import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../store/app.stroe';
import { Role } from '../../../enums/role';
import { User } from '../../../types/user';
// import { appFeature } from '../../../store/app.reducers';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
})
export class MainNavbarComponent {
  store = inject(AppStore);
  isAdmin = this.getIsAdmin();
  router = inject(Router);

  routerNav(path: string) {
    this.router.navigate([path]);
  }

  getIsAdmin(): boolean {
    const user = this.store.authState().user;
    if (user) {
      return user.role === Role.admin;
    }
    return false;
  }
}
