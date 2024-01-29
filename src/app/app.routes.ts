import { Routes } from '@angular/router';
import { UserLandingComponent } from './components/layouts/user-landing/user-landing.component';
import { AuthGuard } from './auth.guard';
import { AuthComponent } from './components/layouts/auth/auth.component';
import { HomePageComponent } from './components/core-components/home-page/home-page.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'home', component: HomePageComponent },
  {
    path: 'user-landing',
    component: UserLandingComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
