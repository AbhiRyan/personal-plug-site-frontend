import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { appFeature } from '../../../store/app.reducers';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
})
export class MainNavbarComponent {
  store = inject(Store);
  user$ = this.store.select(appFeature.selectAuthUser);
}