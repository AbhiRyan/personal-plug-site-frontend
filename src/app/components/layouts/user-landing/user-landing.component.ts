import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { appFeature } from '../../../store/app.reducers';
import { appActions } from '../../../store/app.actions';

@Component({
  selector: 'app-user-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-landing.component.html',
  styleUrl: './user-landing.component.scss',
})
export class UserLandingComponent implements OnInit {
  store = inject(Store);
  testString$ = this.store.select(appFeature.selectTestString);

  ngOnInit(): void {
    this.store.dispatch(appActions.getTestString());
  }
}
