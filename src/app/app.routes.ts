import { Routes } from '@angular/router';
import { UserLandingComponent } from './components/layouts/user-landing/user-landing.component';
import { AuthGuard } from './auth.guard';
import { AuthComponent } from './components/layouts/auth/auth.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'user-landing', component: UserLandingComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/auth', pathMatch: 'full' }
];
