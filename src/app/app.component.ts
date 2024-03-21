import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './components/core-components/default-layout/default-layout.component';
import { AppStore } from './store/app.stroe';
import { STATE_SIGNAL } from '@ngrx/signals/src/state-signal';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, DefaultLayoutComponent],
})
export class AppComponent implements OnInit {
  title = 'personal-plug-site';
  store = inject(AppStore);

  ngOnInit(): void {
    console.log(this.store.authState().user);
    if (!this.store.authState().user) {
      this.store.refreshSession();
    }
  }
}
