import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTestString } from '../../../store/api-central.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-landing.component.html',
  styleUrl: './user-landing.component.scss',
})
export class UserLandingComponent {
  store = inject(Store);
  testString$ = this.store.select(selectTestString);
}
