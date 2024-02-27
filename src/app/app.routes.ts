import { Routes } from '@angular/router';
import { UserLandingComponent } from './components/layouts/user-landing/user-landing.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './components/layouts/auth/auth.component';
import { HomePageComponent } from './components/core-components/home-page/home-page.component';
import { AdminComponent } from './components/core-components/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomePageComponent },
  {
    path: 'user-landing',
    component: UserLandingComponent,
    canActivate: [AuthGuard],
  },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
