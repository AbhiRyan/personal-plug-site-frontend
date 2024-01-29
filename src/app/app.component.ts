import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './components/core-components/default-layout/default-layout.component';
import { Store } from '@ngrx/store';
import { appActions } from './store/app.actions';
import { appFeature } from './store/app.reducers';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, DefaultLayoutComponent],
})
export class AppComponent implements OnInit {
  title = 'personal-plug-site';
  store = inject(Store);

  ngOnInit(): void {
    this.store.select(appFeature.selectAuthUser).subscribe((user) => {
      if (!user) {
        this.store.dispatch(appActions.refreshSession());
      }
    });
  }
}
